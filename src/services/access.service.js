const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken");
const createTokenPair = require("../auth/authUtils");
const { getIntoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");

const ROLESHOP = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError("Error: Shop already registered!");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [ROLESHOP.SHOP],
      });

      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            message: "keyStore error",
          };
        }

        // create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log("created token success", tokens);

        return {
          code: 201,
          metadata: {
            shop: getIntoData(["name", "email"], newShop),
            tokens,
          },
        };
      }
    } catch (error) {
      return {
        message: error.message,
      };
    }
  };
}

module.exports = AccessService;
