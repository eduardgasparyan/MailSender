module.exports = (passed, { principalId, user }) => {
    return {
        "principalId": principalId,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": passed ? "Allow" : "Deny",
                    "Resource": "*",
                },
            ],
        },
        "context": {
            "user": user,
        },
    };
};