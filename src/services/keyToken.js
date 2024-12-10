const keysModel = require("../models/keys.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keysModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens.publicKey : null;
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keysModel.findOneAndUpdate(filter, update, options);

      return tokens ? tokens.publicKey : null;
    } catch (e) {
      return e.message;
    }
  };

  static findByUserId = async (userId) => {
    return await keysModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (userId) => {
    const result = await keysModel.deleteOne({
      user: userId,
    });
    return result;
  };
}

module.exports = KeyTokenService;
