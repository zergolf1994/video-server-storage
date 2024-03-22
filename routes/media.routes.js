"use strict";
const express = require("express");
const router = express.Router();
const { getMediaHls } = require("../controllers/media.controllers");

router.get("/:slug", getMediaHls);
module.exports = router;
