import fetch from "node-fetch";
const loginFunction = async () => {
    const loginUsername = "root1";
    const loginPassword = "root12";
    const response = await fetch('https://qmnl5c9y20.execute-api.eu-north-1.amazonaws.com/edtest1/users/login', {
        method: 'POST',
        body: JSON.stringify({"username": loginUsername, "password": loginPassword})
    });
    const data = await response.json();
    const {Token} = data;
    const {id} = data.Item;
    localStorage.setItem(Token, id);
    console.log(data);
    return data;
};
const data = loginFunction();