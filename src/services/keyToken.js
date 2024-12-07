const keysModel = require("../models/keys.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const tokens = await keysModel.create({
        user: userId,
        publicKey,
        privateKey,
      });

      return tokens ? tokens.publicKey : null;
    } catch (e) {
      return e.message;
    }
  };
}

module.exports = KeyTokenService;
