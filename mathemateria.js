var nextTask = document.getElementById('nextTask');
var answers = document.getElementById('answers');
var clear = document.getElementById('clear');
var btn1 = document.getElementById('b1');
var btn2 = document.getElementById('b2');
var btn3 = document.getElementById('b3');
var btn4 = document.getElementById('b4');
var btn5 = document.getElementById('b5');
var btn6 = document.getElementById('b6');
var btn7 = document.getElementById('b7');
var btn8 = document.getElementById('b8');
var btn9 = document.getElementById('b9');
var btn0 = document.getElementById('b0');
var equals = document.getElementById('equals');
var svgContainer = document.getElementById('svgContainer');
var exerciseSet;
var currentExerciseIndex;
var startTime = 0;
var sec = document.getElementById('secdiv');
var timerInterval;
var counter = 0;
var taskNumber = document.getElementById('taskNumber');

function displayAnswers(clicked) {
    var number = clicked.innerHTML;
    answers.innerHTML += number;
    answers.style.display = 'block';
    if (answers.innerHTML.length > 4) {
        answers.innerHTML = '';
    }
}

function removeAnswers(clearThis) {
    if (clear == clearThis) {

    }
}

function getExerciseCount() {
    return exerciseSet.exercises.length;
}

// Todo: Sjekke om svart på alle 10
//       I så fall, stoppe timer. Kalle server
function submitAnswer() {
    currentExerciseIndex++;
    answers.innerHTML = '';
    if (currentExerciseIndex > 10) {
        clearTimeout(timerInterval);
        svgContainer.style.display = 'none';
        equals.style.display = 'none';
        answers.style.display = 'none';
    }
    if (currentExerciseIndex == 1) {
        currentExerciseIndex = 2;
        taskNumber.innerText = currentExerciseIndex + ' ' + 'out of 10';
    } else taskNumber.innerText = currentExerciseIndex + ' ' + 'out of 10';

    if (currentExerciseIndex > 10) {
        taskNumber.style.display = 'none';
    }
    showExercise();
}

function showExercise() {
    var exercise = exerciseSet.exercises[currentExerciseIndex];
    svgContainer.innerHTML = '<svg width="' + exercise.width +
        '" height="' + exercise.height + '">' +
        '<path d="' + exercise.path + '"></path>' +
        '</svg>';
}

function currentTimeInMilliseconds() {
    return new Date().getTime();
}

function fetchExerciseSet() {
    //var html = '<script src="https://us-central1-fir-test-bb3be.cloudfunctions.net/createExerciseSet"></script>'; 
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute('src', 'https://us-central1-fir-test-bb3be.cloudfunctions.net/createExerciseSet');
    document.body.appendChild(scriptTag);
    //document.body.innerHTML += html;
    equals.style.display = 'block';
    svgContainer.style.display = 'block';
    answers.style.display = 'block';
    taskNumber.style.display = 'block';
    currentExerciseIndex = 1;
    taskNumber.innerText = currentExerciseIndex + ' ' + 'out of 10';
}

function recieveExerciseSet(exerciseSetFromServer) {
    exerciseSet = exerciseSetFromServer;
    //console.log(exerciseSet);
    startTime = currentTimeInMilliseconds();
    timerInterval = setInterval(secCounter, 100);
    sec.style.display = 'block';
    currentExerciseIndex = 0;
    showExercise();
}

function secCounter() {
    var millis = currentTimeInMilliseconds() - startTime;
    var seconds = Math.floor(millis / 1000);
    sec.innerText = " You have spent " + seconds + " seconds.";
}