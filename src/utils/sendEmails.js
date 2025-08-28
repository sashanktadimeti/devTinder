const { SendEmailCommand } = require("@aws-sdk/client-ses");
const sesClient = require("./sesClient"); // assuming default export

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
      CcAddresses: [], // You can add CC emails here
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "HTML_FORMAT_BODY", // You can replace this with actual HTML content
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY", // Replace with actual plain text content
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "EMAIL_SUBJECT", // Replace with actual subject
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [], // Optional
  });
};

const sendEmail = async (to, from) => {
  const sendEmailCommand = createSendEmailCommand(to, from);

  try {
    const response = await sesClient.send(sendEmailCommand);
    return response;
  } catch (caught) {
    if (caught.name === "MessageRejected") {
      return caught; // or log/return custom error message
    }
    throw caught;
  }
};

module.exports = {
  sendEmail,
};
