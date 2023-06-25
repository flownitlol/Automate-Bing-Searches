const action = document.getElementById("action");
const specificTimeDiv = document.getElementById("specificTimeDiv");
const specificTime = document.getElementById("specificTime");
const minutesDiv = document.getElementById("minutesDiv");
const minutes = document.getElementById("minutes");
const setAlarm = document.getElementById("setAlarm");
const alarmButton = document.getElementById("alarmButton");
const alarmSuccess = document.getElementById("alarmSuccess");
const cancelSearches = document.getElementById("cancelSearches");
const cancelSuccess = document.getElementById("cancelSuccess");


document.addEventListener("click", function (event) {
    if (event.target.matches("#closeButton") || event.target.matches("#closeButtonDiv") || event.target.matches("#xButton")) {
        alarmSuccess.innerHTML = "";
    } else if (event.target.matches("#cancelButton") || event.target.matches("#cancelButtonDiv") || event.target.matches("#cancelText")) {
        cancelSuccess.innerHTML = "";
    }
});

chrome.storage.sync.get("specificTime", function (result) {
    if (result.specificTime != undefined) {
        specificTime.value = result.specificTime;
    }
});

chrome.storage.sync.get("minutes", function (result) {
    if (result.minutes != undefined) {
        minutes.value = result.minutes;
    }
})

chrome.storage.sync.get("alarmType", function (result) {
    if (result.alarmType === "specific time") {
        action.value = "specific time";
        specificTimeDiv.classList.remove("hidden");
        minutesDiv.classList.add("hidden");
        setAlarm.classList.remove("hidden");
        alarmSuccess.classList.add("hide");
        alarmSuccess.innerHTML = "";
        setAlarm.classList.remove("hidden");
    } else if (result.alarmType === "minutes") {
        action.value = "minutes";
        minutesDiv.classList.remove("hidden");
        specificTimeDiv.classList.add("hidden");
        alarmSuccess.classList.add("hide");
        alarmSuccess.innerHTML = "";
        setAlarm.classList.remove("hidden");
    }
});

action.addEventListener("change", function () {
    if (action.value === "specific time") {
        specificTimeDiv.classList.remove("hidden");
        minutesDiv.classList.add("hidden");
        setAlarm.classList.remove("hidden");
        alarmSuccess.classList.add("hide");
        alarmSuccess.innerHTML = "";
        setAlarm.classList.remove("hidden");
    } else if (action.value === "minutes") {
        minutesDiv.classList.remove("hidden");
        specificTimeDiv.classList.add("hidden");
        alarmSuccess.classList.add("hide");
        alarmSuccess.innerHTML = "";
        setAlarm.classList.remove("hidden");
    } else {
        minutesDiv.classList.add("hidden");
        specificTimeDiv.classList.add("hidden");
        alarmSuccess.classList.add("hide");
        alarmSuccess.innerHTML = "";
        setAlarm.classList.add("hidden");
    }
});

// specificTime.addEventListener("change", function () {
// });

minutes.addEventListener("change", function () {
    if (parseFloat(minutes.value) >= 0) {
        minutes.classList.remove("input-warning");
        minutes.classList.remove("red-outline");
    }
});

alarmButton.addEventListener("click", function () {
    if (parseFloat(minutes.value) < 0) {
        alarmSuccess.innerHTML = `<div class="alert alert-danger" id="closeButtonDiv" role="alert">
        Please set the minutes to be greater than 0! Your scheduled search has not been created.
        <button type="button" class="close btn close-btn close-btn-danger" id="closeButton" aria-label="Close">
        <span aria-hidden="true" id="xButton">&times;</span>
      </button>
        
        </div>`;
        minutes.classList.add("input-warning");
        minutes.classList.add("red-outline");
    } else if (!specificTimeDiv.classList.contains("hidden")) {
        // console.log(specificTime.value);
        chrome.storage.sync.set({ specificTime: specificTime.value });
        chrome.storage.sync.set({ alarmType: "specific time" });
        createAlarm(specificTime.value, "specific time");
        chrome.runtime.sendMessage({ message: "alarm specific time" });
        var time = convert24To12(specificTime.value);

        alarmSuccess.innerHTML = `<div class="alert alert-primary" id="closeButtonDiv" role="alert">
        <strong>Success!</strong> Your searches are scheduled to take place every day at ${time}. Note that the searches will only take place if your Chrome browser is open!
        <button type="button" class="close btn close-btn" id="closeButton" aria-label="Close">
        <span aria-hidden="true" id="xButton">&times;</span>
      </button>
        
        </div>`;
    } else if (!minutesDiv.classList.contains("hidden")) {
        // createAlarm(minutes.value, "minutes");
        // chrome.runtime.sendMessage({ message: "alarm minutes" });
        chrome.storage.sync.set({ alarmType: "minutes" });
        chrome.storage.sync.set({ minutes: minutes.value });

        alarmSuccess.innerHTML = `<div class="alert alert-primary" id="closeButtonDiv" role="alert">
      <strong>Success!</strong> Your searches will take place ${minutes.value} minutes after you open Chrome. Your searches will happen at most once per day.
      <button type="button" class="close btn close-btn" id="closeButton" aria-label="Close">
      <span aria-hidden="true" id="xButton">&times;</span>
    </button>
    </div>`;



    }

    alarmSuccess.classList.remove("hide");
});

cancelSearches.addEventListener("click", function () {
    chrome.storage.sync.set({ alarmType: "none" });
    chrome.alarms.clearAll();

    cancelSuccess.innerHTML = `<div class="alert alert-primary" id="cancelButtonDiv" role="alert">
  Your scheduled searches have successfully been cancelled.
  <button type="button" class="close btn close-btn" id="cancelButton" aria-label="Close">
  <span aria-hidden="true" id="cancelText">&times;</span>
</button>
</div>`;

    cancelSuccess.classList.remove("hidden");
});

chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.message === "an alarm triggered") {
        // console.log("schedule noticed that an alarm triggered. This should trigger a new search and create an alarm for tomorrow.");
        createAlarm(specificTime.value, "specific time");
        chrome.runtime.sendMessage({ message: "start from alarm" });
    }
});


function createAlarm(alarmTime, alarmType) {
    if (alarmType === "specific time") {
        // Get the current time
        const { hours, minutes } = convertTime(alarmTime);
        const now = new Date();
        // Set the alarm time to what the user set it to
        const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        // If it's past the time the user set, make the alarm for tomorrow
        if (alarmDate <= now) {
            alarmDate.setDate(alarmDate.getDate() + 1);
        }
        // console.log(alarmDate);
        // Create the alarm
        chrome.alarms.create("alarm", {
            when: alarmDate.getTime(),
            periodInMinutes: 1440 // Alarm will repeat every 1440 minutes, which is 24 hours
        });
    }

    // chrome.alarms.getAll(function (alarms) {
    //     for (const alarm of alarms) {
    //         const date = new Date(alarm.scheduledTime);
    //         console.log(date.toString());
    //     }
    // });
}

function convertTime(time) {
    const parts = time.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    return { hours, minutes };
}

function convert24To12(time) {
    const hours = parseInt(time.substr(0, 2));
    const minutes = time.substr(3, 2);
    return (hours % 12 || 12) + ":" + minutes + (hours >= 12 ? " PM" : " AM");
}
