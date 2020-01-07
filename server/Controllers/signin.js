const express = require("express");
const router = express.Router();
const signinAuthentication = require("../Handlers/SignInHandlers/SiginHandler");


router.post("/", async (req, res) => {
     await signinAuthentication(req, res);
})

module.exports = router;