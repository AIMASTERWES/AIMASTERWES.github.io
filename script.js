function randomInRange(min, max, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return value.toFixed(decimals);
}

function updateKnob(knob) {
  const knobName = knob.dataset.knob || "value";
  const min = knobName === "guidance" ? 1 : 0;
  const max = knobName === "guidance" ? 12 : 1;
  const nextValue = randomInRange(min, max, knobName === "guidance" ? 1 : 2);
  const valueEl = knob.querySelector(".knob-value");
  valueEl.textContent = nextValue;
}

function handleKnobActivation(event) {
  const isClick = event.type === "click";
  const isKeyboard = event.type === "keydown" && (event.key === "Enter" || event.key === " ");

  if (!isClick && !isKeyboard) return;
  if (isKeyboard) {
    event.preventDefault();
  }

  const knob = event.currentTarget.closest(".knob");
  if (knob) {
    updateKnob(knob);
  }
}

function setupKnobs() {
  const knobs = document.querySelectorAll(".knob");
  knobs.forEach((knob) => {
    knob.addEventListener("keydown", handleKnobActivation);
    const randomButton = knob.querySelector(".knob-random");
    if (randomButton) {
      randomButton.addEventListener("click", handleKnobActivation);
      randomButton.addEventListener("keydown", handleKnobActivation);
    }
  });
}

function setActiveTab(nextTab) {
  const tablist = document.getElementById("control-tabs");
  const tabs = tablist.querySelectorAll("[role='tab']");
  const panels = document.querySelectorAll("[role='tabpanel']");

  tabs.forEach((tab) => {
    const isActive = tab === nextTab;
    tab.setAttribute("aria-selected", isActive);
    tab.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isActive = panel.id === nextTab.getAttribute("aria-controls");
    panel.toggleAttribute("hidden", !isActive);
    panel.setAttribute("aria-hidden", (!isActive).toString());
  });

  nextTab.focus();
}

function setupTabs() {
  const tablist = document.getElementById("control-tabs");
  const tabs = tablist.querySelectorAll("[role='tab']");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setActiveTab(tab));
    tab.addEventListener("keydown", (event) => {
      const { key } = event;
      const isActivation = key === "Enter" || key === " ";
      const isPrev = key === "ArrowLeft" || key === "ArrowUp";
      const isNext = key === "ArrowRight" || key === "ArrowDown";

      if (isActivation) {
        event.preventDefault();
        setActiveTab(tab);
        return;
      }

      if (!isPrev && !isNext) return;
      event.preventDefault();
      const tabArray = Array.from(tabs);
      const currentIndex = tabArray.indexOf(tab);
      const targetIndex = (tabArray.length + currentIndex + (isNext ? 1 : -1)) % tabArray.length;
      setActiveTab(tabArray[targetIndex]);
    });
  });
}

function toggleMode(button) {
  const toggles = document.querySelectorAll(".mode-toggle");
  toggles.forEach((toggle) => {
    toggle.setAttribute("aria-pressed", (toggle === button).toString());
  });
}

function setupModes() {
  const toggles = document.querySelectorAll(".mode-toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => toggleMode(toggle));
    toggle.addEventListener("keydown", (event) => {
      const isActivation = event.key === "Enter" || event.key === " ";
      if (!isActivation) return;
      event.preventDefault();
      toggleMode(toggle);
    });
  });
}

async function copyFromTarget(button) {
  const targetSelector = button.dataset.target;
  if (!targetSelector) return;
  const target = document.querySelector(targetSelector);
  if (!target) return;
  const text = target.textContent || target.value || "";
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied!";
    setTimeout(() => (button.textContent = "Copy" + (button.dataset.target.includes("prompt") ? " prompt" : " status")), 1200);
  } catch (error) {
    console.error("Copy failed", error);
    button.textContent = "Copy failed";
  }
}

function setupCopyButtons() {
  const copyButtons = document.querySelectorAll(".copy");
  copyButtons.forEach((button) => {
    button.addEventListener("click", () => copyFromTarget(button));
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        copyFromTarget(button);
      }
    });
  });
}

function setupIgnite() {
  const igniteButton = document.getElementById("ignite");
  const status = document.getElementById("status");

  const ignite = () => {
    status.textContent = "Igniting sequence...";
    igniteButton.disabled = true;
    igniteButton.textContent = "Igniting";
    setTimeout(() => {
      status.textContent = "Ignition complete. Ready to launch!";
      igniteButton.disabled = false;
      igniteButton.textContent = "Ignite";
    }, 1200);
  };

  igniteButton.addEventListener("click", ignite);
  igniteButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      ignite();
    }
  });
}

function init() {
  setupKnobs();
  setupTabs();
  setupModes();
  setupCopyButtons();
  setupIgnite();
}

document.addEventListener("DOMContentLoaded", init);
