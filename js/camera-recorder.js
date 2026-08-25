/**
 * Camera Recorder Module for UpliftEd
 * This module provides functionality to record teacher's camera feed
 * and save recordings locally.
 */

class CameraRecorder {
    constructor(options = {}) {
        this.isRecording = false;
        this.captureInterval = null; // For canvas-based video capture
        this.videoElement = null;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.teacherDetails = options.teacherDetails || {};
        this.outputFolder = options.outputFolder || 'recordings';
        
        // Log initialization
        console.log('CameraRecorder initialized');
    }

    /**
     * Start recording the video feed
     * @param {HTMLVideoElement} videoElement - The video element to record
     */
    startRecording(videoElement) {
        if (!videoElement || !(videoElement instanceof HTMLVideoElement)) {
            console.error('Invalid video element provided');
            return false;
        }

        this.videoElement = videoElement;
        
        try {
            // First try to get the stream directly from the video element
            let stream = this.videoElement.srcObject;
            
            // If no stream is available, try to get it from getUserMedia
            if (!stream) {
                console.log('No srcObject stream available, attempting to get user media');
                
                // Try to get user media directly
                navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then(mediaStream => {
                        // Attach the stream to the video element
                        this.videoElement.srcObject = mediaStream;
                        stream = mediaStream;
                        
                        // Initialize recorder with the new stream
                        this.initializeRecorder(stream);
                    })
                    .catch(err => {
                        console.error('Failed to get user media:', err);
                        // Fall back to canvas capture
                        this.fallbackToCanvasCapture();
                    });
                
                return true; // Return early as we're handling async
            }
            
            // If we have a stream, initialize the recorder
            if (stream) {
                return this.initializeRecorder(stream);
            } else {
                // Fall back to canvas capture if no stream is available
                return this.fallbackToCanvasCapture();
            }
            
        } catch (error) {
            console.error('Failed to start recording:', error);
            // Try canvas fallback as last resort
            return this.fallbackToCanvasCapture();
        }
    }
    
    /**
     * Initialize the MediaRecorder with the provided stream
     * @param {MediaStream} stream - The media stream to record
     * @returns {boolean} - Whether initialization was successful
     */
    initializeRecorder(stream) {
        if (!stream) {
            console.error('No stream provided for recording');
            return false;
        }
        
        try {
            // Initialize MediaRecorder with appropriate MIME type
            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
                ? 'video/webm;codecs=vp9' 
                : MediaRecorder.isTypeSupported('video/webm') 
                    ? 'video/webm' 
                    : 'video/mp4';
                
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType,
                videoBitsPerSecond: 2500000 // 2.5 Mbps
            });
            
            // Set up recording handlers
            this.recordedChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                    console.log(`Recorded chunk: ${(event.data.size / 1024).toFixed(2)} KB`);
                }
            };
            
            this.mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event);
            };
            
            this.mediaRecorder.onstop = () => {
                if (this.captureInterval) {
                    clearInterval(this.captureInterval);
                    this.captureInterval = null;
                }
                this.saveRecording();
            };
            
            // Start recording
            this.mediaRecorder.start(1000); // Collect data every second
            this.isRecording = true;
            console.log('Recording started with MIME type:', mimeType);
            return true;
            
        } catch (error) {
            console.error('Failed to initialize MediaRecorder:', error);
            return false;
        }
    }
    
    /**
     * Fall back to canvas-based capture when direct stream capture fails
     * @returns {boolean} - Whether fallback was successful
     */
    fallbackToCanvasCapture() {
        console.log('Falling back to canvas capture method');
        try {
            // Wait for video metadata to be loaded to get dimensions
            const setupCanvas = () => {
                // Set canvas dimensions to match video or use defaults if not available
                this.canvas.width = this.videoElement.videoWidth || 640;
                this.canvas.height = this.videoElement.videoHeight || 480;
                console.log(`Canvas dimensions set to ${this.canvas.width}x${this.canvas.height}`);
            };
            
            if (this.videoElement.readyState >= 1) { // HAVE_METADATA or better
                setupCanvas();
            } else {
                // Wait for metadata to load
                this.videoElement.addEventListener('loadedmetadata', setupCanvas, { once: true });
            }
            
            // Create a canvas to capture the video
            const canvas = document.createElement('canvas');
            canvas.width = this.videoElement.videoWidth || 640;
            canvas.height = this.videoElement.videoHeight || 480;
            
            // Get the canvas stream
            const stream = canvas.captureStream(30); // 30 FPS
            
            // Set up a loop to draw video frames to canvas
            this.captureInterval = setInterval(() => {
                if (this.videoElement.readyState >= 2) { // HAVE_CURRENT_DATA or better
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
                }
            }, 33); // ~30fps
            
            console.log('Created canvas capture stream as fallback');
            
            // Initialize recorder with the canvas stream
            return this.initializeRecorder(stream);
            
        } catch (captureError) {
            console.error('Failed to create canvas capture:', captureError);
            return false;
        }
    }

    /**
     * Stop recording the video feed
     */
    stopRecording() {
        if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
            return false;
        }
        
        this.mediaRecorder.stop();
        this.isRecording = false;
        console.log('Recording stopped');
        return true;
    }

    /**
     * Save the recorded video to a file
     */
    saveRecording() {
        if (!this.recordedChunks.length) {
            console.warn('No recorded data available');
            return false;
        }
        
        try {
            // Create a blob from the recorded chunks
            const blob = new Blob(this.recordedChunks, {
                type: 'video/webm'
            });
            
            // Generate filename with teacher details and timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const teacherName = this.teacherDetails.name || 'unknown';
            const teacherId = this.teacherDetails.id || 'unknown';
            const filename = `class_${teacherId}_${teacherName}_${timestamp}.webm`;
            
            // Ensure the output folder exists
            try {
                // Create recordings directory if it doesn't exist
                if (!window.webkitRequestFileSystem && !window.requestFileSystem) {
                    console.log('File System API not supported, falling back to download');
                }
            } catch (fsError) {
                console.warn('File system access error:', fsError);
            }
            
            // In a browser environment, use download attribute
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 500); // Increased timeout to ensure download starts
            
            console.log(`Recording saved as: ${filename}`);
            console.log(`Recording size: ${(blob.size / (1024 * 1024)).toFixed(2)} MB`);
            
            // Show a notification to the user
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Recording Saved', {
                    body: `Your class recording has been saved as ${filename}`,
                    icon: '/images/icon.png'
                });
            } else if ('Notification' in window && Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Recording Saved', {
                            body: `Your class recording has been saved as ${filename}`,
                            icon: '/images/icon.png'
                        });
                    }
                });
            }
            
            // Clear recorded chunks
            this.recordedChunks = [];
            
            return true;
            
        } catch (error) {
            console.error('Failed to save recording:', error);
            return false;
        }
    }
}

// Export the class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CameraRecorder;
} else {
    // For browser environments
    window.CameraRecorder = CameraRecorder;
}