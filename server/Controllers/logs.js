const express = require("express");
const router = express.Router();
const verifyToken = require("../Handlers/CommonHandlers/verifyToken");
const SearchHandler = require("../Handlers/CommonHandlers/SearchHandler")

router.get("/search", verifyToken, (req, res) => {
    SearchHandler(req, res, 'Log', 'createdAt')
})

module.exports = router;
