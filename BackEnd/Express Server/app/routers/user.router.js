const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcrypt");

var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
var Mailgen = require("mailgen");

let user = require("../Models/user.model");

//email configurarion
function sendMail(mailOptions) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ravindudeshaninfo@gmail.com",
      pass: "Homagama502",
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Email error Occured", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// add user

userRoutes.post("/add", async (req, res) => {
  const { username, password, email, firstname, lastname, conpass, phoneNo } =
    req.body;

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  if (
    username == "" ||
    password == "" ||
    email == "" ||
    firstname == "" ||
    lastname == "" ||
    phoneNo == " "
  )
    return res.status(200).json({ warn: "Important field(s) are empty" });

  if (password !== conpass)
    return res.status(200).json({ warn: "Passwords Do not Match!" });

  const exist = await user.findOne({ email: email });
  if (exist) {
    return res
      .status(200)
      .json({ warn: "An account is Exist with this email" });
  }

  const exist2 = await user.findOne({ username: username });
  if (exist2) {
    return res
      .status(200)
      .json({ warn: "This Username is already taken.Try another one" });
  }

  const newUser = new user({
    username,
    password: passwordHash,
    email,
    firstname,
    lastname,
    phoneNo,
  });

  await newUser
    .save()
    .then(async (respond) => {
      res.status(200).json({ msg: "Successfull" });

      ///comp

      var mailGenerator = new Mailgen({
        theme: "default",
        product: {
          // Appears in header & footer of e-mails
          name: "SnakePal",
          link: "www.SnakePal.lk",
          // Optional product logo
          logo: "",
        },
      });

      var email = {
        body: {
          name: req.body.firstname,
          intro:
            "Your Account is successfully Created. Login Details as Below.",
          table: {
            data: [
              {
                Username: req.body.username,
                Password: req.body.password,
              },
            ],
            columns: {
              // Optionally, customize the column widths
              customWidth: {
                Username: "20%",
                Password: "15%",
              },
              // Optionally, change column text alignment
              customAlignment: {
                Password: "right",
              },
            },
          },
          action: {
            instructions:
              "<b>Use above Credentials to log in to your Account,</b><br/><br/>Please click log In button to Continue:",
            button: {
              color: "#4CAF50", // Optional action button color
              text: "Log In",
              link: "http://localhost:3000/login",
            },
          },
          outro:
            "<br><br/> <br/>Need help, or have questions? <b>Just reply to this email</b>, we'd love to help.",
        },
      };

      // Generate an HTML email with the provided contents
      var emailBody = await mailGenerator.generate(email);

      // Generate the plaintext version of the e-mail (for clients that do not support HTML)
      // var emailText = mailGenerator.generatePlaintext(email);

      // // Optionally, preview the generated HTML e-mail by writing it to a local file
      // require('fs').writeFileSync('preview.html', emailBody, 'utf8');

      // `emailBody` now contains the HTML body,
      // and `emailText` contains the textual version.
      //
      // It's up to you to send the e-mail.
      // Check out nodemailer to accomplish this:
      // https://nodemailer.com/

      mailOptions = {
        from: "ravindudeshaninfo@gmail.com",
        to: req.body.email,
        subject: "Registration Successfull",
        html: emailBody,
      };

      //send mail to registered user

      await sendMail(mailOptions);
    })
    .catch((err) => {
      res.status(400).json({ msg: "Error!" });
      console.log("error mail:", err);
    });
});

//token validate

userRoutes.post("/validate", async (req, res) => {
  // console.log("Secret is :" , config.JWT_SECRET);

  const { username, password } = req.body;

  try {
    const Login = await user.findOne({ username: username });

    if (username == "" || password == "")
      return res
        .status(200)
        .json({ msg: "Username or Password fields are empty" });

    if (!Login) return res.status(200).json({ msg: "Invalid Username" });

    const validate = await bcrypt.compare(password, Login.password);

    if (!validate) {
      return res.status(200).json({ msg: "Password is Invalid!" });
    }

    //jwt secret
    const token = jwt.sign({ id: Login._id }, process.env.JWT_SECRET, {
      expiresIn: 3000,
    });
    res.status(200).json({
      token,
      Info: {
        id: Login._id,
        username: Login.username,
        email: Login.email,
        firstname: Login.firstname,
        lastname: Login.lastname,
        img: Login.img,
      },
      User: Login,
    });
  } catch (err) {
    res.status(400).json({ msg: "Validation Error" });
    console.log("Error is ", err);
  }
});

// User Session Validation by token
userRoutes.get("/session-validate", async (req, res) => {
  try {
    const token = req.header("token");

    console.log("validation is :", token);
    if (!token) return res.json(false);

    const validate = jwt.verify(token, process.env.JWT_SECRET);
    if (!validate) return res.json(false);

    const Login = await user.findById(validate.id);
    if (!Login) return res.json(false);

    return res.json(true);
  } catch (error) {
    res.status(400).json({ msg: "Validation Error" });
    console.log("Error is ", error);
  }
});

// update

userRoutes.post("/update/:id", async (req, res) => {
  console.log(req.body);

  user
    .findById(req.params.id)
    .then((productObj) => {
      productObj.firstname = req.body.firstname;
      productObj.lastname = req.body.lastname;
      productObj.mobile = req.body.mobile;

      console.log(productObj);
      productObj
        .save()
        .then(() => res.json("Updated"))
        .catch((err) => res.status(400).json("Erro " + err));
    })
    .catch((err) => res.status(400).json("Error " + err));
});

// get user by Id
userRoutes.route("/:id").get(function (req, res) {
  let id = req.params.id;
  user.findOne({ _id: id }, function (err, User) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({ success: true, User: User });
    }
  });
});

// all users
userRoutes.get("/", async (req, res) => {
  await user
    .find(function (err, users) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({ success: true, data: users });
      }
    })
    .sort({ updatedAt: 1 });
});

module.exports = userRoutes;
