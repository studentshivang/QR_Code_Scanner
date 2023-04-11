// Create a new QR code reader instance
const qrReader = new QrCodeReader();

// Get the video element from the DOM
const video = document.createElement('video');
video.setAttribute('autoplay', '');
video.setAttribute('muted', '');
video.setAttribute('playsinline', '');

// Get the canvas element from the DOM
const canvas = document.createElement('canvas');
const canvasContext = canvas.getContext('2d');

// Get the start and stop buttons from the DOM
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');

// Get the result element from the DOM
const result = document.getElementById('result');

// Set up the event listeners for the start and stop buttons
startBtn.addEventListener('click', startDecode);
stopBtn.addEventListener('click', stopDecode);

// Function to start decoding the QR code
function startDecode() {
  // Start the video stream
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
      // Request the first frame of the video to be drawn onto the canvas
      requestAnimationFrame(decodeFrame);
    })
    .catch(function(err) {
      console.log('Error starting video stream', err);
    });
}

// Function to stop decoding the QR code
function stopDecode() {
  // Stop the video stream
  const stream = video.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach(function(track) {
    track.stop();
  });
  video.srcObject = null;
}

// Function to decode the QR code from the canvas
function decodeFrame() {
  canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
  qrReader.decodeFromImage(imageData)
    .then(function(result) {
      // Display the decoded result in the result element
      console.log(result);
      document.getElementById('result').textContent = result.text;
    })
    .catch(function(err) {
      // If the QR code is not found in the current frame, request the next frame
      if (err instanceof QrCodeNotFound) {
        requestAnimationFrame(decodeFrame);
      } else {
        console.log('Error decoding QR code', err);
      }
    });
}
