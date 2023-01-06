const app = require("./app");
const connectDatabase = require("./config/database");

process.on("uncaughtException", (err) => {
  console.log(`Error name: ${err.name}`);
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server....");
  process.exit(1);
});


const env = process.env.NODE_ENV;
if (env !== "PRODUCTION") 
  require("dotenv").config({ path: "config/config.env" });

connectDatabase();

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error name: ${err.name}`);
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server....");
  
  server.close(() => {
    process.exit(1);
  });
});
