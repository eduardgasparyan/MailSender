import {getItem} from "../../modules/dynamoDB";
const DYNAMODB_USERS_TABLE = process.env.DYNAMODB_USERS_TABLE;
const getSuccessResponse = require('/src/utils/getSuccessResponse');


export const handler = async (event) => {
    let user = {};
    const id = event.pathParameters.id;
    console.log(id);
    let response;
    try {
        user = await getItem({
           TableName: DYNAMODB_USERS_TABLE,
           Key: {'id': id},
        }); const { Item } = user;
        if(!Item){ console.log('User Not Found'); return {statusCode: 404}; }
        console.log(Item);
        const result = { Items: Item };
        response = getSuccessResponse(result, 201);
        return response;
    } catch (error) { console.log(error); return {statusCode: 400}; }
};