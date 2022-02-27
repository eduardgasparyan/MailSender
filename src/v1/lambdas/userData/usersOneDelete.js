import {deleteItem, getItem} from "../../modules/dynamoDB";
const getSuccessResponse = require('/src/utils/getSuccessResponse');

export const handler = async (event) => {
    const DYNAMODB_USERS_TABLE = process.env.DYNAMODB_USERS_TABLE;
    const DYNAMODB_CARS_TABLE = process.env.DYNAMODB_CARS_TABLE;
    const DYNAMODB_TOKENS_TABLE = process.env.DYNAMODB_TOKENS_TABLE;

    let user = {};
    const id = event.pathParameters.id;
    console.log(id);
    try {
        user = await getItem({
           TableName: DYNAMODB_USERS_TABLE,
           Key: { id: id },
           ProjectionExpression: 'username, password, email, id',
        }); const { Item } = user;
        console.log(user);
        if (!Item){ console.log('User Not Found'); return { statusCode: 404 }; }
        await deleteItem({
            TableName: DYNAMODB_USERS_TABLE,
            Key: {id: id},
        });
        await deleteItem({
            TableName: DYNAMODB_TOKENS_TABLE,
            Key: {userId: id},
        });
        await deleteItem({
            TableName: DYNAMODB_CARS_TABLE,
            Key: {userId: id},
        });
        const result = { Items: user };
        const response = getSuccessResponse(result, 201);
        return response;
    } catch (error) { console.log(error); return { statusCode: 400 } }
};