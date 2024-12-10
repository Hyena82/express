const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken");
const { createTokenPair } = require("../auth/authUtils");
const { getIntoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const ROLESHOP = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore.user);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not registered");
    }
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw BadRequestError("Password is not correct");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const { _id: userId } = foundShop;

    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getIntoData(["_id", "name", "email"], foundShop),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.fidOne({ email }).lean();
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
