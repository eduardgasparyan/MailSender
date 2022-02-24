import {createItem, deleteItem, getItem, updateItem} from "../../modules/dynamoDB";
const DYNAMODB_USERS_TABLE = process.env.DYNAMODB_USERS_TABLE;
const getSuccessResponse = require('/utils/getSuccessResponse');

async function updateProperties(data, Item) {
    for (let key in data) {
        if (data[key] !== undefined) {
            Item[key] = data[key];
        }
    }
    return Item;
}

export const handler = async (event) => {
    let user = {};
    const id = event.pathParameters.id;
    const bodyParsed = JSON.parse(event.body);
    try {
        user = await getItem({
           TableName: DYNAMODB_USERS_TABLE,
           Key: {id: id},
        });
        const {Item} = user;
        if(!Item){ console.log('User Not Found'); return { statusCode: 404 }; }
        user = await updateProperties(bodyParsed, Item);
        user.updatedAt = new Date().toISOString();
        await deleteItem({
            TableName: DYNAMODB_USERS_TABLE,
            Key: {id: id},
        });
        await createItem({
            TableName: DYNAMODB_USERS_TABLE,
            Item: {...user},
        });
        const result = { Items: user };
        const response = getSuccessResponse(result, 201);
        return response;
    } catch (error) { console.log(error); return { statusCode: 400 }; }
};