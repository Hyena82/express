const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "APIKey";
const COLLECTION_NAME = "APIKeys";

const APIKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, APIKeySchema);
