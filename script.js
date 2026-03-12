/* Switch pages */

document.getElementById("startBtn").onclick = function () {

document.getElementById("startPage").style.display = "none";
document.getElementById("levelPage").style.display = "block";

}

/* SONG DATA */

const songs = [

{emoji:"🙋🏻‍♀️🫵🏻👫", answer:"main tera bf", audio:"chorus/tera-bf.mp3"},
{emoji:"7️⃣⛵🏖️", answer:"saath samundar", audio:"chorus/sath-samundar.mp3"},
{emoji:"🟦👀", answer:"blue eyes", audio:"chorus/blue-eyes.mp3"},
{emoji:"💵💵", answer:"paisa paisa", audio:"chorus/paisa-paisa.mp3"},
{emoji:"🍋🍋", answer:"nimbuda nimbuda", audio:"chorus/nimbu.mp3"},

{emoji:"🔫🙋🏻‍♀️💃🏻", answer:"bandook meri laila", audio:"chorus/bandook.mp3"},
{emoji:"🚶🏻‍♀️🕘🕛", answer:"chalti hai kya 9 se 12", audio:"chorus/9sebarah.mp3"},
{emoji:"🌕🫣🌥️", answer:"chand chupa badal mei", audio:"chorus/chandchupa.mp3"},
{emoji:"🦛🌻", answer:"genda fool", audio:"chorus/gendafool.mp3"},
{emoji:"❤️🙅🏻🪔", answer:"dil na diya", audio:"chorus/dilnadiya.mp3"},

{emoji:"1️⃣👀🪄🔮", answer:"paheli nazar mei aesa jadu kar diya", audio:"chorus/pahelnazar.mp3"},
{emoji:"🙋🏻‍♀️👀🫵🏻📷", answer:"main dekhu teri photo", audio:"chorus/teriphoto.mp3"},
{emoji:"🛣️👠", answer:"high heels", audio:"chorus/highheels.mp3"},
{emoji:"❤️🙋🏻‍♀️🏌🏻‍♂️🏌🏻‍♂️", answer:"love mera hit hit", audio:"chorus/hithit.mp3"},
{emoji:"🗣️❤️🙋🏻‍♀️", answer:"kaho na pyaar hai", audio:"chorus/kahonapyaarhai.mp3"},

];

let currentSong = 0;
let score = 0;

/* Show first emoji */

document.getElementById("emoji").innerText = songs[currentSong].emoji;

/* Submit answer */

document.getElementById("checkBtn").onclick = function(){

let typed = document.getElementById("textAnswer").value.toLowerCase().trim();
let correctAnswer = songs[currentSong].answer;

/* Check answer */

if(typed.includes(correctAnswer)){

score++;

document.getElementById("result").innerText = "✅ Correct";

/* Play chorus */

let audio = new Audio(songs[currentSong].audio);
audio.play();

/* Move to next song AFTER audio finishes */

audio.onended = function(){
nextSong();
};

}else{

document.getElementById("result").innerText = "❌ Wrong";

/* Move to next song after 2 seconds if wrong */

setTimeout(nextSong,2000);

}

};

/* Function to go to next song */

function nextSong(){

currentSong++;

document.getElementById("textAnswer").value = "";

if(currentSong < songs.length){

document.getElementById("emoji").innerText = songs[currentSong].emoji;
document.getElementById("result").innerText = "";

}else{

document.getElementById("emoji").innerText = "🎉";
document.getElementById("result").innerText =
"Game Over! Your Score: " + score + " / " + songs.length;

}

}