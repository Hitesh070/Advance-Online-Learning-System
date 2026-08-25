// Teacher Live Class JavaScript

$(document).ready(function() {
    // Global variables
let videoSDK = null;
let recognition = null;
let isClassStarted = false;
let classStartTime = null;
let durationInterval = null;
let currentTranscript = "";
let participantCount = 0;
let cameraRecorder = null;
let isRecordingActive = false;
    
    // DOM elements
const startClassBtn = $('#start-class-btn');
const endClassBtn = $('#end-class-btn');
const toggleMicBtn = $('#toggle-mic-btn');
const toggleCameraBtn = $('#toggle-camera-btn');
const shareScreenBtn = $('#share-screen-btn');
const classIdElement = $('#class-id');
const classDurationElement = $('#class-duration');
const studentsCountElement = $('#students-count');
const transcriptionText = $('#transcription-text');
const translationStatus = $('#translation-status-text');
const sourceLanguageSelect = $('#source-language');
const participantsList = $('#participants-list');
const recordingStatusElement = $('#recording-status');
    
    // Configuration values
const enableRecording = true; // Always enable recording
    
    // Generate a unique teacher ID based on timestamp
    function generateTeacherId() {
        return 'T-' + new Date().getTime().toString().slice(-6);
    }
    
    // Initialize Google Translate
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            autoDisplay: false
        }, 'google_translate_element');
    }
    
    // Initialize Speech Recognition API
    function initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            setupSpeechRecognition();
            return true;
        } else if ('SpeechRecognition' in window) {
            recognition = new SpeechRecognition();
            setupSpeechRecognition();
            return true;
        } else {
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
            return false;
        }
    }
    
    // Configure Speech Recognition
    function setupSpeechRecognition() {
        recognition.continuous = true;
        recognition.interimResults = true;
        
        // Set language based on selection
        recognition.lang = sourceLanguageSelect.val();
        
        recognition.onstart = function() {
            translationStatus.text('Active').addClass('active');
        };
        
        recognition.onend = function() {
            if (isClassStarted) {
                recognition.start(); // Restart if class is still going
            } else {
                translationStatus.text('Not Started').removeClass('active');
            }
        };
        
        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                    translateText(transcript);
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Update the transcription display
            if (finalTranscript) {
                currentTranscript += finalTranscript + ' ';
                updateTranscriptionDisplay();
            }
            
            if (interimTranscript) {
                transcriptionText.html(`<p>${currentTranscript}<span style="color: #999;">${interimTranscript}</span></p>`);
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            if (event.error === 'no-speech') {
                // No speech detected, just continue
                return;
            }
            
            translationStatus.text('Error: ' + event.error).removeClass('active');
            setTimeout(() => {
                if (isClassStarted) {
                    recognition.start();
                }
            }, 1000);
        };
    }
    
    // Update transcription display
    function updateTranscriptionDisplay() {
        // Keep only the last 500 characters to prevent the display from getting too long
        if (currentTranscript.length > 500) {
            currentTranscript = '...' + currentTranscript.slice(-450);
        }
        transcriptionText.html(`<p>${currentTranscript}</p>`);
        transcriptionText.scrollTop(transcriptionText[0].scrollHeight);
    }
    
    // Translate text using a more reliable approach with fallbacks
    function translateText(text) {
        if (!text || text.trim() === '') return;
        
        console.log('Translating: ' + text);
        
        // Get source language code from the select element
        const sourceLanguage = sourceLanguageSelect.val().split('-')[0];
        
        // Check if the source language is supported by LibreTranslate
        // LibreTranslate supports: en, ar, zh, nl, fi, fr, de, hi, hu, id, ga, it, ja, ko, pl, pt, ru, es, sv, tr, uk, vi
        // For South Indian languages, we'll use a fallback method
        const supportedLanguages = ['en', 'ar', 'zh', 'nl', 'fi', 'fr', 'de', 'hi', 'hu', 'id', 'ga', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'es', 'sv', 'tr', 'uk', 'vi'];
        
        // South Indian languages we added
        const southIndianLanguages = ['ta', 'te', 'ml', 'kn'];
        
        // Try multiple translation services with fallbacks
        tryTranslationServices(text, sourceLanguage);
    }
    
    // Try multiple translation services with fallbacks
    function tryTranslationServices(text, sourceLanguage) {
        // First try Google Translate if available
        if (window.google && window.google.translate && typeof window.google.translate.TranslateElement !== 'undefined') {
            try {
                console.log('Attempting to use Google Translate API');
                // Since direct API access is limited in client-side code,
                // we'll use a fallback for demonstration
                useLibreTranslateAPI(text, sourceLanguage);
            } catch (error) {
                console.error('Google Translate error:', error);
                useLibreTranslateAPI(text, sourceLanguage);
            }
        } else {
            // If Google Translate is not available, try LibreTranslate
            useLibreTranslateAPI(text, sourceLanguage);
        }
    }
    
    // Use LibreTranslate API with proper error handling
    function useLibreTranslateAPI(text, sourceLanguage) {
        // Using LibreTranslate API (free and open source)
        // This uses the public instance at libretranslate.de
        $.ajax({
            url: 'https://libretranslate.de/translate',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                q: text,
                source: sourceLanguage,
                target: 'es', // Default target language
                format: 'text'
            }),
            success: function(response) {
                if (response && response.translatedText) {
                    // Send translation to students
                    sendTranslationToStudents({
                        original: text,
                        translated: response.translatedText,
                        sourceLanguage: sourceLanguage,
                        targetLanguage: 'es'
                    });
                } else {
                    console.error('Translation response invalid');
                    useFallbackTranslation(text, sourceLanguage);
                }
            },
            error: function(error) {
                console.error('LibreTranslate error:', error);
                useFallbackTranslation(text, sourceLanguage);
            },
            timeout: 5000 // Set a timeout to avoid hanging requests
        });
    }
    
    // Use fallback translation based on language
    function useFallbackTranslation(text, sourceLanguage) {
        // South Indian languages we added
        const southIndianLanguages = ['ta', 'te', 'ml', 'kn'];
        
        if (southIndianLanguages.includes(sourceLanguage)) {
            mockTranslateWithLanguage(text, sourceLanguage);
        } else {
            mockTranslate(text);
        }
    }
    
    // Enhanced mock translation function for South Indian languages
    function mockTranslateWithLanguage(text, sourceLanguage) {
        // Language-specific mock translations
        const languageNames = {
            'ta': 'Tamil',
            'te': 'Telugu',
            'ml': 'Malayalam',
            'kn': 'Kannada'
        };
        
        const languageName = languageNames[sourceLanguage] || sourceLanguage;
        const mockTranslation = `[${languageName} TRANSLATION]: ${text}`;
        
        sendTranslationToStudents({
            original: text,
            translated: mockTranslation,
            sourceLanguage: sourceLanguage,
            targetLanguage: 'es'
        });
    }
    
    // Mock translation function for demo/fallback purposes
    function mockTranslate(text) {
        const sourceLang = sourceLanguageSelect.val().split('-')[0];
        const mockTranslation = `[MOCK TRANSLATION from ${sourceLang}]: ${text}`;
        
        sendTranslationToStudents({
            original: text,
            translated: mockTranslation,
            sourceLanguage: sourceLang,
            targetLanguage: 'es'
        });
    }
    
    // Global socket variable
    let socket = null;
    
    // Initialize Socket.io connection
    function initSocketConnection() {
        // Connect to the Socket.io server
        // In a production environment, you would connect to your actual server
        // For demo purposes, we're using a public Socket.io server
        socket = io('https://socketio-whiteboard-zmx4.herokuapp.com/', {
            transports: ['websocket']
        });
        
        socket.on('connect', () => {
            console.log('Socket.io connected with ID:', socket.id);
            $('#translation-status-text').text('Connected (Socket ID: ' + socket.id + ')');
        });
        
        socket.on('connect_error', (error) => {
            console.error('Socket.io connection error:', error);
            $('#translation-status-text').text('Connection Error');
        });
        
        socket.on('disconnect', () => {
            console.log('Socket.io disconnected');
            $('#translation-status-text').text('Disconnected');
        });
        
        // Create a room based on the class ID
        const roomId = classIdElement.text();
        if (roomId && roomId !== 'Not started') {
            socket.emit('join-room', roomId);
            console.log('Joined Socket.io room:', roomId);
        }
        
        return socket;
    }
    
    // Send translation to students via Socket.io
    function sendTranslationToStudents(translationData) {
        console.log('Sending translation to students:', translationData);
        
        // Display the translation in the teacher's UI
        const translationHtml = `
            <div class="translation-item">
                <div class="original-text">${translationData.original}</div>
                <div class="translated-text">${translationData.translated}</div>
                <div class="translation-meta">From: ${translationData.sourceLanguage} → To: ${translationData.targetLanguage}</div>
            </div>
        `;
        
        // Append to the transcription container
        $('#transcription-text').append(translationHtml);
        
        // Send via Socket.io if connected
        if (socket && socket.connected) {
            // Add the class ID to the translation data
            translationData.classId = classIdElement.text();
            socket.emit('translation', translationData);
            console.log('Translation sent via Socket.io');
        } else {
            console.warn('Socket.io not connected, translation not sent');
            // Try to reconnect
            if (socket) {
                socket.connect();
            } else {
                initSocketConnection();
            }
        }
    }
    
    // Initialize VideoSDK for video conferencing
    function initVideoSDK() {
        // Generate a random room name if not provided
        const roomName = 'class_' + Math.random().toString(36).substring(2, 12);
        classIdElement.text(roomName);
        
        // Check if VideoSDK is available
        if (typeof window.VideoSDK === 'undefined') {
            console.error('VideoSDK library not loaded. Check network connection and script inclusion.');
            alert('VideoSDK library not loaded. Please check your internet connection and refresh the page.');
            return false;
        }
        
        // For demo purposes, we're using a temporary token
        // In production, you would generate this token from your server
        // Generate a new token that doesn't expire
        const tempToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI2NDA5NGJmZS1iMjE0LTRmZjUtODg5Ni0wNmRhZjhjOGI3OTEiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5NDEwMzI5MSwiZXhwIjoxODUxNzgzMjkxfQ.yMvYOdQfO9RYLsKQF9HnXCcQiPpR9ILbvzZbcdV7uBw";
        
        try {
            console.log('Initializing VideoSDK integration...');
            // Initialize VideoSDK integration
            videoSDK = new VideoSDKIntegration({
                container: 'video-sdk-container',
                meetingId: roomName,
                name: 'Teacher', // Explicitly set role as Teacher to enable camera/mic
                micEnabled: true,
                webcamEnabled: true,
                recordingEnabled: true,
                eventHandlers: {
                    onMeetingJoined: handleVideoConferenceJoined,
                    onParticipantJoined: handleParticipantJoined,
                    onParticipantLeft: handleParticipantLeft,
                    onStreamEnabled: handleStreamEnabled,
                    onStreamDisabled: handleStreamDisabled,
                    onMeetingLeft: handleReadyToClose,
                    onRecordingStarted: handleRecordingStarted,
                    onRecordingStopped: handleRecordingStopped
                }
            });
            
            // Ensure teacher controls are enabled
            $('#toggle-mic-btn').prop('disabled', false).removeClass('disabled');
            $('#toggle-camera-btn').prop('disabled', false).removeClass('disabled');
            
            console.log('VideoSDK integration object created:', videoSDK);
            
            // Initialize VideoSDK with the token
            const initialized = videoSDK.initialize(tempToken);
            console.log('VideoSDK initialization result:', initialized);
            if (!initialized) {
                throw new Error('Failed to initialize VideoSDK');
            }
            
            // Join the meeting
            const joined = videoSDK.joinMeeting();
            console.log('VideoSDK join meeting result:', joined);
            if (!joined) {
                throw new Error('Failed to join meeting');
            }
            
            return true;
        } catch (error) {
            console.error('Failed to initialize VideoSDK:', error);
            alert('Failed to initialize video conference: ' + error.message + '. Please try again.');
            return false;
        }
    }
    
    // VideoSDK event handlers
    function handleVideoConferenceJoined() {
        console.log('Teacher joined the conference');
        enableControls();
        
        // Start recording automatically
        if (enableRecording && cameraRecorder) {
            // VideoSDK already handles recording via the cloud
            // But we can also record locally as a backup
            setTimeout(() => {
                try {
                    // Try direct media capture for local recording
                    tryDirectMediaCapture();
                } catch (error) {
                    console.error('Error starting recording:', error);
                    recordingStatusElement.text('Recording error');
                }
            }, 3000); // Wait for tracks to initialize
        }
    }
    
    // Fallback function to try direct media capture
    function tryDirectMediaCapture() {
        console.log('Trying direct media capture as fallback');
        
        // Request user media directly
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                // Create a video element for the stream
                const videoElement = document.createElement('video');
                videoElement.autoplay = true;
                videoElement.muted = true;
                videoElement.id = 'direct-video-for-recording';
                videoElement.style.position = 'absolute';
                videoElement.style.top = '-9999px';
                videoElement.style.left = '-9999px';
                videoElement.srcObject = stream;
                document.body.appendChild(videoElement);
                
                // Start recording with this video element
                setTimeout(() => {
                    const recordingStarted = cameraRecorder.startRecording(videoElement);
                    
                    if (recordingStarted) {
                        isRecordingActive = true;
                        recordingStatusElement.text('Recording (fallback)');
                        console.log('Recording started with fallback method');
                    } else {
                        recordingStatusElement.text('Recording failed');
                        console.error('All recording methods failed');
                    }
                }, 1000);
            })
            .catch(err => {
                console.error('Failed to get user media as fallback:', err);
                recordingStatusElement.text('Recording unavailable');
            });
    }
    
    function handleParticipantJoined(event) {
        console.log('Participant joined', event);
        participantCount++;
        studentsCountElement.text(participantCount);
        
        // Add participant to the list
        const participantId = event.id;
        const participantName = event.displayName || 'Student';
        participantsList.append(`<li data-id="${participantId}">${participantName}</li>`);
    }
    
    function handleParticipantLeft(event) {
        console.log('Participant left', event);
        participantCount = Math.max(0, participantCount - 1);
        studentsCountElement.text(participantCount);
        
        // Remove participant from the list
        participantsList.find(`li[data-id="${event.id}"]`).remove();
    }
    
    function handleAudioMuteStatusChanged(event) {
        console.log('Audio mute status changed', event);
        toggleMicBtn.text(event.muted ? 'Unmute Mic' : 'Mute Mic');
    }
    
    function handleStreamDisabled(stream) {
        console.log('Stream disabled', stream);
        if (stream.kind === 'video') {
            toggleCameraBtn.text('Turn On Camera');
        } else if (stream.kind === 'audio') {
            toggleMicBtn.text('Unmute Mic');
        }
    }
    
    function handleStreamEnabled(stream) {
        console.log('Stream enabled', stream);
        if (stream.kind === 'video') {
            toggleCameraBtn.text('Turn Off Camera');
        } else if (stream.kind === 'audio') {
            toggleMicBtn.text('Mute Mic');
        }
    }
    
    function handleReadyToClose() {
        console.log('VideoSDK meeting is ready to close');
        endClass();
    }
    
    // Handle recording started event
    function handleRecordingStarted() {
        console.log('VideoSDK recording started');
        isRecordingActive = true;
        recordingStatusElement.text('Recording (VideoSDK)');
    }
    
    // Handle recording stopped event
    function handleRecordingStopped() {
        console.log('VideoSDK recording stopped');
        isRecordingActive = false;
        recordingStatusElement.text('Recording stopped');
    }
    
    // Enable control buttons
    function enableControls() {
        endClassBtn.prop('disabled', false);
        toggleMicBtn.prop('disabled', false);
        toggleCameraBtn.prop('disabled', false);
        // Screen sharing disabled for security reasons
        // shareScreenBtn.prop('disabled', false);
    }
    
    // Disable control buttons
    function disableControls() {
        endClassBtn.prop('disabled', true);
        toggleMicBtn.prop('disabled', true);
        toggleCameraBtn.prop('disabled', true);
        // Screen sharing disabled for security reasons
        // shareScreenBtn.prop('disabled', true);
    }
    
    // Initialize Camera Recorder
    function initCameraRecorder() {
        try {
            // Set teacher details and output folder
            const teacherDetails = {
                name: 'Teacher', // In a real app, this would come from user profile
                id: 'T' + Math.floor(Math.random() * 10000), // Generate a random teacher ID for demo
            };
            
            // Create camera recorder instance with configured values
            cameraRecorder = new CameraRecorder({
                teacherDetails: teacherDetails,
                outputFolder: 'recordings' // Use the recordings folder we created
            });
            
            // Request notification permission for recording notifications
            if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                Notification.requestPermission();
            }
            
            // Create recordings directory if it doesn't exist
            try {
                if (!window.webkitRequestFileSystem && !window.requestFileSystem) {
                    console.log('File System API not supported, using browser download instead');
                }
            } catch (fsError) {
                console.warn('File system access error:', fsError);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to initialize camera recorder:', error);
            return false;
        }
    }
    

    
    // Show discipline popup
    function showDisciplinePopup() {
        $('#discipline-modal').css('display', 'block');
    }
    
    // Hide discipline popup
    function hideDisciplinePopup() {
        $('#discipline-modal').css('display', 'none');
    }
    
    // Start the class
    function startClass() {
        // Show discipline popup first
        showDisciplinePopup();
        
        // The actual class start will be triggered by the accept button
    }
    
    // Function to actually start the class after accepting discipline terms
    function startClassAfterAcceptance() {
        // Hide the popup
        hideDisciplinePopup();
        
        // Always initialize camera recorder
        if (enableRecording) {
            const recorderInitialized = initCameraRecorder();
            if (!recorderInitialized) {
                if (!confirm('Camera recorder initialization failed. Continue without recording?')) {
                    return;
                }
            }
        }
        
        if (initVideoSDK()) {
            isClassStarted = true;
            classStartTime = new Date();
            startClassBtn.prop('disabled', true);
            
            // Start the duration timer
            durationInterval = setInterval(updateDuration, 1000);
            
            // Start speech recognition if available
            if (initSpeechRecognition()) {
                recognition.start();
            }
            
            // Show recording status
            recordingStatusElement.text('Recording will start when video is available');
        }
    }
    
    // End the class
    function endClass() {
        isClassStarted = false;
        
        // Stop recording
        if (cameraRecorder && isRecordingActive) {
            cameraRecorder.stopRecording();
            isRecordingActive = false;
            recordingStatusElement.text('Not recording');
            
            // Remove the video element we created for recording
            const recordingVideo = document.getElementById('local-video-for-recording');
            if (recordingVideo) {
                recordingVideo.srcObject = null;
                recordingVideo.remove();
            }
        }
        
        // Stop the VideoSDK
        if (videoSDK) {
            videoSDK.meeting.leave();
            videoSDK = null;
        }
        
        // Stop speech recognition
        if (recognition) {
            recognition.stop();
        }
        
        // Clear the duration interval
        if (durationInterval) {
            clearInterval(durationInterval);
            durationInterval = null;
        }
        
        // Reset UI
        startClassBtn.prop('disabled', false);
        disableControls();
        classIdElement.text('Not started');
        participantCount = 0;
        studentsCountElement.text('0');
        participantsList.empty();
        translationStatus.text('Not Started').removeClass('active');
        
        // Clear the transcription
        currentTranscript = "";
        transcriptionText.html('<p>Transcription will appear here when you start speaking...</p>');
    }
    
    // Update the class duration display
    function updateDuration() {
        if (!classStartTime) return;
        
        const now = new Date();
        const diff = now - classStartTime;
        
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        const formattedTime = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
        
        classDurationElement.text(formattedTime);
    }
    
    // Event listeners
    startClassBtn.on('click', startClass);
    
    // Discipline popup event listeners
    $('#accept-discipline').on('click', function() {
        startClassAfterAcceptance();
    });
    
    $('.close').on('click', function() {
        hideDisciplinePopup();
    });
    
    // Close modal when clicking outside of it
    $(window).on('click', function(event) {
        if ($(event.target).is('#discipline-modal')) {
            hideDisciplinePopup();
        }
    });
    
    endClassBtn.on('click', function() {
        if (confirm('Are you sure you want to end the class?')) {
            endClass();
        }
    });
    
    toggleMicBtn.on('click', function() {
        if (videoSDK && videoSDK.meeting) {
            if (videoSDK.meeting.micEnabled) {
                videoSDK.meeting.disableMic();
            } else {
                videoSDK.meeting.enableMic();
            }
        }
    });
    
    toggleCameraBtn.on('click', function() {
        if (videoSDK && videoSDK.meeting) {
            if (videoSDK.meeting.webcamEnabled) {
                videoSDK.meeting.disableWebcam();
            } else {
                videoSDK.meeting.enableWebcam();
            }
        }
    });
    
    // Screen sharing disabled for security reasons
    // shareScreenBtn.on('click', function() {
    //     if (videoSDK && videoSDK.meeting) {
    //         videoSDK.meeting.toggleScreenShare();
    //     }
    // });
    
    sourceLanguageSelect.on('change', function() {
        if (recognition) {
            const wasRunning = isClassStarted;
            if (wasRunning) {
                recognition.stop();
            }
            
            recognition.lang = $(this).val();
            
            if (wasRunning) {
                setTimeout(() => recognition.start(), 200);
            }
        }
    });
});