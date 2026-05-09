const express = require("express");
const crypto = require("crypto");

const app = express();

const sessions = new Map();

function token() {
    return crypto.randomBytes(16).toString("hex");
}

function key() {
    return "KEY-" + token().slice(0,8);
}

// START
app.get("/start", (req, res) => {
    const id = token();

    sessions.set(id, {
        ip: req.ip,
        time: Date.now(),
        used: false
    });

    const returnUrl =
        `https://YOUR-RENDER-URL.onrender.com/complete?id=${id}`;

    const linkvertise =
        "https://your-linkvertise-link.com?r=" +
        encodeURIComponent(returnUrl);

    res.redirect(linkvertise);
});

// COMPLETE
app.get("/complete", (req, res) => {

    const s = sessions.get(req.query.id);

    if(!s) return res.send("Invalid session");

    if(s.ip !== req.ip)
        return res.send("IP mismatch");

    if(Date.now() - s.time < 5000)
        return res.send("Too fast");

    if(s.used)
        return res.send("Already used");

    s.used = true;

    const generated = key();

    res.send(`
        <h1>Your Key</h1>
        <h2>${generated}</h2>
    `);
});

app.listen(3000);
