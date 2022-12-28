const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = "blog_app";


const posterModel = require("./models/poster");
const blogModel = require("./models/blog");

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



// your code goes here

app.use("/blog", async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          return res.status(401).json(err);
        } else {
          req.poster = decoded.data;
        //   console.log(req);
        //   console.log(decoded);
          next();
        }
      });
    } else {
      //missing
      return res.status(400).json({
        status: "Failed",
        message: "token is missing",
      });
    }
  } else {
    //not
    res.status(400).json({
      status: "Failed",
      message: "not authenticated",
    });
  }
});

app.get("/", async (req, res) => {
  try {
    const posters = await posterModel.find();
    res.status(200).json({
      status: "Success",
      message: posters,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.post(
  "/signup",
  body("Email").isEmail(),
  // password must be at least 5 chars long
  body("password").isLength({ min: 8 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { Email, password, confirmpassword } = req.body;
      bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
          return res.status(403).json({
            status: "Failed",
            message: err.message,
          });
        }

        const posters = await posterModel.create({
          Email: Email,
          password: hash,
        });
        res.status(200).json({
          status: "Success",
          message: posters,
        });
      });
    } catch (error) {
      res.status(400).json({
        status: "Failed",
        message: error.message,
      });
    }
  }
);

app.post("/login", async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const { Email, password } = req.body;
    const user = await posterModel.findOne({ Email: Email });

    if (!user) {
      return res.status(403).json({
        status: "Failed",
        message: "User does not exist",
      });
    }
    console.log(user);
    bcrypt.compare(password, user.password, async function (err, result) {
      if (err) {
        return res.status(403).json({
          status: "Failed bcrypt",
          message: err.message,
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: posterModel._id,
          },
          secret
        );
        console.log(posterModel);
        return res.status(200).json({
          status: "Success",
          message: "Login successful",
          token,
        });
      } else {
        res.status(400).json({
          status: "Failed",
          message: "Wrong password",
        });
      }
      //   const posters = await posterModel.create({
      //     Email: Email,
      //     password: hash,
      //   });
      // res.status(200).json({
      //   status: "Success",
      //   message: posters,
      // });
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.post("/blog/upload", async (req, res) => {
  try {
    const dt = new Date();
    // const user_id = req._id
    const {
      image,
      title,
      description,
      author,
      date,
      time
    } = req.body;
    const blog = await blogModel.create({
      image,
      title,
      description,
      author,
      date:dt,
      time
    });
    res.status(200).json({
      status: "Success",
      message: blog,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.get("/blog", async (req, res) => {
  try {
    const blog = await blogModel.find();
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
});

module.exports = app;
