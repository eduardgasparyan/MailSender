import {createItem} from "../../modules/dynamoDB";
import {v4 as uuidv4} from 'uuid';
const getSuccessResponse = require('/utils/getSuccessResponse');
const DYNAMODB_CARS_TABLE = process.env.DYNAMODB_CARS_TABLE;



export const handler  = async (event) => {
    let databaseCarCheck = null;
    const params = event.pathParameters.id;
    const bodyParsed = JSON.parse(event.body);
    try {
        if (databaseCarCheck === null) {
            const carData = {
                userId: params,
                carId: uuidv4(),
                car: bodyParsed.car,
            };
            await createItem({
                TableName: DYNAMODB_CARS_TABLE,
                Item: {...carData},
            });
            const result = { Items: carData };
            const response = getSuccessResponse(result, 201);
            return response;
        } else { console.log('Car already exists'); return { statusCode: 404 }; }
    } catch (error) { console.log(error); return {statusCode: 400}; }
};