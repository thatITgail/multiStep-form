// ======================================
// MULTI-STEP FORM CONTROLLER
// Author: Your Name
// Description: Handles navigation, validation,
// form data saving, and UI updates for the
// multi-step form with sidebar steps.
// ======================================

// === GLOBAL SELECTORS ===
const steps = document.querySelectorAll("article");
const navLinks = document.querySelectorAll(".sidebar-num");
const btnNext = document.querySelector(".next-btn");
const btnBack = document.querySelector(".go-back-btn");
const form = document.querySelector("form");
console.log(form)

// Step 1 Inputs
const inputName = document.getElementById("fullname");
const inputEmail = document.getElementById("email");
const inputPhone = document.getElementById("phone-number");

// Step 2 Plans
const planCards = document.querySelectorAll(".plan-content");
const planToggleBtn = document.querySelector(".plan-btn");
const planWhiteBg = document.querySelector(".plan-btn .white-bg");
const planBtnText = document.querySelectorAll(".plan-btn-text");

// Step 3 Add-ons
const addOnCards = document.querySelectorAll(".add-ons-content");

// Step 4 Summary
const summaryPlanName = document.querySelector(".summary-plan-title");
const summaryPlanType = document.querySelector(".summary-plan-type");
const summaryPlanPrice = document.querySelector(".summary-plan-price");
const summaryAddons = document.querySelector(".add-ons-summary");
const summaryTotal = document.querySelector(".summary-total");
const changePlanBtn = document.querySelector(".plan-summary-change-btn");

// === STATE STORAGE ===
let currentStep = 0;
let formData = {
  name: "",
  email: "",
  phone: "",
  plan: { name: "", price: 0, type: "monthly" },
  addOns: []
};

// =======================
// SHOW STEP FUNCTION
// =======================
function showStep(stepIndex) {
  // Display current step
  steps.forEach((step, i) => {
    step.style.display = i === stepIndex ? "block" : "none";
    /*The explanation of the above code
    if(i === stepIndex){
      step.style.display = "block"
    }else{
      step.style.display = "none"
    }*/
  });

  // Sidebar active link
  navLinks.forEach((link, i) => {
    link.parentElement.classList.remove("active");
    if ((stepIndex === 3 || stepIndex === 4) && i === 3) {
      link.parentElement.classList.add("active");
    } else if (i === stepIndex && stepIndex < 3) {
      link.parentElement.classList.add("active");
    }
  });

  // Buttons state
  if (stepIndex === 0) {
    btnBack.style.visibility = "hidden";
    btnNext.textContent = "Next Step";
  } else if (stepIndex === 3) {
    btnBack.style.visibility = "visible";
    btnNext.textContent = "Confirm";
  } else if (stepIndex === 4) {
    btnBack.style.display = "none";
    btnNext.style.display = "none";
  } else {
    btnBack.style.visibility = "visible";
    btnNext.textContent = "Next Step";
  }
}

// =======================
// VALIDATION (STEP 1)
// =======================
function validateStep1() {
  let valid = true;

  function checkField(input, regex = null) {    
  // Find the error message inside the label container above the input
  const errorMsg = input.previousElementSibling?.querySelector(".error-msg");

  if (!input.value.trim() || (regex && !regex.test(input.value.trim()))) {
    input.classList.add("error");
    if (errorMsg) errorMsg.style.display = "block";
    valid = false;
  } else {
    input.classList.remove("error");
    if (errorMsg) errorMsg.style.display = "none";
  }
}
  checkField(inputName);
  checkField(inputEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  checkField(inputPhone, /^\+?\d[\d\s-]{7,}$/);

  if (valid) {
    formData.name = inputName.value.trim();
    formData.email = inputEmail.value.trim();
    formData.phone = inputPhone.value.trim();
  }
  return valid;
}

// =======================
// NAVIGATION
// =======================
function nextStep() {
  if (currentStep === 0 && !validateStep1()) return;

  if (currentStep === 3) {
    currentStep++;
    showStep(currentStep);
    return;
  }

  currentStep++;
  showStep(currentStep);

  if (currentStep === 3) populateSummary();
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// Sidebar click navigation
navLinks.forEach((link, index) => {
  link.addEventListener("click", e => {
    e.preventDefault();
    if (index > currentStep && currentStep === 0 && !validateStep1()) return;
    if (index === 3 && currentStep !== 4) {
      currentStep = 3;
      populateSummary();
    } else {
      currentStep = index;
    }
    showStep(currentStep);
  });
});

// =======================
// PLAN SELECTION (STEP 2)
// =======================
// Initialize plan selection state
let isYearly = false; // default monthly

// Function to set active plan & update formData
function updateSelectedPlan(card) {
  const planName = card.querySelector("h3.plan").textContent;
  const priceEl = card.querySelector(isYearly ? ".price.yearly" : ".price.monthly");
  const planPrice = parseInt(priceEl.textContent.match(/\d+/)[0], 10);

  formData.plan.name = planName;
  formData.plan.price = planPrice;
  formData.plan.type = isYearly ? "yearly" : "monthly";
}

// Click on plan card
planCards.forEach(card => {
  card.addEventListener("click", () => {
    // remove active from all
    planCards.forEach(cardEl => cardEl.classList.remove("active"));

    // add active to clicked
    card.classList.add("active");

    // update formData
    updateSelectedPlan(card);
    // console.log("Selected Plan:", formData.plan);
  });
});

// Toggle monthly/yearly
planToggleBtn.addEventListener("click", () => {
  isYearly = !isYearly; // flip state
  formData.plan.type = isYearly ? "yearly" : "monthly";

  // Update display
  document.querySelectorAll(".price.monthly").forEach(el => {
    el.style.display = isYearly ? "none" : "block";
  });
  document.querySelectorAll(".price.yearly").forEach(el => {
    el.style.display = isYearly ? "block" : "none";
  });
  document.querySelectorAll(".free-package").forEach(el => {
    el.style.display = isYearly ? "inline-block" : "none";
  });


  // Move toggle UI
  if (formData.plan.type === "yearly") {
    planWhiteBg.style.transform = "translateX(150%)";
  } else {
    planWhiteBg.style.transform = "translateX(0)";
  };

   // Update plan button texts
  planBtnText.forEach((text) => {
    const monthlyText = text.classList.contains("monthly");
    const yearlyText = text.classList.contains("yearly");
    const activeText = (!isYearly && monthlyText) || (isYearly && yearlyText);
    text.classList.toggle("active", activeText)
  });

  // If a plan is already selected, re-update its price
  const activeCard = document.querySelector(".plan-content.active");
  if (activeCard) {
    updateSelectedPlan(activeCard);
  }

  updateAddOnPrices();
});

// Initial state on page load
(function initPlanSection() {
  document.querySelectorAll(".price.yearly").forEach(el => el.style.display = "none");
  document.querySelectorAll(".free-package").forEach(el => el.style.display = "none");
   planBtnText.forEach((text) => text.classList.contains("monthly") ? text.classList.add("active") : text.classList.remove("active"));
})();


// =======================
// ADD-ONS (STEP 3)
// ======================

function updateAddOnPrices() {
  addOnCards.forEach(card => {
    const monthlyPrice = card.querySelector(".monthly");
    const yearlyPrice = card.querySelector(".yearly");

    if (formData.plan.type === "monthly") {
      monthlyPrice.style.display = "inline";
      yearlyPrice.style.display = "none";
    } else {
      monthlyPrice.style.display = "none";
      yearlyPrice.style.display = "inline";
    }
  });
}

// Handle add-on selection by clicking anywhere on the container
addOnCards.forEach(card => {
  const checkbox = card.querySelector("input[type='checkbox']");

  card.addEventListener("click", e => {
    // Prevent double toggle if clicking directly on checkbox
    if (e.target.tagName.toLowerCase() !== "input") {
      checkbox.checked = !checkbox.checked;
    }

    // Toggle selected class for styling
    card.classList.toggle("active", checkbox.checked);

    // Save selected add-ons in formData
    const addOnName = card.querySelector("label").textContent.trim();

    const priceText = formData.plan.type === "monthly"
      ? card.querySelector(".monthly").textContent
      : card.querySelector(".yearly").textContent;

    if (checkbox.checked) {
      formData.addOns.push({ name: addOnName, price: priceText });
    } else {
      formData.addOns = formData.addOns.filter(addon => addon.name !== addOnName);
    }
    console.log("Current Add-Ons:", formData.addOns);
  });
});

// =======================
// SUMMARY (STEP 4)
// =======================

function populateSummary() {
  // Payment type
  const unit = formData.plan.type === "monthly" ? "mo" : "yr";
  // Update plan info
  document.querySelector(".plan-summary-name").textContent = formData.plan.name;
  document.querySelector(".plan-summary-type").textContent = `(${formData.plan.type})`;
  document.querySelector(".plan-summary-price").textContent = `$${formData.plan.price}/${unit}`;

   // Helper: convert a price string like "+$1/mo" or "$120/yr" to a number (1 or 120)
  const toNumber = (priceText) => +String(priceText).replace(/[^\d.]/g, '') || 0;


  // Populate add-ons dynamically
  const addOnsSummary = document.querySelector(".add-ons-summary");
  addOnsSummary.innerHTML = formData.addOns.map(addOn => 
    `
    <li class="add-ons-summary-info flex">
      <span>${addOn.name}</span>
      <span class="add-ons-summary-info-price">
        $${toNumber(addOn.price)}/${unit}
      </span>
    </li>
  `).join('');

  // Update total
  const addOnTotal = formData.addOns.reduce(
    (sum, addOn) => sum + toNumber(addOn.price), 0);

  const totalPrice = formData.plan.price + addOnTotal;
  console.log(totalPrice);

  document.querySelector(".summary-total-text .summary-plan-date").textContent = 
    `(per ${formData.plan.type.toLowerCase()})`;

  document.querySelector(".summary-total-price").textContent = 
    `+$${totalPrice}/${unit}`;
}


changePlanBtn.addEventListener("click", () => {
  currentStep = 1;
  showStep(currentStep);
});

// =======================
// EVENT LISTENERS
// =======================
form.addEventListener("click", (e) => {
  e.preventDefault();
  btnNext.addEventListener("click", nextStep);
  btnBack.addEventListener("click", prevStep);

})
// =======================
// INIT
// =======================
showStep(currentStep);
