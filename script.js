/* Global Variables */
let songsData = []; // Will hold the 100 songs from the JSON
let currentSongIndex = 0;
let score = 0;
let currentAudio = null;

/* Switch pages and Start Game */
document.getElementById("startBtn").onclick = function () {
  document.getElementById("startPage").style.display = "none";
  document.getElementById("levelPage").style.display = "block";

  /* Fetch the 100 songs JSON file */
  fetch('songs.json')
    .then(response => response.json())
    .then(data => {
      // Shuffle the array so the game is in a random order every time!
      songsData = data.sort(() => Math.random() - 0.5);
      loadSong(); // Load the first song
    })
    .catch(err => {
      console.error(err);
      document.getElementById("emoji").innerText = "❌ Error loading songs.json";
    });
};

/* Function to load a song to the screen */
function loadSong() {
  if (currentSongIndex < songsData.length) {
    let song = songsData[currentSongIndex];
    
    /* Safely update the heading, no matter what ID you used! */
    let headingElement = document.getElementById("songHeading") || document.getElementById("levelIndicator");
    if (headingElement) {
      headingElement.innerText = "Song " + (currentSongIndex + 1);
    }
    
    // Display the emojis
    document.getElementById("emoji").innerText = song.emojis || song.emoji;
    
    // Clear inputs and previous results
    document.getElementById("textAnswer").value = "";
    document.getElementById("result").innerText = "";
    
    // Clear hint display
    let hintDisplay = document.getElementById("hintDisplay");
    if (hintDisplay) hintDisplay.innerText = "";
    
  } else {
    /* Game Over State */
    document.getElementById("emoji").innerText = "🎉";
    document.getElementById("result").innerText = "Game Over! Your Score: " + score + " / " + songsData.length;
    document.getElementById("result").style.color = "black";
    
    // Hide the input box and buttons since the game is done
    let answerBox = document.getElementById("answerBox");
    if (answerBox) answerBox.style.display = "none";
    
    let headingElement = document.getElementById("songHeading") || document.getElementById("levelIndicator");
    if (headingElement) headingElement.innerText = "Finished!"; 
  }
}


/* Submit answer */
document.getElementById("checkBtn").onclick = function() {
  // Prevent clicking again if they already got it right and are waiting for the next song
  if (document.getElementById("result").innerText.includes("Correct")) return;

  let typed = document.getElementById("textAnswer").value.toLowerCase().trim();
  let song = songsData[currentSongIndex];
  
  // Use 'title' from the JSON, or fallback to 'answer' from your original code
  let correctAnswer = (song.title || song.answer).toLowerCase();

  /* Check answer (Includes logic allows partial matches!) */
  if (typed !== "" && correctAnswer.includes(typed)) {
    score++;
    document.getElementById("result").innerText = "✅ Correct! Score: " + score;
    document.getElementById("result").style.color = "green";

    /* Play chorus if audio exists in the database for this song */
    if (song.audio) {
      currentAudio = new Audio(song.audio);
      currentAudio.play();
      
      /* Move to next song AFTER audio finishes */
      currentAudio.onended = function() {
        nextSong();
      };
    } else {
      /* If there is no audio file, move to next song after 1.5 seconds */
      setTimeout(nextSong, 1500);
    }
  } else {
    // If wrong, tell them to try again
    document.getElementById("result").innerText = "❌ Wrong! Try again or use a hint.";
    document.getElementById("result").style.color = "red";
    
    // THE NEW PART: Add the 'shake' class to the input box
    let inputBox = document.getElementById("textAnswer");
    inputBox.classList.add("shake");
    
    // Remove the shake class after 400ms so it can shake again next time!
    setTimeout(() => {
      inputBox.classList.remove("shake");
    }, 400);
  }
};

/* Function to go to next song */
function nextSong() {
  // Stop audio if they hit "Skip" while it was playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentSongIndex++;
  loadSong();
}

/* --- NEW FEATURES: HINTS AND SKIPS --- */

/* Hint Button Logic */
let hintBtn = document.getElementById("hintBtn");
if (hintBtn) {
  hintBtn.onclick = function() {
    let song = songsData[currentSongIndex];
    if (song.movie) {
      document.getElementById("hintDisplay").innerText = "Hint: From the movie '" + song.movie + "'";
    } else {
      document.getElementById("hintDisplay").innerText = "No hint available for this song!";
    }
  };
}

/* Skip Button Logic */
let skipBtn = document.getElementById("skipBtn");
if (skipBtn) {
  skipBtn.onclick = function() {
    document.getElementById("result").innerText = "⏭️ Skipping...";
    document.getElementById("result").style.color = "orange";
    setTimeout(nextSong, 500); // Small delay so they see the skip message
  };
}
/* --- NEW FEATURE: VOICE RECOGNITION --- */
const micBtn = document.getElementById("micBtn");

// Check if the browser supports the Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  
  // 'en-IN' helps the browser understand Indian accents and romanized Hindi words better!
  recognition.lang = 'en-IN'; 

  // When the user clicks the mic button
  micBtn.onclick = function() {
    micBtn.innerText = "🎙️ Listening...";
    micBtn.classList.add("pulse"); 
    recognition.start(); // Turn on the mic
  };

  // When the browser successfully translates the voice to text
  recognition.onresult = function(event) {
    // Get the words the user spoke
    const transcript = event.results[0][0].transcript;
    
    // Put those words into the text box
    document.getElementById("textAnswer").value = transcript;
    
    // Reset the mic button's look
    micBtn.innerText = "🎤 Speak Answer";
    micBtn.classList.remove("pulse");
    
    // Automatically trigger the Check Answer button!
    document.getElementById("checkBtn").click(); 
  };

  // If something goes wrong (like they denied mic permissions)
  recognition.onerror = function(event) {
    console.error("Speech recognition error", event.error);
    micBtn.innerText = "🎤 Speak Answer";
    micBtn.classList.remove("pulse");
    alert("Microphone error. Please make sure you allow microphone permissions in your browser!");
  };
} else {
  // If they are on an old browser that doesn't support voice, hide the button
  if (micBtn) micBtn.style.display = "none";
  console.warn("Voice Recognition is not supported in this browser.");
}