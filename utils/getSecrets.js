module.exports = (passed) => {
    return {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": passed ? "Allow" : "Deny",
                "Action": [
                    "kms:Decrypt",
                    "ssm:GetParameter"
                ],
                "Resource": [
                    "arn:aws:kms:eu-north-1:025209864985:accessSecretKey",
                    "arn:aws:kms:eu-north-1:025209864985:refreshSecretKey"
                ]
            }
        ]
    }
}