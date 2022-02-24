const {queryItems, deleteItem} = require("../../modules/dynamoDB");
const DYNAMODB_TOKENS_TABLE = process.env.DYNAMODB_TOKENS_TABLE;
const getSuccessResponse = require('/utils/getSuccessResponse');

export const handler  = async (event) => {
    const id = event.pathParameters.id;
    try {
        let params = {
            TableName: DYNAMODB_TOKENS_TABLE,
            KeyConditionExpression: 'userId = :id',
            ExpressionAttributeValues: {
                ":id": id
            },
        };
        const user = await queryItems(params);
        if(!user.Items[0].userId)
        { console.log('User Not Found'); return { statusCode: 404 };  }
        for (let i=0; i<user.Count; i++){
            await deleteItem({
                TableName: DYNAMODB_TOKENS_TABLE,
                Key: {
                    userId: user.Items[i].userId,
                    tokenId: user.Items[i].tokenId,
                },
            });
        }
        const response = getSuccessResponse(params, 200)
        return response;
    } catch (error) { console.log(error); return { statusCode: 400 }; }
};
