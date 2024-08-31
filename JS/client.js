const socket = io('http://localhost:5000');

const form = document.getElementById('send-container');
const messageinp = document.getElementById('messageinp');
const messageContainer = document.querySelector('.container');
const audio = new Audio('ding-126626.mp3');

// Flag to track user interaction
let userInteracted = true;

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    // Only play sound if user has interacted
    if (position == 'left' && userInteracted) {
        audio.play().catch(error => {
            console.log("Audio playback prevented:", error);
        });
    }
};

// Set userInteracted to true when user interacts with the form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    userInteracted = true; // Mark as interacted
    const message = messageinp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageinp.value = '';
});

// Prompt the user for their name
const promptForName = () => {
    let userName;
    while (!userName) {
        userName = prompt("Enter your name to join:");
        if (userName) {
            userName = userName.trim();
        }
        if (!userName) {
            alert("Name cannot be empty. Please enter a valid name.");
        }
    }
    return userName;
}

const userName = promptForName();
socket.emit('new-user-joined', userName);

// Listen for the 'user-joined' event and display a message
socket.on('user-joined', name => {
    append(`${name} joined the chat.`, 'right');
});

// Listen for incoming messages
socket.on('receive', data => {
    append(`${data.userName}: ${data.message}`, 'left');
});

// Listen for 'left' event
socket.on('left', data => {
    append(`${data.name} left the chat.`, 'left');
});

// Detect tab close or page refresh
window.addEventListener('beforeunload', () => {
    socket.disconnect();
});
