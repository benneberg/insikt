import { runDemo } from "./simulator.js";

const activateBtn = document.getElementById("activateBtn");
const demoBtn = document.getElementById("demoBtn");
const toggleAdvanced = document.getElementById("toggleAdvanced");
const advancedPanel = document.getElementById("advancedPanel");

let activated = false;

/* -----------------------
   ACTIVATE INSIKT
------------------------*/
activateBtn.addEventListener("click", () => {
  if (activated) return;

  activated = true;

  activateBtn.textContent = "INSIKT Active";

  console.log("[INSIKT] activated");

  // Here you would inject your real overlay
  // window.insikt.init()

});

/* -----------------------
   DEMO SESSION
------------------------*/
demoBtn.addEventListener("click", () => {
  console.log("[INSIKT] demo started");

  runDemo({
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
  });
});

/* -----------------------
   ADVANCED TOGGLE
------------------------*/
toggleAdvanced.addEventListener("click", () => {
  advancedPanel.classList.toggle("hidden");
});

/* -----------------------
   ADVANCED ACTIONS
------------------------*/
advancedPanel.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;

  switch (action) {

    case "log":
      console.log({ user: "insikt", value: Math.random() });
      break;

    case "warn":
      console.warn("Warning triggered");
      break;

    case "error":
      console.error("Manual error trigger");
      break;

    case "info":
      console.info("Info event");
      break;

    case "fetch":
      fetch("https://jsonplaceholder.typicode.com/todos/1")
        .then(r => r.json())
        .then(console.log);
      break;

    case "xhr":
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1");
      xhr.onload = () => console.log(xhr.responseText);
      xhr.send();
      break;

    case "idb":
      console.log("IndexedDB seed simulated");
      break;

    case "throw":
      throw new Error("Simulated runtime error");
    
    case "reject":
      Promise.reject("Simulated rejection").catch(console.error);
      break;
  }
});
