const mongoose = require("mongoose");
const { countConnect } = require("../helpers/checkConnect");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  async connect() {
    try {
      await mongoose.connect(connectString, {
        maxPoolSize: 50,
      });
      console.log("Connect to mongodb successfully");
      countConnect();
    } catch (error) {
      console.error("Connect to mongodb failure");
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
