const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const amqplib = require("amqplib");
const {
  APP_SECRET,
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  QUEUE_NAME,
  SHOPPING_BINDING_KEY,
} = require("../config");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

//add subscriber publishing event here
// added method, first method
// module.exports.PublishCustomerEvent = async (payload) => {
//   axios.post("http://localhost:8000/customer/app-events", {
//     payload,
//   });

//   //     axios.post(`${BASE_URL}/customer/app-events`,{
//   //         payload
//   //     });
// };

//MESSAGE BROKER
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });

    return channel;
  } catch (err) {
    throw err;
  }
};

//Publish messages
module.exports.PublishMessage = (channel, binding_key, msg) => {
  try {
    channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(msg));
    console.log("Sent: ", msg);
  } catch (err) {
    throw err;
  }
};

//here we are not passing binding key from outside, because customer service only listening to one binding key
// module.exports.SubscribeMessage = async (channel, service, binding_key) => {
//   const appQueue = await channel.assertQueue(QUEUE_NAME);
//   channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
//   channel.consume(appQueue.queue, (data) => {
//     console.log("received data");

//     console.log(data.content.toString());

//     channel.ack(data);
//   });
// };
// service is passed from outside
module.exports.SubscribeMessage = async (channel, service) => {
  const appQueue = await channel.assertQueue(QUEUE_NAME);
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, SHOPPING_BINDING_KEY);
  channel.consume(appQueue.queue, (data) => {
    console.log("received data in shopping service");

    console.log(data.content.toString());
    //subscribe event is receiving json data only, and we are assigning it to string
    service.SubscribeEvents(data.content.toString()); //added code, to trigger the subscribeEvents function in customerService

    channel.ack(data);
  });
};
