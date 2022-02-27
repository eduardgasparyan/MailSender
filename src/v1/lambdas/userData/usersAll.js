const {scanItems} = require("../../modules/dynamoDB");
const DYNAMODB_USERS_TABLE = process.env.DYNAMODB_USERS_TABLE;
const getSuccessResponse = require('/src/utils/getSuccessResponse');

export  const handler = async (event) => {
    let users = {};
    let response;
    try {
        users = await scanItems({
            TableName: DYNAMODB_USERS_TABLE,
        });
        console.log(users);
        if(!users) { return { statusCOde: 404 }; }
        const result = { Items: users };
        response = getSuccessResponse(result, 201);
        return response;
    } catch (Error) { console.log('Users not found'); return { statusCode: 400 }; }
};