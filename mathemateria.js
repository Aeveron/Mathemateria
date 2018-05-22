var nextTask = document.getElementById('nextTask');
var answers = document.getElementById('answers');
var clear = document.getElementById('clear');
var resultDiv = document.getElementById('resultDiv');
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
var buttonDiv = document.getElementById('buttonDiv');
var equals = document.getElementById('equals');
var svgContainer = document.getElementById('svgContainer');
var exerciseSet;
var currentExerciseIndex;
var firebaseAuthToken;
var startTime = 0;
var sec = document.getElementById('secdiv');
var timerInterval;
var counter = 0;
var taskNumber = document.getElementById('taskNumber');
var allAnswers = ''; // '16,81,35,27,4,9,12,8,49,48'
var yourAnswers = [];
var exerciseArray = [];

function displayAnswers(clicked) {
    var number = clicked.innerHTML;
    var txt = answers.innerHTML;
    answers.innerHTML += number;
    answers.style.display = 'block';
    if (sec.innerText == 0) {
        answers.style.display = 'none';
    }
    if (taskNumber.innerHTML === "Finished!") {
        answers.innerHTML = txt.substring(0, txt.length = 0);
        answers.style.display = 'none';
    }
    if (answers.innerHTML.length > 4) {
        var txt = answers.innerHTML;
        answers.innerHTML = txt.substring(0, txt.length = 4);
    }
}

function removeAnswers(clearThis) {
    var txt = answers.innerHTML;
    answers.innerHTML = txt.substring(0, txt.length - 1);
}

function getExerciseCount() {
    return exerciseSet.exercises.length;
}

// Todo: Sjekke om svart på alle 10
//       I så fall, stoppe timer. Kalle server

function submitAnswer() {
    var exerciseNo = currentExerciseIndex + 1;
    yourAnswers[currentExerciseIndex] = answers.innerHTML;
    currentExerciseIndex++;
    allAnswers += answers.innerHTML + ',';
    if (currentExerciseIndex > 0) {
        answers.innerHTML = '';
    }
    console.log(answers.innerHTML, allAnswers);
    answers.innerHTML = '';
    showExercise();
}


function showExercise() {
    var exerciseNo = currentExerciseIndex + 1;
    taskNumber.innerText = exerciseNo + ' out of ' + getExerciseCount();
    var exerciseCountVar = getExerciseCount();
    if (exerciseNo > getExerciseCount()) {
        taskNumber.innerHTML = 'Finished!';
        clearTimeout(timerInterval);
        answers.style.display = 'none';
        svgContainer.style.display = 'none';
        equals.style.display = 'none';
        clear.style.display = 'none';
        nextTask.style.display = 'none';
        buttonDiv.style.display = 'none';
        resultDiv.style.display = 'block';

        evaluateExerciseSet();

    } else {

        var exercise = exerciseSet.exercises[currentExerciseIndex];
        svgContainer.innerHTML = '<svg width="' + exercise.width +
            '" height="' + exercise.height + '">' +
            '<path d="' + exercise.path + '"></path>' +
            '</svg>';
        exerciseArray[currentExerciseIndex] = exercise;
    }
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
    nextTask.style.display = 'block';
    answers.style.display = 'block';
    taskNumber.style.display = 'block';
    clear.style.display = 'block';
    buttonDiv.style.display = 'block';
    resultDiv.innerHTML = '';
    resultDiv.style.display = 'none';
    answers.innerHTML = '';
    currentExerciseIndex = 0;
    //taskNumberP.style.display = 'none';
}

function recieveExerciseSet(exerciseSetFromServer) {
    exerciseSet = exerciseSetFromServer;
    console.log(exerciseSet);
    startTime = currentTimeInMilliseconds();
    timerInterval = setInterval(secCounter, 100);
    sec.style.display = 'block';
    currentExerciseIndex = 0;
    showExercise();
}

function secCounter() {
    var millis = currentTimeInMilliseconds() - startTime;
    var minutes = Math.floor(millis / 60000);
    var seconds = Math.floor(millis / 1000) - minutes * 60;
    sec.innerText = " You have spent " + seconds + " seconds.";
    if (minutes > 0) {
        sec.innerText = " You have spent " + ' ' + minutes + ' ' + 'minutes' + ' ' + 'and' + ' ' + seconds + " seconds.";
    }
}

function evaluateExerciseSet() {
    console.log("heihei");
    let paramsObj = {
        answers: '1,2,3,4,5,6,7,8,9,10',
        correctAnswersEncrypted: exerciseSet.correctAnswersEncrypted,
        timeStampEncrypted: exerciseSet.timeStampEncrypted
    };
    callServer('evaluateExerciseSet', paramsObj);
}

function callServer(functionName, paramsObj) {
    let scriptEl = document.createElement('script');
    let url = 'https://us-central1-fir-test-bb3be.cloudfunctions.net/' + functionName;
    let separator = '?';
    if (paramsObj) {
        for (var key in paramsObj) {
            let value = paramsObj[key];
            url += separator + key + '=' + value;
            separator = '&';
        }
    }
    console.log(url);
    scriptEl.setAttribute('src', url);
    document.body.appendChild(scriptEl);
    scriptEl.onload = function () {
        console.log(scriptEl.innerText);
    };
}

function verifyToken() {
    callServer('testAuth', { token: firebaseAuthToken });
}

function recieveVerification(verification) {
    console.log(verification);
}

function recieveEvaluation(evaluation) {
    var millis = currentTimeInMilliseconds() - startTime;
    var minutes = Math.floor(millis / 60000);
    var seconds = (millis / 1000) - minutes * 60;
    evaluation.exercises = ['7×8', '3×4', '9×9', '7×8', '3×4', '9×9', '7×8', '3×4', '9×9', '7×8'];
    console.log(evaluation);
    for (var i = 0; i < yourAnswers.length; i++) {
        console.log(yourAnswers[i]);
        console.log(evaluation.correctAnswers[i]);
        var thisTaskNumber = i + 1;
        if (yourAnswers[i] == evaluation.correctAnswers[i]) {
            resultDiv.innerHTML += thisTaskNumber + ' . ' + "<font color='green'>Correct!</font>" + ' ' + evaluation.exercises[i] + '  = ' + evaluation.correctAnswers[i] + '<br/>';

        } else {
            resultDiv.innerHTML += thisTaskNumber + ' . ' + '<strike>' + "<font color='#cc0000'>Wrong!</font>" + '</strike>' + ' ' + evaluation.exercises[i] +
                '  = ' + evaluation.correctAnswers[i] + '<br/>';
        }
        console.log(exerciseArray[i]);
    }
};

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        user.getIdToken(false).then((token) => {
            firebaseAuthToken = token;
            console.log(token);
        });
        document.getElementById('firebaseui-auth-container').style.display = 'none';
        document.getElementById('signOut').style.display = 'block';
    } else {
        console.log("signed out");
    }
});

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    //signInFlow: 'popup',
    signInSuccessUrl: '#',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
};
ui.start('#firebaseui-auth-container', uiConfig);