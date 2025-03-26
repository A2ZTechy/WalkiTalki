const talkButton = document.getElementById("talkButton");
const channelSelect = document.getElementById("channelSelect");
const usernameInput = document.getElementById("username");
const speaker = document.getElementById("speaker");

const socket = io("https://0c52-103-154-36-78.ngrok-free.app"); // Connect to WebSocket Server
let mediaRecorder;
let audioChunks = [];
let currentChannel = "channel1";

// Function to join selected channel
function joinChannel() {
    currentChannel = channelSelect.value;
    socket.emit("join-channel", currentChannel);
}

channelSelect.addEventListener("change", joinChannel);

// Handle Voice Streaming
async function startRecording() {
    if (!usernameInput.value) {
        alert("Please enter your username before talking!");
        return;
    }

    speaker.innerText = `🎤 ${usernameInput.value} is talking...`;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            socket.emit("voice", { channel: currentChannel, audio: event.data });
        }
    };

    mediaRecorder.start(100); // Send voice every 100ms
}

// Stop Recording
function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        speaker.innerText = "No one is talking";
    }
}

// Listen for Incoming Voice Data
socket.on("voice", (audioBlob) => {
    const audio = new Audio(URL.createObjectURL(audioBlob));
    audio.play();
});

// Event Listeners
talkButton.addEventListener("mousedown", startRecording);
talkButton.addEventListener("mouseup", stopRecording);
