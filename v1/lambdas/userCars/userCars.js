import {queryItems} from "../../modules/dynamoDB";
const DYNAMODB_CARS_TABLE = process.env.DYNAMODB_CARS_TABLE;
const getSuccessResponse = require('/utils/getSuccessResponse');

export const handler = async (event) => {
    let cars = {};
    const id = event.pathParameters.id;
    try {
        let params = {
            TableName: DYNAMODB_CARS_TABLE,
            KeyConditionExpression: 'userId = :id',
            ExpressionAttributeValues: {
                ":id": id
            },
        };
        console.log(params);
        cars = await queryItems(params);
        if(!cars){ console.log('Cars Not Found'); return {statusCode: 404}; }
        const result = { Items: cars };
        const response = getSuccessResponse(result, 201);
        console.log(response);
        return response;
    } catch (error) { console.log(error); return { statusCode: 400 };}
};