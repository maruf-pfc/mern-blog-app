const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongod;

module.exports = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI_TEST = uri; // Use this URI for test DB connections

  // Optional: global setup for mongoose if you don't handle connection per test suite
  // await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

// If you set up mongoose globally above, you'll need a global teardown
// module.exports.teardown = async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   await mongod.stop();
// };
