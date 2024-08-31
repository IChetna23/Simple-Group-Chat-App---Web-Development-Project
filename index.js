// node server that handle socket io connections 

const io = require('socket.io')(5000, {
    cors: {
        origin: "http://127.0.0.1:5500", // Replace with your client's origin
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    // When a new user joins, save the user to the users object
    socket.on('new-user-joined', userName => {
        // console.log("new user", userName)
        users[socket.id] = userName;
        socket.broadcast.emit('user-joined', userName);
    });

    // Listen for 'send' event and broadcast the message to all users
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, userName: users[socket.id] });
    });
    
    // disconnect
    socket.on('disconnect', () => {
        // console.log('User disconnected:', users[socket.id]);
        socket.broadcast.emit('left', { name: users[socket.id] });
        delete users[socket.id];
    });
});