import AWS from '../aws-core';

export const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const getItem = async (params) => {
    const query = {
        ...params,
    };

    const result = await dynamoDB.get(query).promise();
    return result;
};

export const updateItem = async (params) => {
    const query = {
        ...params,
    };

    const result = await dynamoDB.update(query).promise();
    return result;
};

export const createItem = async (params) => {
    const query = {
        ...params,
    };

    const result = await dynamoDB.put(query).promise();
    return result;
};

export const deleteItem = async (params) => {
    const query = {
        ...params,
    };

    const result = await dynamoDB.delete(query).promise();
    return result;
};

export const scanItems = async (params) => {
    const query = {
        ...params,
    };

    const result = await dynamoDB.scan(query).promise();
    return result;
};

export const queryItems = async (params) => {
    const query = {
        ...params,
    };

    const result = await dynamoDB.query(query).promise();
    return result;
};

// collect all fields in a JSON object into a DynamoDB expression
export const buildExpression = (body) => Object.keys(body)
    .map((key) => `${key} = :${key}`)
    .join(', ');

export const buildAttributes = (body) => Object.fromEntries(
    Object.entries(body).map(([key, value]) => [
        `:${key}`,
        typeof value === 'string' || typeof value === 'number'
            ? value
            : JSON.stringify(value),
    ]),
);

export const buildConditionExpression = (keys) => {
    let exp = '';
    const attrs = [];
    // id = :id
    Object.keys(keys).forEach((keyAttr) => {
        attrs.push(`${keyAttr} = :${keyAttr}`);
    });
    exp += attrs.join(' AND ');
    return exp;
};