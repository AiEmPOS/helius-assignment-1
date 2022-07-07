const express = require("express");
const app = express();
const router = express.Router();
const sendgridEmail = require("@sendgrid/mail");
require("dotenv").config();

app.use(express.json());
app.use("/", router);

sendgridEmail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/send-email", function (req, res) {
    const sender = req.body.from;
    const receivers = req.body.to;
    const message = req.body.message;
    const templateId = req.body.templateID;
    const subject = req.body.subject;
    const email = {
        personalizations: [
            {
                to: receivers,
            },
        ],
        from: sender,
        content: message,
        template_id: templateId,
    };
    if (!subject) {
        email.subject = "Subject Empty";
    } else {
        email.subject = subject;
    }

    sendgridEmail
        .send(email)
        .then(() => {
            console.log("Email sent successfully");
            res.json({
                success : true,
                message: "Email sent successfully"
            });
            res.end();
        })
        .catch((error) => {
            res.json({
                success : false,
                message: "Failed to send an Email"
            });
            res.end();
            console.log(error.response.body.errors);
        });
});

app.listen(8080, function () {
    console.log("Listening at Port " + 8080);
});
