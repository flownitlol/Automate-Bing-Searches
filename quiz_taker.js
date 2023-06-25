// quizTaker();
var tab;
var requestStop = false;
var lastActivity = {};
var removedActivities = [];

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "begin quizzes") {
            // console.log("told to start quizzes");
            quizTaker();
        } else if (request.message === "stop the quizzes") {
            requestStop = true;
        }
    }
);



chrome.storage.onChanged.addListener(function (changes) {
    for (key in changes) {
        if (key === 'searchRunning') {
            if (!changes["searchRunning"]["newValue"]) {
                chrome.storage.sync.get("quizzesPaused", function (result) {
                    // console.log(`quizzesPaused: ${result.quizzesPaused}`);
                    if (result.quizzesPaused) {
                        // console.log("searches have stopped and quizzes were paused. Let's resume them now")
                        chrome.storage.sync.set({ "performingQuizzes": true });
                        location.reload();
                    }
                });
            }
        }
    }
});


// // // AYBS QUIZZES
function quizTaker() {
    if (!requestStop) {
        chrome.storage.sync.get("lastActivity", function (result) {
            lastActivity = result.lastActivity;
        });
        chrome.storage.sync.get("removedActivities", function (result) {
            removedActivities = result.removedActivities;
        });

        chrome.storage.sync.get("performingQuizzes", function (result) {
            if (result.performingQuizzes) {
                setTimeout(function () {
                    let quizMenu = document.getElementById("id_rh");
                    try {
                        if (quizMenu.getAttribute("aria-expanded") !== "true") {
                            quizMenu.click();
                        } else {
                            // console.log("already performing quiz or menu is already open");
                        }
                    } catch (err) {
                        // console.log(err);
                        // alert("Your automated daily activities has been paused because you are currently performing mobile searches. Your activities will finish when your mobile searches are done!");
                        document.title = "❗ Activities paused until mobile searches are finished"
                        chrome.storage.sync.set({ "performingQuizzes": false });
                        chrome.storage.sync.set({ "quizzesPaused": true });
                        // console.log("quizzes were paused due to an error, let's unpause them")
                        return;
                    }



                    setTimeout(function () {
                        let iframe = document.getElementById('bepfm');
                        let innerDoc = iframe.contentDocument || iframe.contentWindow.document;

                        //CLICK ON FIRST NOT-COMPLETED ELEMENT IN THE POPUP
                        //doesn't click tasks that opens a new tab on click, such as Microsoft Store ads
                        let task = null;
                        innerDoc.querySelectorAll('div[class="point_cont"]:not([class="complete"])').forEach(function (possibleTask) {
                            if (removedActivities.length > 0) {
                                removedActivities.forEach(function (removedActivity) {
                                    if (removedActivity != possibleTask.parentElement.parentElement.innerText) {
                                        task = possibleTask;
                                        return;
                                    }
                                    // else {
                                    //     // console.log("possible task is in the list of banned activities");
                                    // }
                                });
                            } else {
                                // console.log("removed activities list is empty, so the task is good to go")
                                task = possibleTask;
                                return;
                            }

                        });
                        // let task = innerDoc.querySelector('div[class="point_cont"]:not([class="complete"]):not([class="removedActivity"])');
                        // console.log(task);
                        // IF NO TASK IS PRESENT, THEN CLICK ARROW UP TO SWITCH TASK PAGE
                        if (task === null) {
                            // console.log("no task was present in upper cabinet. Let's check the lower");
                            setTimeout(function () {
                                innerDoc.querySelector('svg[class="rw-si chevronUp"]').closest('div').click();
                                innerDoc.querySelectorAll('div[class="point_cont"]:not([class="complete"])').forEach(function (possibleTask) {
                                    if (removedActivities.length > 0) {
                                        removedActivities.forEach(function (removedActivity) {
                                            if (removedActivity != possibleTask.parentElement.parentElement.innerText) {
                                                task = possibleTask;
                                                return;
                                            }
                                            else {
                                                console.log("possible task is in the list of banned activities");
                                            }
                                        });
                                    } else {
                                        task = possibleTask;
                                        return;
                                    }

                                });
                            }, 2000);

                            // setTimeout(function() {
                            //     task = innerDoc.querySelector('div[class="point_cont"]:not([class="complete"])');      
                            // }, 1000);

                        }
                        setTimeout(function () {
                            if (task !== null) {
                                if (lastActivity[task.parentElement.parentElement.innerText] > 3) {
                                    // console.log("added task to the removed tasks list")
                                    removedActivities.push(task.parentElement.parentElement.innerText);
                                    // console.log(removedActivities);
                                    chrome.storage.sync.set({ "removedActivities": removedActivities });
                                    setTimeout(function () {
                                        callQuizTaker();
                                    }, 1000)
                                } else {
                                    chrome.storage.sync.set({ "lastActivity": { [task.parentElement.parentElement.innerText]: (lastActivity[task.parentElement.parentElement.innerText] || 0) + 1 } });
                                    task.click();
                                    setTimeout(function () {
                                        callQuizTaker();
                                    }, 5000)
                                }

                            } else {
                                // no tasks left to complete
                                setTimeout(function () {
                                    chrome.storage.sync.set({ "performingQuizzes": false });
                                    chrome.storage.sync.set({ "quizzesPaused": false });
                                    chrome.runtime.sendMessage({ message: "quizzes are done" });

                                    console.log("all tasks completed");
                                    quizMenu.click();
                                }, 6000);

                            }

                        }, 4000)
                    }, 1000)


                }, 1000);
            }
            // else {
            //     console.log(result.performingQuizzes);
            //     console.log("wanted to check for quizzes but we arent doin that rn");
            // }
        });
    } else {
        chrome.storage.sync.set({ "performingQuizzes": false });
        chrome.storage.sync.set({ "quizzesPaused": false });
    }





}

function checkWindowEvents() {
    var noItemFound = true;

    // console.log("window content loaded");
    chrome.storage.sync.get("performingQuizzes", function (result) {
        // check to make sure we should be doing searches or not
        if (result.performingQuizzes) {
            // console.log("we should be performing a quiz, let's see what's there");
            if (document.getElementById("rqStartQuiz")) {
                noItemFound = false;
                // console.log("saw start quiz button and clicking it");
                document.getElementById("rqStartQuiz").click();
            }
            // quiz with 1 correct answer with space in class title
            if (document.querySelector('input[class="rqOption "]:not([class="optionDisable"])')) {
                noItemFound = false;
                // console.log("should be able to click this")
                let optionChoices = document.querySelectorAll('input[class="rqOption "]:not([class="optionDisable"])');
                const randomElement = optionChoices[Math.floor(Math.random() * optionChoices.length)];
                // console.log("saw one answer quiz and clicking and option");
                setTimeout(function () {
                    randomElement.click();
                    callQuizTaker();
                }, 750);
            }

            // quiz with 1 correct answer with no space in class title
            if (document.querySelector('input[class="rqOption"]:not([class="optionDisable"])')) {
                noItemFound = false;
                // console.log("should be able to click this")
                let optionChoices = document.querySelectorAll('input[class="rqOption"]:not([class="optionDisable"])');
                const randomElement = optionChoices[Math.floor(Math.random() * optionChoices.length)];
                // console.log("saw one answer quiz and clicking and option");
                setTimeout(function () {
                    randomElement.click();
                    callQuizTaker();
                }, 750);
            }

            // opinion poll, no correct answer
            if (document.querySelector('div[class="bt_PollRadio"]')) {
                noItemFound = false;
                let pollChoices = document.querySelectorAll('div[class="bt_PollRadio"]');
                const randomPoll = pollChoices[Math.floor(Math.random() * pollChoices.length)];
                // console.log("saw poll quiz and clicking it");
                setTimeout(function () {
                    randomPoll.click();
                    callQuizTaker();
                }, 750);
            }
            // pick 5 correct answers quiz
            if (document.querySelectorAll('div[class="btOptions"] > div[class="slide"] > div[iscorrectoption="True"]').length > 0) {
                // console.log("saw 5 answer quiz but waiting to start it");
                // console.log("starting logic for 5 answer quiz");
                noItemFound = false;
                let quizCorrectAnswers = document.querySelectorAll('div[class="btOptions"] > div[class="slide"] > div[iscorrectoption="True"]');
                //GET CORRECT ANSWERS COUNT
                let correctAnswersCount = document.querySelector('span[id="bt_corOpCnt"]');
                //IF CORRECT ANSWERS COUNT IS NOT NULL THEN START MULTI-CORRECT-ANSWERS QUIZ, ELSE START ONE-CORRECT-ANSWER QUIZ
                if (null !== correctAnswersCount) {
                    //IF ALL 5 CORRECT ANSWER ARE CLICKED THEN SELECT 4TH ANSWER (NOT CLICKED YET) TO TRIGGER NEXT SET, ELSE SELECT NEXT CORRECT ANSWER
                    let indexOfAnswerToSelect = correctAnswersCount.innerText === "5" ? 4 : +correctAnswersCount.innerText;

                    //CLICK ON SELECTED CORRECT ANSWER
                    setTimeout(function () {
                        quizCorrectAnswers[indexOfAnswerToSelect].click();
                    }, 1000);
                    //DELAY OFFERS A LAYER OF PROTECTION, BUT SHOULDN'T BE NEEDED SINCE PAGES RELOAD WHEN CLICKING CORRECT ANSWER
                } else {
                    //SELECT CORRECT ANSWER
                    let correctAnswer = document.querySelector('input[class="rqOption"]:not([class="optionDisable"])');
                    //IF CORRECT ANSWER IS PRESENT THEN EXECUTE LOGIC, ELSE END BONUS QUIZ
                    if (null !== correctAnswer) {
                        //CLICK CORRECT ANSWER AND WAIT
                        setTimeout(function () {

                            correctAnswer.click();
                        }, 1000)

                        //CLICK CORRECT ANSWER AGAIN TO TRIGGER NEXT SET (OR END LAST SET SO THERE IS NO CORRECT ANSWER ON NEXT ITERATION)
                        setTimeout(function () {
                            correctAnswer.click();
                        }, 2000)
                    }
                }
            }

            // this or that quiz, currently only picks a random option
            if (document.querySelector('div[class="btOptions"] > div[class="btOptionCard"] > div[class="btOptionText"]')) {
                noItemFound = false;
                setTimeout(function () {
                    // console.log("this or that quiz")
                    let choices = document.querySelectorAll('div[class="btOptions"] > div[class="btOptionCard"] > div[class="btOptionText"]');
                    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
                    // console.log("saw poll quiz and clicking it");
                    setTimeout(function () {
                        randomChoice.click();
                        callQuizTaker();
                    }, 750);


                    document.querySelector('div[class="btOptions"] > div[class="btOptionCard"] > div[class="btOptionText"]').click();
                }, 1000)
            }


            // 10 question quiz, can click any answer
            if (document.querySelector('span[class="wk_Circle"]')) {
                // console.log("10 question quiz")
                let tenQuestionQuizOptions = document.querySelectorAll('span[class="wk_Circle"]');
                const randomAnswer = tenQuestionQuizOptions[Math.floor(Math.random() * tenQuestionQuizOptions.length)];
                setTimeout(function () {
                    randomAnswer.click();
                }, 750);
            }

            if (document.getElementById("skipPuzzle")) {
                // console.log("saw we are doing a puzzle");
                setTimeout(function () {
                    document.getElementById("skipPuzzle").click();
                }, 1000);
            }
            if (document.getElementById("quizCompleteContainer")) {
                // console.log("quiz is complete, calling quiz taker")
                callQuizTaker();
            }
            // console.log("looked through all elements");
            setTimeout(function () {
                if (noItemFound) {
                    // console.log("no actionable items to click, calling quiz taker");
                    callQuizTaker();
                }
            }, 1000);

        }
    });
}

window.addEventListener('load', function () {
    if (!requestStop) {
        this.setTimeout(function () {
            checkWindowEvents();
        }, 1000);
    }
});


function callQuizTaker() {
    // console.log("call quiztaker was called");
    setTimeout(function () {
        quizTaker();
    }, 1000);
}
