const dotenv = require("dotenv").config();
const redis = require("redis");

const CHANNELS = {
  TEST: "TEST",
};

class PubSub {
  constructor() {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
    this.subscriber.subscribe(CHANNELS.TEST);
    this.subscriber.on("message", (channel, message) => {
      this.handleMessage(channel, message);
    });
  }

  handleMessage(channel, message) {
    console.log(`--------------------\n
                Message Received.\n
                Channel:${channel}\n
                Message:${message}`);
  }
}

const testPubSub = new PubSub();
setTimeout(
  () => testPubSub.publisher.publish(CHANNELS.TEST, "hello there"),
  1000
);

module.exports = PubSub;
