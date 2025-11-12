const { createClient } = require("redis");
const redisPublisher = createClient({ url: "redis://localhost:6379" });
redisPublisher.connect();

async function notifyReservationAccepted(reservation) {
  const event = {
    type: "reservationAccepted",
    data: reservation,
  };
  await redisPublisher.publish("events", JSON.stringify(event));
}

async function notifyReservationCancelled(reservation) {
  const event = {
    type: "reservationCancelled",
    data: reservation,
  };
  await redisPublisher.publish("events", JSON.stringify(event));
}

module.exports = { notifyReservationAccepted };
