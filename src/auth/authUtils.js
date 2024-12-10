const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthorizationError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("error verify", err.message);
      } else {
        console.log("decode", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) {
    throw new AuthorizationError("Unauthorized");
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("KeyStore not found");
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) {
    throw new AuthorizationError("Unauthorized");
  }

  try {
    const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthorizationError("Unauthorized");
    }

    req.keyStore = keyStore;
    return next();
  } catch (e) {
    throw new AuthorizationError("Unauthorized");
  }
});

module.exports = {
  authentication,
  createTokenPair,
};
