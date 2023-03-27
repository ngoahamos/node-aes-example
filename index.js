const express = require('express');
const dotenv = require('dotenv');
const crypto = require('crypto');

const { generateString } = require('./util/util');

dotenv.config();

const app = express();
const port = process.env.PORT || 5050;

const bodyParser = require("body-parser");

app.use(bodyParser.json());


// this is for demostration purpose, this should be coming from 
// .env file
const algorithm = "aes-256-cbc";

// the key and iv will mostly be generated when the user logs in.
// the key should be a 32 bytes whiles iv 16 bytes for
// AES 256 CBC encryption 
const key = generateString(32);
const iv = generateString(16);

app.get('/', (req, res) => {
    res.send({ status: 'running', serverTime: new Date() });
});

app.get('/encrypt', (req, res) => {

    // example of data to encrypt.
    const data = {
        serverTime: new Date(),
        serverLanguage: 'Node js'
    };

    // convert data to be encrypted to string.
    const dataToEncrypt = JSON.stringify(data);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    // the output string is going to be a base64
    let encryptedData = cipher.update(dataToEncrypt, "utf-8", "base64");
    encryptedData += cipher.final("base64");


    return res.send({ encryptedData });

});

app.post('/decrypt', (req, res) => {

    const requestPayload = req.body;

    const dataToDecrypt = requestPayload.payload;

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decryptedData = decipher.update(dataToDecrypt, "base64", "utf-8");

    decryptedData += decipher.final("utf8");

    return res.send(JSON.parse(decryptedData));

})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});