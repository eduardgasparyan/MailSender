import {createItem, deleteItem, getItem} from "../../modules/dynamoDB";
const DYNAMODB_CARS_TABLE = process.env.DYNAMODB_CARS_TABLE;
const getSuccessResponse = require('/src/utils/getSuccessResponse');

export const handler  = async (event) => {
    let carInDatabase = {};
    const carId = event.pathParameters.carId;
    const id = event.pathParameters.id;
    const bodyParsed = JSON.parse(event.body);
    try {
        carInDatabase = await getItem({
           TableName: DYNAMODB_CARS_TABLE,
           Key: {userId: id,carId: carId},
        }); const { Item } = carInDatabase;
        if (!Item) { console.log('Car not found'); return { statusCode: 404 }; }
        await deleteItem({
            TableName: DYNAMODB_CARS_TABLE,
            Key: {userId: id,carId: carId},
        });
        let params = {
            userId: Item.userId,
            carId: carId,
            changedFrom: id,
            car: bodyParsed.car,
        }
        await createItem({
            TableName: DYNAMODB_CARS_TABLE,
            Item: {...params},
        });
        const result = { Items: params };
        const response = getSuccessResponse(result, 201);
        return response;
    } catch (error) { console.log(error); return {statusCode:400}; }
};