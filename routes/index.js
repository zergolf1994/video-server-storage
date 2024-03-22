"use strict";
const express = require("express");
const router = express.Router();

const {
  serverDetail,
  serverCreate,
} = require("../controllers/server.controllers");

router.all("/", async (req, res) => {
  return res.status(200).json({ msg: "video-server-storage" });
});

// server
router.get("/server/detail", serverDetail);
router.get("/server/create", serverCreate);

router.all("*", async (req, res) => {
  return res.status(404).json({ error: true, msg: "not found!" });
});

module.exports = router;
