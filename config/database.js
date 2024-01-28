const mongoose = require("mongoose");

const ConnectDatabase = async () => {
  mongoose.set("strictQuery", true);
  await mongoose
    .connect(
      `${process.env.MONGODB_CONNECTION_URL}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
      }
    )
    .then(() => console.log("Database connected successfully."))
    .catch((error) => {
      console.log("Database is not connected...\n\n", error);
    });
};

module.exports = ConnectDatabase;