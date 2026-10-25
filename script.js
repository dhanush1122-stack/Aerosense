
const $ = (id) => document.getElementById(id);

const temperature = $("temperature");
const humidity = $("humidity");
const manualSpeed = $("manualSpeed");
const swingPosition = $("swingPosition");
const activityLog = $("activityLog");

let occupied = true;
let automaticMode = true;
let fanOn = true;
let currentSpeed = 2;

function speedName(speed) {
  return ({ 1: "Low", 2: "Medium", 3: "High" })[speed];
}

function logActivity(message, color = "#2879f6") {
  const item = document.createElement("li");
  item.className = "activity-item";

  const dot = document.createElement("span");
  dot.className = "activity-dot";
  dot.style.background = color;

  const time = document.createElement("time");
  time.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  const text = document.createElement("span");
  text.textContent = message;

  item.append(dot, time, text);
  activityLog.prepend(item);

  while (activityLog.children.length > 30) {
    activityLog.removeChild(activityLog.lastElementChild);
  }
}

function updateFan() {
  const temp = Number(temperature.value);
  const hum = Number(humidity.value);

  if (automaticMode) {
    fanOn = occupied;
    currentSpeed = temp < 25 ? 1 : temp <= 30 ? 2 : 3;
    manualSpeed.value = String(currentSpeed);
  }

  $("temperatureMetric").textContent = temp + "°C";
  $("temperatureLabel").textContent = temp + "°C";
  $("humidityMetric").textContent = hum + "%";
  $("humidityLabel").textContent = hum + "%";

  $("occupancyMetric").textContent = occupied ? "Detected" : "Empty";
  $("occupancyCaption").textContent = occupied
    ? "Person present in room"
    : "No person detected";

  $("modeMetric").textContent = automaticMode ? "Automatic" : "Manual";
  $("modeCaption").textContent = automaticMode
    ? "Adjusts based on conditions"
    : "User controls the fan";

  $("fanStatusText").textContent = fanOn ? "FAN ON" : "FAN OFF";
  $("fanStatus").classList.toggle("off-pill", !fanOn);

  const fan = $("fanIllustration");
  fan.classList.toggle("off", !fanOn);
  fan.classList.toggle("spinning", fanOn);
  fan.classList.remove("speed-low", "speed-high");

  if (fanOn && currentSpeed === 1) fan.classList.add("speed-low");
  if (fanOn && currentSpeed === 3) fan.classList.add("speed-high");

  $("speedDisplay").textContent = fanOn ? speedName(currentSpeed) : "Off";
  $("swingDisplay").textContent = swingPosition.value;

  $("occupiedBtn").classList.toggle("selected", occupied);
  $("emptyBtn").classList.toggle("selected", !occupied);
  $("autoBtn").classList.toggle("selected", automaticMode);
  $("manualBtn").classList.toggle("selected", !automaticMode);

  $("modeTip").textContent = automaticMode
    ? "Automatic mode: Fan speed is adjusted based on temperature and occupancy."
    : "Manual mode: You control the fan power, speed and swing position.";
}

$("occupiedBtn").addEventListener("click", () => {
  occupied = true;
  logActivity("Person detected in room.", "#08ad8a");
  updateFan();
});

$("emptyBtn").addEventListener("click", () => {
  occupied = false;
  logActivity("Room marked empty in the simulation.", "#f6a53b");
  updateFan();
});

$("autoBtn").addEventListener("click", () => {
  automaticMode = true;
  logActivity("Mode changed to Automatic.", "#8050f5");
  updateFan();
});

$("manualBtn").addEventListener("click", () => {
  automaticMode = false;
  logActivity("Mode changed to Manual.", "#8050f5");
  updateFan();
});

$("fanOnBtn").addEventListener("click", () => {
  automaticMode = false;
  fanOn = true;
  logActivity("Fan switched ON manually.", "#08ad8a");
  updateFan();
});

$("fanOffBtn").addEventListener("click", () => {
  automaticMode = false;
  fanOn = false;
  logActivity("Fan switched OFF manually.", "#ef4b5b");
  updateFan();
});

manualSpeed.addEventListener("change", () => {
  automaticMode = false;
  currentSpeed = Number(manualSpeed.value);
  logActivity("Fan speed set to " + speedName(currentSpeed) + ".", "#2879f6");
  updateFan();
});

swingPosition.addEventListener("change", () => {
  logActivity("Swing position set to " + swingPosition.value + ".", "#8050f5");
  updateFan();
});

temperature.addEventListener("input", updateFan);
humidity.addEventListener("input", updateFan);

temperature.addEventListener("change", () => {
  logActivity("Temperature changed to " + temperature.value + "°C.", "#2879f6");
});

humidity.addEventListener("change", () => {
  logActivity("Humidity changed to " + humidity.value + "%.", "#2879f6");
});

$("clearLogBtn").addEventListener("click", () => {
  activityLog.replaceChildren();
  logActivity("Activity log cleared.", "#f6a53b");
});

function updateClock() {
  const now = new Date();
  $("dateTime").innerHTML =
    now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }) +
    "<br>" +
    now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  const hour = now.getHours();
  $("greeting").textContent =
    hour < 12 ? "Good Morning!" :
    hour < 17 ? "Good Afternoon!" : "Good Evening!";
}

logActivity("Fan ON, speed: Medium, mode: Automatic.", "#08ad8a");
logActivity("Temperature set to 28°C.", "#2879f6");
logActivity("Swing position set to Center.", "#8050f5");
logActivity("Person detected in room.", "#08ad8a");

updateFan();
updateClock();
setInterval(updateClock, 30000);
