const express = require('express');
const slack = require('slack-invite');
const fetch = require('node-fetch');
const processSlackResponse = require('./src/slack-process');
const processImage = require('./src/image-process');
const nodeCache = require("node-cache");
const cache = new nodeCache();
const app = express();

app.get(`/slack/banner`, async (req, res) => {

    fetch(`https://slack.com/api/users.list?token=${process.env.SLACK_TOKEN}`).then(data => data.json())
        .then(async json => {
            let response = cache.get('slack-images');

            if (response == undefined) {
                response = await processImage(processSlackResponse(json));
                cache.set('slack-images', response, 172800);
            }

            res.end(response, 'binary');
        });
});

app.get(`/slack/invite/:email`, (req, res) => {
    slack({
        email: req.params.email, // set your email to invite here
        channels: `CNPN9U5U6`, // set your auto joined channels here
        token: process.env.SLACK_TOKEN // set your token here
    }, (response) => {
        if (response.statusCode && response.statusCode == 200 && response.body) {
            res.send(response.body);
        }
    });
});

app.listen(process.env.PORT || 3000);