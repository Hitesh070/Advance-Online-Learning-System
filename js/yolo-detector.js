/**
 * YOLOv8 Content Moderation Module for UpliftEd
 * This module integrates YOLOv8 object detection to monitor teacher's video feed
 * for inappropriate content and automatically end class if detected.
 */

class YOLOContentModerator {
    constructor(options = {}) {
        this.modelLoaded = false;
        this.isMonitoring = false;
        this.detectionInterval = null;
        this.captureInterval = null; // For canvas-based video capture
        this.videoElement = null;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.model = null;
        this.detectionThreshold = options.detectionThreshold || 0.5;
        this.checkInterval = options.checkInterval || 1000; // Check every 1 second by default
        this.inappropriateClasses = [
            'weapon', 'knife', 'gun', 'pistol', 'rifle', 'violence', 
            'alcohol', 'cigarette', 'drug', 'inappropriate', 'offensive'
        ];
        this.onInappropriateContent = options.onInappropriateContent || this.defaultInappropriateContentHandler;
        this.lastDetectionResult = null;
        this.recordingEnabled = options.recordingEnabled || false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.teacherDetails = options.teacherDetails || {};
        this.outputFolder = options.outputFolder || 'recordings';
        
        // Log initialization
        console.log('YOLOContentModerator initialized with recording:', this.recordingEnabled);
    }

    /**
     * Load the YOLOv8 model
     */
    async loadModel() {
        try {
            // In a real implementation, you would load the actual YOLOv8 model
            // For this example, we'll simulate model loading
            console.log('Loading YOLOv8 model...');
            
            // Simulate model loading delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In a real implementation, you would use something like:
            // this.model = await tf.loadGraphModel('path/to/yolov8/model.json');
            
            this.modelLoaded = true;
            console.log('YOLOv8 model loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load YOLOv8 model:', error);
            return false;
        }
    }

    /**
     * Start monitoring the video feed
     * @param {HTMLVideoElement} videoElement - The video element to monitor
     */
    startMonitoring(videoElement) {
        if (!this.modelLoaded) {
            console.error('Model not loaded. Call loadModel() first.');
            return false;
        }

        if (!videoElement || !(videoElement instanceof HTMLVideoElement)) {
            console.error('Invalid video element provided');
            return false;
        }

        this.videoElement = videoElement;
        this.isMonitoring = true;
        
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
        
        // Start detection loop
        this.detectionInterval = setInterval(() => {
            this.detectContent();
        }, this.checkInterval);
        
        console.log('Content monitoring started');
        
        // Start recording if enabled
        if (this.recordingEnabled) {
            // Wait a short time to ensure video is playing
            setTimeout(() => {
                const success = this.startRecording();
                console.log('Recording started:', success);
            }, 1000);
        }
        
        return true;
    }

    /**
     * Stop monitoring the video feed
     */
    stopMonitoring() {
        this.isMonitoring = false;
        
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }
        
        // Stop canvas capture interval if it exists
        if (this.captureInterval) {
            clearInterval(this.captureInterval);
            this.captureInterval = null;
        }
        
        // Stop recording if it's active
        if (this.recordingEnabled && this.mediaRecorder && 
            (this.mediaRecorder.state === 'recording')) {
            this.stopRecording();
        }
        
        console.log('Content monitoring stopped');
        return true;
    }

    /**
     * Detect content in the current video frame
     */
    async detectContent() {
        if (!this.isMonitoring || !this.videoElement) return;
        
        try {
            // Check if video is ready for capture
            if (this.videoElement.readyState < 2) { // HAVE_CURRENT_DATA or better
                console.log('Video not ready for capture yet');
                return;
            }
            
            // Ensure canvas dimensions match video if they've changed
            if (this.videoElement.videoWidth && 
                (this.canvas.width !== this.videoElement.videoWidth || 
                 this.canvas.height !== this.videoElement.videoHeight)) {
                this.canvas.width = this.videoElement.videoWidth;
                this.canvas.height = this.videoElement.videoHeight;
                console.log(`Updated canvas dimensions to ${this.canvas.width}x${this.canvas.height}`);
            }
            
            // Draw current video frame to canvas
            try {
                this.ctx.drawImage(
                    this.videoElement, 
                    0, 0, 
                    this.canvas.width, 
                    this.canvas.height
                );
            } catch (drawError) {
                console.error('Error drawing video to canvas:', drawError);
                return;
            }
            
            // In a real implementation, you would:
            // 1. Convert canvas to tensor
            // 2. Run inference with the YOLOv8 model
            // 3. Process detection results
            
            // For this example, we'll simulate detection
            const detectionResult = this.simulateDetection();
            this.lastDetectionResult = detectionResult;
            
            // Check for inappropriate content
            if (this.hasInappropriateContent(detectionResult)) {
                // Call the handler with the detection result
                this.onInappropriateContent(detectionResult);
            }
            
        } catch (error) {
            console.error('Error during content detection:', error);
        }
    }

    /**
     * Simulate YOLOv8 detection (for demonstration purposes)
     * In a real implementation, this would be replaced with actual model inference
     */
    simulateDetection() {
        // Simulate detection results
        // In a real implementation, this would be the output from the YOLOv8 model
        
        // Most of the time, return normal content (no inappropriate items)
        if (Math.random() > 0.05) { // 95% of the time, no inappropriate content
            return {
                boxes: [
                    { x: 100, y: 150, width: 200, height: 300, class: 'person', confidence: 0.92 },
                    { x: 400, y: 200, width: 100, height: 100, class: 'book', confidence: 0.87 }
                ],
                timestamp: new Date().toISOString(),
                hasInappropriateContent: false
            };
        }
        
        // Occasionally simulate inappropriate content detection (for testing)
        const inappropriateClass = this.inappropriateClasses[
            Math.floor(Math.random() * this.inappropriateClasses.length)
        ];
        
        return {
            boxes: [
                { x: 100, y: 150, width: 200, height: 300, class: 'person', confidence: 0.92 },
                { x: 300, y: 250, width: 150, height: 150, class: inappropriateClass, confidence: 0.78 }
            ],
            timestamp: new Date().toISOString(),
            hasInappropriateContent: true,
            inappropriateItem: inappropriateClass
        };
    }

    /**
     * Check if detection results contain inappropriate content
     */
    hasInappropriateContent(detectionResult) {
        if (!detectionResult || !detectionResult.boxes) return false;
        
        // In a real implementation, you would analyze the detection results
        // and check for specific classes that are considered inappropriate
        
        for (const box of detectionResult.boxes) {
            if (this.inappropriateClasses.includes(box.class) && 
                box.confidence >= this.detectionThreshold) {
                return true;
            }
        }
        
        // For simulation purposes, we'll also use the pre-computed flag
        return detectionResult.hasInappropriateContent === true;
    }

    /**
     * Default handler for inappropriate content detection
     */
    defaultInappropriateContentHandler(detectionResult) {
        console.warn('INAPPROPRIATE CONTENT DETECTED:', detectionResult);
        alert('Inappropriate content detected. The class will be terminated.');
        // Trigger class termination
        if (window.endClass && typeof window.endClass === 'function') {
            window.endClass();
        }
    }

    /**
     * Start recording the video feed
     */
    startRecording() {
        if (!this.videoElement || !this.recordingEnabled) return false;
        
        try {
            // Get the video stream
            let stream = this.videoElement.srcObject;
            
            // If srcObject is not available, try to capture the video element directly
            if (!stream) {
                console.log('No srcObject stream available, attempting to capture video element directly');
                try {
                    // Create a canvas to capture the video
                    const canvas = document.createElement('canvas');
                    canvas.width = this.videoElement.videoWidth || 640;
                    canvas.height = this.videoElement.videoHeight || 480;
                    
                    // Get the canvas stream
                    stream = canvas.captureStream(30); // 30 FPS
                    
                    // Set up a loop to draw video frames to canvas
                    this.captureInterval = setInterval(() => {
                        if (this.videoElement.readyState >= 2) { // HAVE_CURRENT_DATA or better
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
                        }
                    }, 33); // ~30fps
                    
                    console.log('Created canvas capture stream as fallback');
                } catch (captureError) {
                    console.error('Failed to create canvas capture:', captureError);
                    return false;
                }
            }
            
            if (!stream) {
                console.error('Could not obtain any stream for recording');
                return false;
            }
            
            // Initialize MediaRecorder with appropriate MIME type
            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
                ? 'video/webm;codecs=vp9' 
                : 'video/webm';
                
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
            console.log('Recording started with MIME type:', mimeType);
            return true;
            
        } catch (error) {
            console.error('Failed to start recording:', error);
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
            const fullPath = `${this.outputFolder}/${filename}`;
            
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
            }, 100);
            
            console.log(`Recording saved as: ${fullPath}`);
            console.log(`Recording size: ${(blob.size / (1024 * 1024)).toFixed(2)} MB`);
            
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
    module.exports = YOLOContentModerator;
} else {
    // For browser environments
    window.YOLOContentModerator = YOLOContentModerator;
}