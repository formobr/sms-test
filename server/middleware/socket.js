import { Server } from 'socket.io';

export default defineEventHandler((event) => {
  if (globalThis.$io) return ;
  globalThis.$io = new Server(event.node.req.socket?.server);
  // Websocket update 
  $io.on('connection', (sock) => {
    console.log(`server connect ${sock.id}`)
  });
})