const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "Success",
  CREATED: "Created",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
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
      statusCode: StatusCode.OK,
      reasonStatusCode: ReasonStatusCode.OK,
      data,
    });
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      statusCode: StatusCode.CREATED,
      reasonStatusCode: ReasonStatusCode.CREATED,
      metadata,
    });
  }
}

module.exports = {
  OK,
  CREATED,
};
