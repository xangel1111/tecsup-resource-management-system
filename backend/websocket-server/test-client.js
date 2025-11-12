const { io } = require("socket.io-client");

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("🟢 Connected with id:", socket.id);
});

socket.on("reservationAccepted", (data) => {
  console.log("📩 Reservation accepted:", data);
});

socket.on("reservationCancelled", (data) => {
  console.log("❌ Reservation cancelled:", data);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from server");
});
