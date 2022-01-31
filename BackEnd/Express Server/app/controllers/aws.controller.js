const axios = require("axios");

var stream = require("stream");
require("dotenv").config();

const s3 = require("../config/s3.config.js");
let Detection = require("../Models/detection.model");
let user = require("../Models/user.model");

exports.doUpload = (req, res) => {
  const s3Client = s3.s3Client;
  const params = s3.uploadParams;

  let user_Id = req.body.user_Id;
  let RTLabel = req.body.RTLabel;
  let RTScore = req.body.RTScore;
  let lang = req.body.lang;
  let long = req.body.long;

  let status = 0;

  params.Key = req.file.originalname;
  params.Body = req.file.buffer;
  params.ACL = "public-read";

  s3Client.upload(params, async (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error -> " + err });
    }

    if (data) {
      let videoURL = data.Location;
      const newDetection = new Detection({
        user_Id,
        RTLabel,
        RTScore,
        lang,
        long,
        videoURL,
      });

      await newDetection.save().then(async (respond) => {
        user
          .findById(req.body.user_Id)
          .then(async (userObj) => {
            Detection.findById(respond._id).then(async (detectionObj) => {
              userObj.detectionIds.push(detectionObj);
              console.log("detection obj");
              console.log(detectionObj);

              await userObj
                .save()
                .then(() => res.status(200).json({ msg: "uploaded" }))
                .catch((err) => res.status(400).json("Erro " + err));
            });
          })
          .catch((err) => res.status(400).json("Error " + err));

        await axios.post(process.env.FLASKBACKEND + `/detect`, {
          videoURL: data.Location,
          detection_id: respond._id,
        });
        // .then((flaskRes) => {
        //   console.log("==========Flask Response is============");
        //   console.log(flaskRes);
        //   console.log("====================================");
        //   return res.json({
        //     HeadLabel: flaskRes.data.HeadLabel,
        //     HeadScore: flaskRes.data.HeadScore,
        //     TailLabel: flaskRes.data.TailLabel,
        //     TailScore: flaskRes.data.TailScore,
        //     BodyLabel: flaskRes.data.BodyLabel,
        //     BodyScore: flaskRes.data.BodyScore,
        //     FinalScore: flaskRes.data.Final_Score,
        //     FinalLabel: flaskRes.data.Final_Label,
        //   });
        // });

        res.status(400).json("Error " + err);
      });
    }
  });
};
