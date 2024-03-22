"use strict";
const express = require("express");
const router = express.Router();

router.all("/", async (req, res) => {
  return res.status(200).json({ msg: "video-server-storage" });
});


router.use("/media", require("./media.routes"));
router.use("/server", require("./server.routes"));

router.all("*", async (req, res) => {
  return res.status(404).json({ error: true, msg: "not found!" });
});

module.exports = router;
