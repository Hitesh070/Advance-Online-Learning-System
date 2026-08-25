/**
 * VideoSDK Integration Module for UpliftEd
 * This module provides functionality to integrate VideoSDK.live for video conferencing
 * and recording capabilities.
 */

class VideoSDKIntegration {
    constructor(options = {}) {
        this.isInitialized = false;
        this.meeting = null;
        this.participants = {};
        this.localParticipant = null;
        this.container = options.container || 'video-sdk-container';
        this.token = options.token || null;
        this.meetingId = options.meetingId || null;
        this.name = options.name || 'Teacher';
        
        // Set mic and webcam based on role
        if (this.name === 'Teacher') {
            // Teacher can control their mic and camera
            this.micEnabled = options.micEnabled !== undefined ? options.micEnabled : true;
            this.webcamEnabled = options.webcamEnabled !== undefined ? options.webcamEnabled : true;
        } else {
            // Students cannot use mic or camera
            this.micEnabled = false;
            this.webcamEnabled = false;
        }
        
        this.eventHandlers = options.eventHandlers || {};
        this.recordingEnabled = options.recordingEnabled !== undefined ? options.recordingEnabled : true;
        this.recordingOptions = options.recordingOptions || {};
        this.isRecording = false;
        
        // Log initialization
        console.log('VideoSDKIntegration initialized with options:', options);
    }

    /**
     * Initialize the VideoSDK with authentication token
     * @param {string} token - The authentication token for VideoSDK
     * @returns {boolean} - Whether initialization was successful
     */
    initialize(token) {
        if (!token && !this.token) {
            console.error('No authentication token provided');
            return false;
        }

        this.token = token || this.token;

        try {
            // Check if VideoSDK is available
            if (typeof window.VideoSDK === 'undefined') {
                console.error('VideoSDK is not defined. The library may not be loaded properly.');
                return false;
            }
            
            // Configure VideoSDK with the token
            window.VideoSDK.config(this.token);
            this.isInitialized = true;
            console.log('VideoSDK initialized successfully');
            
            // Create a mock video element for the container
            const container = document.getElementById(this.container);
            if (container) {
                // Clear any existing content
                container.innerHTML = '';
                
                // Create a mock video interface
                const mockInterface = document.createElement('div');
                mockInterface.className = 'mock-video-interface';
                mockInterface.style.width = '100%';
                mockInterface.style.height = '100%';
                mockInterface.style.backgroundColor = '#1a1a1a';
                mockInterface.style.color = 'white';
                mockInterface.style.display = 'flex';
                mockInterface.style.flexDirection = 'column';
                mockInterface.style.justifyContent = 'center';
                mockInterface.style.alignItems = 'center';
                mockInterface.style.padding = '20px';
                mockInterface.style.borderRadius = '8px';
                
                // Add mock video content based on role
                if (this.name === 'Teacher') {
                    // Teacher can see their own camera
                    mockInterface.innerHTML = `
                        <div style="text-align: center;">
                            <h3>Video Conference Simulation</h3>
                            <p>Real VideoSDK is currently unavailable.</p>
                            <p>Meeting ID: ${this.meetingId}</p>
                            <p>Participant: ${this.name}</p>
                            <div style="margin-top: 20px; width: 120px; height: 120px; background-color: #333; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto;">
                                <span style="font-size: 48px;">${this.name.charAt(0)}</span>
                            </div>
                            <div style="margin-top: 15px; padding: 10px; background-color: #333; border-radius: 8px;">
                                <p>Your camera is visible</p>
                                <div id="camera-preview-container" style="width: 160px; height: 120px; background-color: #555; border-radius: 8px; overflow: hidden; margin: 0 auto;">
                                    <video id="camera-preview" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Initialize camera preview for teachers
                    this.initializeCameraPreview();
                } else {
                    // Student can't see their own camera, only the teacher's
                    mockInterface.innerHTML = `
                        <div style="text-align: center;">
                            <h3>Video Conference Simulation</h3>
                            <p>Real VideoSDK is currently unavailable.</p>
                            <p>Meeting ID: ${this.meetingId}</p>
                            <p>Participant: ${this.name}</p>
                            <div style="margin-top: 20px;">
                                <p>Teacher's Camera:</p>
                                <div style="width: 160px; height: 120px; background-color: #333; border-radius: 8px; display: flex; justify-content: center; align-items: center; margin: 0 auto;">
                                    <span style="font-size: 24px;">T</span>
                                </div>
                                <p style="margin-top: 15px; color: #ff9800;">Note: Your camera and microphone are blocked for this session.</p>
                            </div>
                        </div>
                    `;
                    
                    // Disable camera and mic controls for students
                    this.micEnabled = false;
                    this.webcamEnabled = false;
                }
                
                container.appendChild(mockInterface);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to initialize VideoSDK:', error);
            return false;
        }
    }

    /**
     * Initialize camera preview for teachers
     */
    initializeCameraPreview() {
        // Only initialize camera preview for teachers
        if (this.name !== 'Teacher') return;
        
        const videoElement = document.getElementById('camera-preview');
        if (!videoElement) {
            console.error('Camera preview element not found');
            return;
        }
        
        // Request camera access
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoElement.srcObject = stream;
                this.cameraStream = stream; // Store the stream for later use
                console.log('Camera preview initialized successfully');
            })
            .catch(error => {
                console.error('Error accessing camera:', error);
                const previewContainer = document.getElementById('camera-preview-container');
                if (previewContainer) {
                    previewContainer.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background-color: #555;"><span style="color: #ff5555; font-size: 12px; text-align: center;">Camera access denied</span></div>`;
                }
            });
    }
    
    /**
     * Generate a random meeting ID if not provided
     * @returns {string} - A random meeting ID
     */
    generateMeetingId() {
        return 'class_' + Math.random().toString(36).substring(2, 12);
    }

    /**
     * Join a meeting with the specified meeting ID
     * @param {string} meetingId - The meeting ID to join
     * @returns {boolean} - Whether joining was successful
     */
    joinMeeting(meetingId) {
        if (!this.isInitialized) {
            console.error('VideoSDK not initialized. Call initialize() first.');
            return false;
        }

        this.meetingId = meetingId || this.meetingId || this.generateMeetingId();

        try {
            // Set microphone and webcam based on role
            if (this.name !== 'Teacher') {
                // Students cannot use mic or camera regardless of options
                this.micEnabled = false;
                this.webcamEnabled = false;
            }
            
            // Initialize the meeting
            this.meeting = window.VideoSDK.initMeeting({
                meetingId: this.meetingId,
                name: this.name,
                micEnabled: this.micEnabled,
                webcamEnabled: this.webcamEnabled,
            });

            // Set up event listeners
            this.setupEventListeners();

            // Join the meeting
            this.meeting.join();
            
            // Trigger the onMeetingJoined event handler if provided
            if (this.eventHandlers.onMeetingJoined) {
                setTimeout(() => {
                    this.eventHandlers.onMeetingJoined();
                }, 1000);
            }
            
            // Simulate a teacher joining for student view or a student joining for teacher view
            if (this.eventHandlers.onParticipantJoined) {
                setTimeout(() => {
                    const mockParticipant = {
                        id: 'mock-participant-' + Math.random().toString(36).substring(2, 7),
                        name: this.name === 'Teacher' ? 'Student' : 'Teacher',
                        enableMic: () => true,
                        disableMic: () => true,
                        enableWebcam: () => true,
                        disableWebcam: () => true
                    };
                    this.eventHandlers.onParticipantJoined(mockParticipant);
                }, 2000);
            }

            console.log('Joined meeting with ID:', this.meetingId);
            return true;
        } catch (error) {
            console.error('Failed to join meeting:', error);
            return false;
        }
    }

    /**
     * Set up event listeners for the meeting
     */
    setupEventListeners() {
        if (!this.meeting) {
            console.error('No meeting object available for setting up event listeners.');
            return;
        }

        console.log('Setting up mock event listeners');
        
        // For the mock implementation, we'll trigger events directly in the joinMeeting and leaveMeeting methods
        // This method is kept for compatibility with the original implementation
        
        // The actual event handlers are called directly in the joinMeeting and leaveMeeting methods
        // using setTimeout to simulate asynchronous events
    }

    /**
     * Start recording the meeting
     * @returns {boolean} - Whether starting recording was successful
     */
    startRecording() {
        if (!this.meeting) {
            console.error('No active meeting to record');
            return false;
        }

        try {
            // Start cloud recording
            this.meeting.startRecording(this.recordingOptions);
            console.log('Started recording the meeting (mock)');
            
            // Update the mock interface to show recording status
            this.isRecording = true;
            this.updateRecordingStatus();
            
            // Trigger the onRecordingStarted event handler if provided
            if (this.eventHandlers.onRecordingStarted) {
                setTimeout(() => {
                    this.eventHandlers.onRecordingStarted();
                }, 1000);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to start recording:', error);
            return false;
        }
    }

    /**
     * Stop recording the meeting
     * @returns {boolean} - Whether stopping recording was successful
     */
    stopRecording() {
        if (!this.meeting) {
            console.error('No active meeting to stop recording');
            return false;
        }

        try {
            // Stop cloud recording
            this.meeting.stopRecording();
            console.log('Stopped recording the meeting (mock)');
            
            // Update the mock interface to show recording status
            this.isRecording = false;
            this.updateRecordingStatus();
            
            // Trigger the onRecordingStopped event handler if provided
            if (this.eventHandlers.onRecordingStopped) {
                setTimeout(() => {
                    this.eventHandlers.onRecordingStopped();
                }, 1000);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to stop recording:', error);
            return false;
        }
    }
    
    /**
     * Update the recording status in the mock interface
     * @private
     */
    updateRecordingStatus() {
        const container = document.getElementById(this.container);
        if (!container) return;
        
        const mockInterface = container.querySelector('.mock-video-interface');
        if (!mockInterface) return;
        
        // Find or create recording status indicator
        let recordingIndicator = mockInterface.querySelector('.recording-indicator');
        if (!recordingIndicator) {
            recordingIndicator = document.createElement('div');
            recordingIndicator.className = 'recording-indicator';
            recordingIndicator.style.marginTop = '15px';
            recordingIndicator.style.textAlign = 'center';
            mockInterface.querySelector('div').appendChild(recordingIndicator);
        }
        
        // Update the recording indicator
        if (this.isRecording) {
            recordingIndicator.innerHTML = `
                <div style="display: inline-flex; align-items: center; padding: 5px 10px; border-radius: 4px; background-color: #f44336; color: white;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: white; margin-right: 5px;"></span>
                    Recording
                </div>
            `;
            
            // Add blinking animation to the recording dot
            const recordingDot = recordingIndicator.querySelector('span');
            recordingDot.style.animation = 'blink 1s infinite';
            
            // Add the animation if it doesn't exist
            if (!document.querySelector('#recording-blink-animation')) {
                const style = document.createElement('style');
                style.id = 'recording-blink-animation';
                style.textContent = `
                    @keyframes blink {
                        0% { opacity: 1; }
                        50% { opacity: 0.3; }
                        100% { opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
        } else {
            recordingIndicator.innerHTML = '';
        }
    }

    /**
     * Leave the current meeting
     * @returns {boolean} - Whether leaving was successful
     */
    leaveMeeting() {
        if (!this.meeting) {
            console.error('No active meeting to leave.');
            return false;
        }

        try {
            // Stop recording if it's active
            if (this.meeting.recording) {
                this.stopRecording();
            }

            // Leave the meeting
            this.meeting.leave();
            this.meeting = null;
            
            // Clear the container
            const container = document.getElementById(this.container);
            if (container) {
                container.innerHTML = '';
            }
            
            console.log('Left the meeting');
            return true;
        } catch (error) {
            console.error('Failed to leave meeting:', error);
            return false;
        }
    }

    /**
     * Toggle microphone on/off
     * @returns {boolean} - New microphone state (true = enabled, false = disabled)
     */
    toggleMic() {
        if (!this.meeting) {
            console.error('No active meeting for toggling microphone.');
            return this.micEnabled;
        }

        try {
            // Only allow teachers to toggle mic
            if (this.name !== 'Teacher') {
                console.log('Students cannot enable microphone in this session');
                // Ensure mic stays disabled for students
                if (this.micEnabled) {
                    this.meeting.disableMic();
                    this.micEnabled = false;
                    this.updateMockInterface();
                }
                return false;
            }
            
            if (this.micEnabled) {
                this.meeting.disableMic();
                
                // Update the mock interface to show mic is off
                this.updateMockInterface();
            } else {
                this.meeting.enableMic();
                
                // Update the mock interface to show mic is on
                this.updateMockInterface();
            }
            this.micEnabled = !this.micEnabled;
            console.log('Microphone toggled:', this.micEnabled ? 'on' : 'off');
            return this.micEnabled;
        } catch (error) {
            console.error('Failed to toggle microphone:', error);
            return this.micEnabled;
        }
    }

    /**
     * Toggle webcam on/off
     * @returns {boolean} - Whether the webcam is now enabled
     */
    toggleWebcam() {
        if (!this.meeting) {
            console.error('No active meeting. Cannot toggle webcam.');
            return false;
        }
        
        // Only teachers can toggle webcam
        if (this.name !== 'Teacher') {
            console.log('Students cannot toggle webcam');
            // Ensure webcam stays disabled for students
            if (this.webcamEnabled) {
                this.webcamEnabled = false;
                
                // Update the mock interface
                const container = document.getElementById(this.container);
                if (container) {
                    const mockInterface = container.querySelector('.mock-video-interface');
                    if (mockInterface) {
                        const cameraStatus = mockInterface.querySelector('p');
                        if (cameraStatus && cameraStatus.textContent.includes('camera')) {
                            cameraStatus.textContent = 'Your camera is disabled';
                        }
                    }
                }
            }
            return false;
        }

        try {
            // Toggle webcam state
            this.webcamEnabled = !this.webcamEnabled;
            
            // Update the camera preview based on webcam state
            const videoElement = document.getElementById('camera-preview');
            const previewContainer = document.getElementById('camera-preview-container');
            
            if (this.webcamEnabled) {
                // Enable camera
                if (videoElement && previewContainer) {
                    // If we have a stored stream, use it
                    if (this.cameraStream) {
                        videoElement.srcObject = this.cameraStream;
                    } else {
                        // Otherwise request camera access again
                        navigator.mediaDevices.getUserMedia({ video: true })
                            .then(stream => {
                                videoElement.srcObject = stream;
                                this.cameraStream = stream;
                            })
                            .catch(error => {
                                console.error('Error accessing camera:', error);
                                previewContainer.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background-color: #555;"><span style="color: #ff5555; font-size: 12px; text-align: center;">Camera access denied</span></div>`;
                                this.webcamEnabled = false;
                            });
                    }
                }
            } else {
                // Disable camera
                if (videoElement && videoElement.srcObject) {
                    // Stop all tracks in the stream
                    const stream = videoElement.srcObject;
                    if (stream) {
                        const tracks = stream.getTracks();
                        tracks.forEach(track => track.stop());
                    }
                    videoElement.srcObject = null;
                    
                    // Show placeholder
                    if (previewContainer) {
                        previewContainer.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background-color: #555;"><span style="font-size: 12px; text-align: center;">Camera disabled</span></div>`;
                    }
                }
            }
            
            // Update the mock interface text
            const container = document.getElementById(this.container);
            if (container) {
                const mockInterface = container.querySelector('.mock-video-interface');
                if (mockInterface) {
                    const cameraStatus = mockInterface.querySelector('p');
                    if (cameraStatus && cameraStatus.textContent.includes('camera')) {
                        cameraStatus.textContent = this.webcamEnabled ? 'Your camera is visible' : 'Your camera is disabled';
                    }
                }
            }
            
            // Trigger the onWebcamStatusChanged event if provided
            if (this.eventHandlers.onWebcamStatusChanged) {
                this.eventHandlers.onWebcamStatusChanged(this.webcamEnabled);
            }
            
            console.log('Webcam toggled:', this.webcamEnabled ? 'enabled' : 'disabled');
            return this.webcamEnabled;
        } catch (error) {
            console.error('Failed to toggle webcam:', error);
            return false;
        }
    }
    
    /**
     * Update the mock interface to reflect current state
     * @private
     */
    updateMockInterface() {
        const container = document.getElementById(this.container);
        if (!container) return;
        
        const mockInterface = container.querySelector('.mock-video-interface');
        if (!mockInterface) return;
        
        // Find or create status indicators
        let statusDiv = mockInterface.querySelector('.mock-status-indicators');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.className = 'mock-status-indicators';
            statusDiv.style.marginTop = '15px';
            statusDiv.style.display = 'flex';
            statusDiv.style.justifyContent = 'center';
            statusDiv.style.gap = '15px';
            mockInterface.querySelector('div').appendChild(statusDiv);
        }
        
        // Update the status indicators
        statusDiv.innerHTML = `
            <div style="padding: 5px 10px; border-radius: 4px; background-color: ${this.micEnabled ? '#4caf50' : '#f44336'}">
                Mic: ${this.micEnabled ? 'On' : 'Off'}
            </div>
            <div style="padding: 5px 10px; border-radius: 4px; background-color: ${this.webcamEnabled ? '#4caf50' : '#f44336'}">
                Camera: ${this.webcamEnabled ? 'On' : 'Off'}
            </div>
        `;
    }

    /**
     * Get the local video stream for recording with CameraRecorder
     * @returns {MediaStream|null} - The local video stream or null if not available
     */
    getLocalVideoStream() {
        if (!this.localParticipant) {
            console.error('No local participant');
            return null;
        }

        try {
            // Get the webcam stream from the local participant
            const webcamStream = this.localParticipant.getVideoStream();
            return webcamStream;
        } catch (error) {
            console.error('Failed to get local video stream:', error);
            return null;
        }
    }

    /**
     * Get the number of participants in the meeting
     * @returns {number} - The number of participants
     */
    getParticipantCount() {
        return Object.keys(this.participants).length + (this.localParticipant ? 1 : 0);
    }

    /**
     * Get the meeting ID
     * @returns {string} - The meeting ID
     */
    getMeetingId() {
        return this.meetingId;
    }
}

// Export the class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoSDKIntegration;
} else {
    // For browser environments
    window.VideoSDKIntegration = VideoSDKIntegration;
}