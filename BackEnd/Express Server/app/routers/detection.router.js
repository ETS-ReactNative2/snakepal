let express = require("express");
let router = express.Router();
let upload = require("../config/multer.config.js");

const awsWorker = require("../controllers/aws.controller.js");

let Detection = require("../Models/detection.model");
let user = require("../Models/user.model");

router.route("/:id").get(function (req, res) {
  let id = req.params.id;
  Detection.findOne({ _id: id }, function (err, detection) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({ success: true, data: detection });
    }
  });
});

// id  is user id

router.post("/push-detections/:id", async (req, res) => {
  console.log(req.body);

  user
    .findById(req.params.id)
    .then(async (userObj) => {
      // Detection.findById(req.body.detection_id).then(async (detectionObj) => {
      //   userObj.detectionIds.push(detectionObj);
      //   console.log("detection obj");
      //   console.log(detectionObj);

      //   await userObj
      //     .save()
      //     .then(() => res.json("Updated"))
      //     .catch((err) => res.status(400).json("Erro " + err));
      // });

      userObj.update(
        { "detectionIds._id": req.params.id },
        {
          $set: {
            "detectionIds.$.HeadLabel": req.body.name,
            "detectionIds.$.HeadScore": req.body.name,
            "detectionIds.$.TailLabel": req.body.name,
            "detectionIds.$.TailScore": req.body.name,
            "detectionIds.$.BodyLabel": req.body.name,
            "detectionIds.$.BodyScore": req.body.name,
            "detectionIds.$.Final_Label": req.body.name,
            "detectionIds.$.Final_Score": req.body.name,
          },
        },
        (err, result) => {
          if (err) {
            res.status(500).json({ error: "Unable to update competitor." });
          } else {
            res.status(200).json(result);
          }
        }
      );
    })
    .catch((err) => res.status(400).json("Error " + err));
});

// id  is user id
router.post("/push-rescuer-alerts/:detection_Id", async (req, res) => {
  console.log(req.params.detection_Id);
  console.log(`alert added${req.body.resID}`);

  user
    .findById(req.params.detection_Id)
    .then((productObj) => {
      productObj.rescueAlertIds.push(req.body.resID);

      console.log(productObj);
      productObj
        .save()
        .then(() => {
          res.json("Updated");
        })
        .catch((err) => res.status(400).json("Erro " + err));
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.post("/update-server-values/:id", async (req, res) => {
  console.log("function executed");
  console.log(req.body);

  Detection.findById(req.params.id)
    .then(async (productObj) => {
      productObj.HeadLabel = req.body.HeadLabel;
      productObj.HeadScore = req.body.HeadScore;
      productObj.TailLabel = req.body.TailLabel;
      productObj.TailScore = req.body.TailScore;
      productObj.BodyLabel = req.body.BodyLabel;
      productObj.BodyScore = req.body.BodyScore;
      productObj.FinalScore = req.body.Final_Score;
      productObj.FinalLabel = req.body.Final_Label;

      if (productObj.FinalScore < 92) {
        productObj.status = 1;
      } else {
        productObj.status = 1;
      }

      console.log("object updated!");
      console.log(productObj);
      await productObj
        .save()
        .then(() => {
          user
            .findById(productObj.user_Id)
            .then(async (userObj) => {
              if (productObj.status == 1) {
                userObj.successDetections.push(productObj);
              } else {
                userObj.manualrecommendDetections.push(productObj);
              }
              console.log("detection obj");
              console.log(productObj);

              await userObj
                .save()
                .then(() => res.json("Updated User"))
                .catch((err) => res.status(400).json("Erro " + err));
            })
            .catch((err) => res.status(400).json("Error " + err));

          res.json("Updated");
        })
        .catch((err) => res.status(400).json("Erro " + err));
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.post("/update-final-values/:id", async (req, res) => {
  console.log(req.body);

  Detection.findById(req.params.id)
    .then((productObj) => {
      productObj.FinalLabel = req.body.FinalLabel;
      productObj.FinalScore = req.body.FinalScore;

      console.log(productObj);
      productObj
        .save()
        .then(() => res.json("Updated"))
        .catch((err) => res.status(400).json("Erro " + err));
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.post("/update-manual-values/:id", async (req, res) => {
  console.log(req.body);

  Detection.findById(req.params.id)
    .then((productObj) => {
      productObj.ManualLabel = req.body.ManualLabel;
      productObj.ManualScore = req.body.ManualScore;

      console.log(productObj);
      productObj
        .save()
        .then(() => res.json("Updated"))
        .catch((err) => res.status(400).json("Erro " + err));
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.post("/update-realtime-values/:id", async (req, res) => {
  console.log(req.body);

  Detection.findById(req.params.id)
    .then((productObj) => {
      productObj.RTLabel = req.body.RTLabel;
      productObj.RTScore = req.body.RTScore;

      console.log(productObj);
      productObj
        .save()
        .then(() => res.json("Updated"))
        .catch((err) => res.status(400).json("Erro " + err));
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.post("/add-realtime", async (req, res) => {
  const newDetection = new Detection({
    user_Id: req.body.user_Id,
    RTLabel: req.body.RTLabel,
    RTScore: req.body.RTScore,
    lang: req.body.lang,
    long: req.body.long,
  });

  await newDetection
    .save()
    .then(async (respond) => {
      // send rescue notification
      res.json("saved!");
    })
    .catch((err) => res.status(400).json("Erro " + err));
});

router.post("/", upload.single("file"), awsWorker.doUpload);

module.exports = router;
