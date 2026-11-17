
import { createServer } from 'http'; 
import { Server } from 'socket.io';
import app from './app.js';



const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Cliente conectado a WebSockets:', socket.id);
  
    socket.on('join_gym', (gymId: string) => {
        socket.join(`gym_${gymId}`);
        console.log(`Cliente ${socket.id} se unió al Gimnasio: ${gymId}`);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado de WebSockets:', socket.id);
    });
});


const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Backend híbrido corriendo en: http://localhost:${PORT}`);
});
