// const socket = require("socket.io");

// const initializeSocket = (server)=>{
//     const io = socket(server,{
//         cors:{
//             origin:"http://localhost:5173",
//         },
//     });
//     io.on("connection",(socket)=>{
//         socket.on("joinChat",({senderName,userId,targetUserId})=>{
//             const roomId = [userId,targetUserId].sort().join("_");
//             console.log(senderName+" Joined Room: "+ roomId);
//             socket.join(roomId);
//         });

//         socket.on("sendMessage",({senderName,userId,targetUserId,text})=> {
//             const roomId = [userId,targetUserId].sort().join("_");
//             console.log(senderName+" "+text);
//             io.to(roomId).emit("message Received",{senderName,text});
//         }); //backend must ensure that it is sending data back to userId

//         socket.on("disconnect",()=>{});
//     });

// };

// module.exports = initializeSocket;




const socket = require("socket.io");

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (clientSocket) => {

        clientSocket.on("joinChat", ({ senderName, userId, targetUserId }) => {
            const roomId = [userId, targetUserId].sort().join("_");
            console.log(senderName + " Joined Room: " + roomId);
            clientSocket.join(roomId);
        });

        // ✅ SEND MESSAGE
        clientSocket.on("sendMessage", (msg) => {
            const roomId = [msg.userId, msg.targetUserId].sort().join("_");

            const messageData = {
                ...msg,
                status: "delivered", // immediately delivered
            };

            io.to(roomId).emit("messageReceived", messageData);
        });

        // ✅ SEEN MESSAGE
        clientSocket.on("markSeen", ({ userId, targetUserId, messageId }) => {
            const roomId = [userId, targetUserId].sort().join("_");

            io.to(roomId).emit("messagesSeen", {
                messageId,
            });
        });

        clientSocket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });

    return io;
};

module.exports = initializeSocket;