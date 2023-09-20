//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");


const https = require("https");


const app = express();

app.use(express.static("public"));


app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

app.post("/", function (req, res) {
    var firstName = req.body.firstName;
    var secondName = req.body.lastName;
    var email = req.body.gmail;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: secondName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/6eaf1186b1";

    const appi = process.env.KEY

    const options = {
        method: "POST",
        auth: "shahid00:" + appi,
    }

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();
});


app.post("/failure", function (req, res) {
    res.redirect("/");
})




app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});


