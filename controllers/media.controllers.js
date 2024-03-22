const axios = require("axios");
const { MediaModel } = require("../models/media.models");
const { extractIndex, extractMaster } = require("../utils/m3u8.utils");

exports.getMediaHls = async (req, res) => {
  try {
    const { slug } = req.params;
    const rows = await MediaModel.aggregate([
      { $match: { slug } },
      //server
      {
        $lookup: {
          from: "servers",
          localField: "serverId",
          foreignField: "_id",
          as: "servers",
          pipeline: [
            { $match: { type: "storage" } },
            {
              $project: {
                _id: 0,
                sv_ip: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          server: { $arrayElemAt: ["$servers", 0] },
        },
      },
      {
        $set: {
          m3u8Master: {
            $concat: [
              "http://",
              "127.0.0.1",
              ":8889/hls/",
              "$$ROOT.fileId",
              "/",
              "$$ROOT.file_name",
              "/master.m3u8",
            ],
          },
          m3u8Index: {
            $concat: [
              "http://",
              "127.0.0.1",
              ":8889/hls/",
              "$$ROOT.fileId",
              "/",
              "$$ROOT.file_name",
              "/index.m3u8",
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          m3u8Master: 1,
          m3u8Index: 1,
        },
      },
    ]);

    if (!rows?.length) {
      const error = new Error("Video Not found.");
      error.code = 404;
      throw error;
    }
    const row = rows[0];

    const { data: dataMaster, status: statusMaster } = await axios.get(
      row?.m3u8Master
    );
    if (statusMaster != 200) {
      const error = new Error("Video Error.");
      error.code = 500;
      throw error;
    }
    const master = await extractMaster(dataMaster.split(/\r?\n/));

    const { data: dataIndex, status: statusIndex } = await axios.get(
      row?.m3u8Index
    );
    if (statusIndex != 200) {
      const error = new Error("Video Error.");
      error.code = 500;
      throw error;
    }
    const index = await extractIndex(dataIndex.split(/\r?\n/));

    return res.json({ master, index });
  } catch (err) {
    return res.status(error?.code || 500).json({
      error: true,
      msg: error?.message,
    });
  }
};
