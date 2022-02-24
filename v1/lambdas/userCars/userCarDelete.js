import {deleteItem, getItem} from "../../modules/dynamoDB";
const DYNAMODB_CARS_TABLE = process.env.DYNAMODB_CARS_TABLE;
const getSuccessResponse = require('/utils/getSuccessResponse');


export const handler  = async (event) => {
    const id = event.pathParameters.id;
    const carId = event.pathParameters.carId;

    try {
        console.log(id, carId);
        const carCheck = await getItem({
            TableName: DYNAMODB_CARS_TABLE,
            Key: { userId: id , carId: carId, },
        }); const { Item } = carCheck; console.log(carCheck);
        if (!Item) {console.log('Car not found'); return {statusCode: 404};}
        await deleteItem({
            TableName: DYNAMODB_CARS_TABLE,
            Key: { userId: id , carId: carId, },
        });
        const result = { Items: carCheck };
        const response = getSuccessResponse(result, 201);
        return response;
    } catch (error) { console.log(error); return {statusCode: 400}; }
};