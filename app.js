const express = require("express");
const { dataModel } = require("./dataModel");
const catchAsyncErrors = require("./utils/catchAsyncError");
const ErrorHandler = require("./utils/errorHandler");
const bodyParser = require("body-parser");

const env = process.env.NODE_ENV;
if (env !== "PRODUCTION")
  require("dotenv").config({ path: "config/config.env" });

const errorMiddleware = require("./utils/error");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get(
//   "/api/v1",
//   catchAsyncErrors(async (req, res) => {
//     const data = await dataModel.insertMany([
//       { root: 1, left: 2, right: 3 },
//       { root: 2, left: 4, right: 5 },
//       { root: 3, left: 6, right: 7 },
//       { root: 4, left: 8, right: 9 },
//       { root: 5, left: 10, right: 11 },
//       { root: 6, left: 12, right: 13 },
//       { root: 7, left: 14, right: 15 },
//       { root: 8 },
//       { root: 9 },
//       { root: 10, left: 16 },
//       { root: 11 },
//       { root: 12, left: 17 },
//       { root: 13 },
//       { root: 14 },
//       { root: 15 },
//       { root: 16 },
//       { root: 17 },
//     ]);
//     res.status(200).json(data);
//   })
// );

app.get(
  "/api/v1/traverse",
  catchAsyncErrors(async (req, res, next) => {
    const {root} = req.query;
    // console.log("query", root);
    if (!root) next(new ErrorHandler("Invalid query provided", 401));

    list = [];
    que = [];

    const cur = await dataModel.findOne({ root });
    // console.log(root, cur);
    if (!cur) return list;

    que.push(cur);
    while (que.length) {
      // console.log("que ", que);
      let item = que.shift();

      if (item) {
        list.push(item.root);
        que.push(await dataModel.findOne({ root: item.left }));
        que.push(await dataModel.findOne({ root: item.right }));
      }
    }

    // console.log("result ", list);
    res.status(200).json({ traversal: list });
  })
);

app.get("/api/v1/*", async (req, res, next) => {
  res.status(404).send("Page Not Found");
});

app.use(errorMiddleware);

module.exports = app;
