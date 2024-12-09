const { StatusCodes, ReasonPhrases } = require("./httpStatusCode");
class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.status = statusCode;
    this.message = !message ? reasonStatusCode : message;
    this.metadata = metadata?.metadata || metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json({
      status: this.status,
      message: this.message,
      metadata: this.metadata,
    });
  }
}

class OK extends SuccessResponse {
  constructor({ message, data }) {
    super({
      message,
      statusCode: StatusCodes.OK,
      reasonStatusCode: ReasonPhrases.OK,
      data,
    });
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      statusCode: StatusCodes.CREATED,
      reasonStatusCode: ReasonPhrases.CREATED,
      metadata,
    });
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
