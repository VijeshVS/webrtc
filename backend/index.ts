import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data: Buffer) {
    const message = JSON.parse(data.toString());

    switch (message.type) {
      case "sender":
        senderSocket = ws;
        break;
      case "receiver":
        receiverSocket = ws;
        break;
      case "createOffer":
        if (ws != senderSocket) return;
        receiverSocket?.send(
          JSON.stringify({ type: "createOffer", sdp: message.sdp })
        );
        break;
      case "createAnswer":
        if (ws != receiverSocket) return;
        senderSocket?.send(
          JSON.stringify({ type: "createAnswer", sdp: message.sdp })
        );
        break;
      case "iceCandidate":
        const msg = JSON.stringify({
          type: "iceCandidate",
          candidate: message.candidate,
        });

        if (ws === senderSocket) {
          receiverSocket?.send(msg);
        } else {
          senderSocket?.send(msg);
        }
    }
  });
});
