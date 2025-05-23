const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { APP_SECRET, MESSAGE_BROKER_URL, EXCHANGE_NAME } = require("../config");
const amqplib = require("amqplib");
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
// We will use some kind of HTTP mechanism or maybe a webhook
// to notify the other services. For example, when data changes,
//  those services will be alerted to perform operations related
//  to that specific data.

//to enable other services talk to product service
//Raise Events first method
// these are the methods (PublishCustomerEvent,PublishShoppingEvent) responsible for communication with other services

// module.exports.PublishCustomerEvent = async (payload) => {
//   axios.post("http://localhost:8000/customer/app-events", {
//     payload,
//   });

//   //     axios.post(`${BASE_URL}/customer/app-events/`,{
//   //         payload
//   //     });
// };

// module.exports.PublishShoppingEvent = async (payload) => {
//   axios.post(`http://localhost:8000/shopping/app-events/`, {
//     payload,
//   });
// };

//Message Broker, second method

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

module.exports.PublishMessage = (channel, service, msg) => {
  try {
    console.log("service,exchange name, message", service, EXCHANGE_NAME, msg);
    // CUSTOMER_SERVICE undefined {"event":"ADD_TO_WISHLIST","data":{"userId":"680b19e2ffe6be9d3e0d0037","product":{"_id":"680b1984a4f8021eaacee168","name":"Olive Oil","desc":"great Quality of Oil","banner":"http://codergogoi.com/youtube/images/oliveoil.jpg","type":"oils","unit":1,"price":400,"available":true,"suplier":"Golden seed firming","__v":0}}}

    channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Published message: ", msg);
  } catch (err) {
    throw err;
  }
};

// module.exports.SubscribeMessage = async (channel, service, binding_key) => {
//   const appQueue = await channel.assertQueue(QUEUE_NAME);
//   channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
//   channel.consume(appQueue.queue, (data) => {
//     console.log("received data");

//     console.log(data.content.toString());

//     channel.ack(data);
//   });
// };
