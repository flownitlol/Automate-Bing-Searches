// const extpay = ExtPay('automate-your-bing-searches');
const extpay = ExtPay('automate-your-bing-searches-lifetime-access');

const search = document.getElementById("search");
const stop = document.getElementById("stop");
const stopQuizzes = document.getElementById("stopQuizzes");
const count = document.getElementById("count");
const searchesLeftBox = document.getElementById("searches-left");
const amazonSelector = document.getElementById("amazon-selector");
const amazonInfo = document.getElementById("amazon-info");
const hiddenAmazon = document.getElementById("hiddenAmazon");
const minDelay = document.getElementById("minDelay");
const maxDelay = document.getElementById("maxDelay");
const mobile = document.getElementById("mobile");
const delayInfo = document.getElementById("delay-info");
const maxDelayWarning = document.getElementById("maxDelayWarning");
const belowZeroDelayWarning = document.getElementById("belowZeroDelayWarning");
const belowRecommendedDelayWarning = document.getElementById("belowRecommendedDelayWarning");
const closeTabSelector = document.getElementById("close-tab-selector");
const schedulePopup = document.getElementById("schedulePopup");
// const extensionFuture = document.getElementById("extensionFuture");
// const mobilePopup = document.getElementById("mobilePopup");
const quizzes = document.getElementById("quizzes");

const subscribe = document.getElementById("subscribe");
const freeTrialReload = document.getElementById("free-trial-reload");
const premiumAccessReload = document.getElementById("premium-access-reload");

const problems = document.getElementById("problems");
const warningButton = document.getElementById("warningButton");

const startActivitiesAfterSelector = document.getElementById("start-activities-after-selector");

// chrome.storage.sync.set({ "acceptedWarning": false });

var trialLength;
var legacyUser;

chrome.storage.sync.get("legacyUser", function (result) {
    legacyUser = result.legacyUser;
    if (legacyUser) {
        trialLength = 60;
    } else {
        trialLength = 30;
    }
});

async function checkFreeTrial(user, freeTrialTime, now) {
    var startDate = new Date(user.trialStartedAt);
    var endDate = new Date(startDate.getTime() + (trialLength * 24 * 60 * 60 * 1000));
    var timeDifference = endDate - startDate;
    var daysBetween = Math.ceil(timeDifference / (1000 * 3600 * 24));
    if (daysBetween -  Math.round((now - startDate) / 1000 / 60 / 60 / 24) === 1) {
        var hoursRemaining = (freeTrialTime - (now - user.trialStartedAt)) / 3600000;
        var hoursRemainingRounded = Math.round(hoursRemaining);
        if (hoursRemaining < 1) {
            subscribe.innerHTML = `free trial expires in ${Math.round(hoursRemaining * 60)} minutes`;
        } else {
            if (hoursRemainingRounded === 1) {
                subscribe.innerHTML = `free trial expires in under ${hoursRemainingRounded} hour`;
            } else {
                subscribe.innerHTML = `free trial expires in under ${hoursRemainingRounded} hours`;
            }
        }
    } else {
        subscribe.innerHTML = `free trial expires in ${daysBetween - Math.round((now - startDate) / 1000 / 60 / 60 / 24)} days`;
    }
}





extpay.getUser().then(user => {
    // console.log(user);
    const now = new Date();
    var freeTrialTime = 1000 * 60 * 60 * 24 * trialLength;
    var freeTrial = false; 
    
    // if (!user.paid) {
    if (false) {
        if (user.trialStartedAt && (now - user.trialStartedAt) < freeTrialTime) { 
            // user is in free trial
            freeTrial = true;
            checkFreeTrial(user, freeTrialTime, now).then(function () {
                document.getElementById('subscribe').addEventListener('click', function() {
                    extpay.openPaymentPage();
                    premiumAccessReload.classList.remove("hidden");
                });
                subscribe.classList.remove("hidden");
            });
        } else if (user.trialStartedAt === null && user.paidAt === null) {
            subscribe.innerHTML = "login or start a free trial to unlock premium features <img class='icon' src='new-window.png' alt='popup window icon'>";
            subscribe.classList.remove("hidden");
            document.getElementById('subscribe').addEventListener('click', function () {
                extpay.openTrialPage(`${trialLength}-day`);
                freeTrialReload.classList.remove("hidden");
            });
        } else if (user.subscriptionStatus === "past_due") {
            subscribe.innerHTML = "payment is past due <img class='icon' src='new-window.png' alt='popup window icon'>";
            subscribe.classList.remove("hidden");
            document.getElementById('subscribe').addEventListener('click', function() {
                premiumAccessReload.classList.remove("hidden");
                extpay.openPaymentPage();
            }
            );
        } else if (user.subscriptionStatus === "unpaid") {
            subscribe.innerHTML = "payment was not received <img class='icon' src='new-window.png' alt='popup window icon'>";
            subscribe.classList.remove("hidden");
            document.getElementById('subscribe').addEventListener('click', function() {
                premiumAccessReload.classList.remove("hidden");
                extpay.openPaymentPage();
            }
            );
        } else {
            subscribe.innerHTML = "login or purchase premium to unlock premium features <img class='icon' src='new-window.png' alt='popup window icon'>";

            subscribe.classList.remove("hidden");
            document.getElementById('subscribe').addEventListener('click', function() {
                premiumAccessReload.classList.remove("hidden");
                extpay.openPaymentPage();
            }
            );

        }
        if (!freeTrial) {
            const elements = document.querySelectorAll('.ribbon');
            elements.forEach(element => {
    
                if (element.classList.contains("legacy")) {
                    if (!legacyUser) {
                        element.classList.remove('hidden');
                        element.addEventListener("click", function() {
                            if (user.trialStartedAt === null) {
                                freeTrialReload.classList.remove("hidden");
                                extpay.openTrialPage(`${trialLength}-day`);
                            } else {
                                extpay.openPaymentPage();
                                premiumAccessReload.classList.remove("hidden");
                            }    
                        });
                    }
                } else {
                    element.classList.remove('hidden');
                    element.addEventListener("click", function() {
                        if (user.trialStartedAt === null) {
                            freeTrialReload.classList.remove("hidden");
                            extpay.openTrialPage(`${trialLength}-day`);
                        } else {
                            extpay.openPaymentPage();
                            premiumAccessReload.classList.remove("hidden");
                        }    
                    });
                }
    
            });
            if (!legacyUser) {
                mobile.disabled = true;
                chrome.storage.sync.set({ mobile: 0 });
                mobile.value = 0;
            }
            quizzes.disabled = true;
        }
       

    } 
    else {
    //     subscribe.innerHTML = "manage subscription";
        if (user.paid) {
            chrome.storage.sync.set({"paidUser": true});
        }
        subscribe.classList.add("hidden");
    //     document.getElementById('subscribe').addEventListener('click', extpay.openLoginPage);
    }
}).catch(err => {
    console.log(err);
    // document.querySelector('p').innerHTML = "Error fetching data :( Check that your ExtensionPay id is correct and you're connected to the internet"
})


// import('./words.js')
//   .then((module) => {
//     wordsList = module.words;
// });

chrome.storage.sync.get("count", function (result) {
    if (result.count != undefined) {
        count.value = result.count;
    }
});

chrome.storage.sync.get("mobile", function (result) {
    if (result.mobile != undefined) {
        mobile.value = result.mobile;
    }
});

chrome.storage.sync.get("minDelay", function (result) {
    if (result.minDelay != undefined) {
        minDelay.value = result.minDelay;
    }
});

chrome.storage.sync.get("maxDelay", function (result) {
    if (result.maxDelay != undefined) {
        maxDelay.value = result.maxDelay;
    }
});

chrome.storage.sync.get("amazon", function (result) {
    if (result.amazon != undefined) {
        amazonSelector.checked = result.amazon;
    }
});

chrome.storage.sync.get("acceptedWarning", function (result) {
    if (!result.acceptedWarning === true) {
        document.getElementById("firstTimeWarning").hidden = false;
    }
});

chrome.storage.sync.get("searchRunning", function (result) {
    if (result.searchRunning) {
        search.classList.add("hidden");
        stop.classList.remove("hidden");
    } else if (!result.searchRunning) {
        search.classList.remove("hidden");
        stop.classList.add("hidden");
    }
});

chrome.storage.sync.get("performingQuizzes", function(result) {
    if (result.performingQuizzes) {
        quizzes.classList.add("hidden");
        stopQuizzes.classList.remove("hidden");
    } else {
        quizzes.classList.remove("hidden");
        stopQuizzes.classList.add("hidden");
    }
});

chrome.storage.sync.set({ "requestStop": false });

chrome.storage.sync.get("searchesLeft", function (result) {
    // If there are no searches left,
    if (result.searchesLeft === 0) {
        // Clear the badge text
        chrome.action.setBadgeText({ text: "" });
        // Set the icon path to the default icon
        chrome.action.setIcon({ path: "/images/icon16.png" });
        // Set the "review" value in storage to "do not show review"
        chrome.storage.sync.set({ "review": "do not show review" });

        // Otherwise, if there are searches left and the number of searches left does not match the current count value plus the mobile value,    
    } else if (result.searchesLeft > 0 && result.searchesLeft != parseInt(count.value) + parseInt(mobile.value)) {
        // console.log(result.searchesLeft);
        // console.log(parseInt(count.value) + parseInt(mobile.value));
        // Get the current badge text and store it in a variable
        chrome.action.getBadgeText({}, function (result) {
            // Update the searches left box with the current number of searches left
            searchesLeftBox.innerText = "Searches Left: " + result;
            // Remove the "hidden" class from the searches left box
            searchesLeftBox.classList.remove("hidden");
        });
    }
});

chrome.storage.sync.get("closeTab", function (result) {
    if (result.closeTab != undefined) {
        closeTabSelector.checked = result.closeTab;
    }
});

chrome.storage.sync.get("startActivitiesAfter", function (result) {
    if (result.startActivitiesAfter != undefined) {
        startActivitiesAfterSelector.checked = result.startActivitiesAfter;
    }
});

chrome.storage.sync.get("review", function (result) {
    if (result.review != undefined) {
        if (result.review === "show review") {
            randomizeReview();
        }
    }
});

// Add an event listener for the search button click event
search.addEventListener("click", function () {
    // Initialize a variable to track whether the search has started
    var searchStarted = false;
    search.classList.add("hidden");
    stop.classList.remove("hidden");
    searchesLeftBox.classList.remove("hidden");
    // var port = chrome.runtime.connect({name: "searchExtension"});
    // Update the searches left box with the current count value plus the mobile value
    searchesLeftBox.innerText = "Searches Left: " + count.value + mobile.value;
    // port.postMessage({message: "start", words: wordsList, count: count.value, mobile: mobile.value, minDelay: minDelay.value, maxDelay: maxDelay.value, amazonLink: amazonSelector.checked, closeTab: closeTabSelector.checked}, );
    // Send a message to the extension to start the search with the provided parameters
    chrome.runtime.sendMessage({ message: "start", count: count.value, mobile: mobile.value, minDelay: minDelay.value, maxDelay: maxDelay.value, amazonLink: amazonSelector.checked, closeTab: closeTabSelector.checked, startActivitiesAfter: startActivitiesAfterSelector.checked }, function (response) {
        // If a response is received, set the searchStarted variable to true
        if (response) {
            searchStarted = true;
            chrome.storage.sync.set({ "searchRunning": true });
        }
    });
    setTimeout(function () {
        // Set a timeout to check whether the search has started after 3 seconds
        if (!searchStarted) {
            // console.log("recieved no response - search was not started - we should reload extension");
            chrome.runtime.reload();
        }

    }, 3000);

});

stop.addEventListener("click", function () {
    // var port = chrome.runtime.connect({name: "searchExtension"});
    // port.postMessage({message: "stop"});
    chrome.runtime.sendMessage({ message: "stop" });
});

stopQuizzes.addEventListener("click", function() {
    chrome.storage.sync.set({performingQuizzes: false});
    chrome.runtime.sendMessage({message: "stop the quizzes"});
    quizzes.classList.remove("hidden");
    stopQuizzes.classList.add("hidden");
});

chrome.storage.onChanged.addListener(function (changes) {
    for (key in changes) {
        if (key === 'searchesLeft') {
            if (changes["searchesLeft"]["newValue"] === 0) {
                searchesLeftBox.innerText = "Searches Complete!";
                search.classList.remove("hidden");
                stop.classList.add("hidden");
                chrome.storage.sync.set({ "searchRunning": false });
                randomizeReview();
                chrome.storage.sync.set({ "review": "do not show review" });
            } else {
                searchesLeftBox.classList.remove("hidden");
                searchesLeftBox.innerText = "Searches Left: " + changes["searchesLeft"]["newValue"];
            }
        }
    }
});

amazonSelector.addEventListener("click", function () {
    chrome.storage.sync.set({ amazon: amazonSelector.checked });
});

count.addEventListener("change", function () {
    chrome.storage.sync.set({ count: count.value });
});

mobile.addEventListener("change", function () {
    chrome.storage.sync.set({ mobile: mobile.value })
});

minDelay.addEventListener("change", function () {
    if (minDelay.value < 0) {
        minDelay.classList.add("red-outline");
        belowZeroDelayWarning.classList.remove("hidden");
    } else if (minDelay.value < 1) {
        minDelay.classList.add("orange-outline");
        belowRecommendedDelayWarning.classList.remove("hidden");
        maxDelay.setAttribute("min", minDelay.value);
        chrome.storage.sync.set({ minDelay: minDelay.value });
    } else {
        minDelay.classList.remove("red-outline");
        minDelay.classList.remove("orange-outline");
        belowZeroDelayWarning.classList.add("hidden");
        belowRecommendedDelayWarning.classList.add("hidden");
        maxDelay.setAttribute("min", minDelay.value);
        chrome.storage.sync.set({ minDelay: minDelay.value })
    }
});

maxDelay.addEventListener("change", function () {
    maxDelay.setAttribute("min", minDelay.value);
    if (Number(maxDelay.value) < Number(minDelay.value)) {
        // console.log(maxDelay.value, minDelay.value);
        // console.log("invalid max delay");
        maxDelay.classList.add("red-outline");
        maxDelayWarning.classList.remove("hidden");
    } else {
        maxDelay.classList.remove("red-outline");
        maxDelayWarning.classList.add("hidden");
        chrome.storage.sync.set({ maxDelay: maxDelay.value })
    }
});

amazonInfo.addEventListener("click", function () {
    hiddenAmazon.classList.toggle("hidden");
    document.getElementById("amazon-dropdown").classList.toggle("flip-down");
    document.getElementById("amazon-dropdown").classList.toggle("flip-up");
});

delayInfo.addEventListener("click", function () {
    hiddenDelay.classList.toggle("hidden");
    document.getElementById("delay-dropdown").classList.toggle("flip-down");
    document.getElementById("delay-dropdown").classList.toggle("flip-up");
});

closeTabSelector.addEventListener("click", function () {
    chrome.storage.sync.set({ closeTab: closeTabSelector.checked });
});

startActivitiesAfterSelector.addEventListener("click", function () {
    chrome.storage.sync.set({ startActivitiesAfter: startActivitiesAfterSelector.checked });
});

// chrome.runtime.onConnect.addListener(function(port) {
//     port.onMessage.addListener(function(msg) {
//         if (msg.message === "stop"){
//             searchesLeftBox.innerText = "Searches Stopped!";
//         }
//   });
// });

schedulePopup.addEventListener("click", function () {
    chrome.windows.create({
        url: "schedule.html",
        type: "panel",
        width: 800,
        height: 525,
    });
});

// problems.addEventListener("click", function () {
//     chrome.windows.create({
//         url: "problems.html",
//         type: "panel",
//         width: 1050,
//         height: 430,
//     });
// });

quizzes.addEventListener("click", function () {
    chrome.storage.sync.set({"quizzesPaused": false});
    chrome.storage.sync.set({"removedActivities": []});
    chrome.storage.sync.set({"lastActivity": ""});
    chrome.runtime.sendMessage({ message: "start quizzes" });
    stopQuizzes.classList.remove("hidden");
    quizzes.classList.add("hidden");
});

// mobilePopup.addEventListener("click", function () {
//     chrome.windows.create({
//         url: "mobile-note.html",
//         type: "panel",
//         width: 800,
//         height: 525,
//     });
// });

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.message === "stop") {
        searchesLeftBox.innerText = "Searches Stopped!";
        search.classList.remove("hidden");
        stop.classList.add("hidden");
        chrome.storage.sync.set({ "searchRunning": false });
    }
});

function randomizeReview() {
    var odds = 0;
    chrome.storage.sync.get("clickedReview", function (result) {
        if (result.clickedReview === undefined || result.clickedReview != true) {
            odds = 25; // 1 in every X person will be shown the link to leave a review
        } else {
            odds = 150; // if they have clicked the review button, users will have a smaller chance of seeing it again
        }
        var randomNumber = Math.floor(Math.random() * odds);
        // console.log(randomNumber);
        if (randomNumber === 1) {
            review.classList.remove("hidden");
        }
    });

}

review.addEventListener("click", function () {
    chrome.storage.sync.set({ "clickedReview": true });
});

// chrome.storage.sync.remove(["clickedReview", "searchesCompleted"]); //resets the counter for searches completed and unchecks clicked review. Use this for testing to reset it

// users who have not clicked the link to a review will be prompted to leave a review every X amount of times
chrome.storage.sync.get("searchesCompleted", function (searchesResult) {
    // console.log(searchesResult.searchesCompleted);
    chrome.storage.sync.get("clickedReview", function (result) {
        if (result.clickedReview === undefined || result.clickedReview != true) {
            if (searchesResult.searchesCompleted != undefined && parseInt(searchesResult.searchesCompleted) % 45 === 0) { // unless they already clicked on review, they will be prompted every X times to leave one
                review.classList.remove("hidden");
            } else {
                review.classList.add("hidden");
            }
        }
    });
});

// chrome.runtime.onConnect.addListener(function(port) {
//     port.onMessage.addListener(function(msg) {
//         // console.log(msg.message);
//     });
// });

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // console.log(msg);
    sendResponse({ message: "all good" });
});

chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "quizzes are done") {
        stopQuizzes.classList.add("hidden");
        quizzes.classList.remove("hidden");
    }
});

warningButton.addEventListener("click", function() {
    document.getElementById("firstTimeWarning").classList.add("hiddenOverlay");
    chrome.storage.sync.set({"acceptedWarning": true});
});