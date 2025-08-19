window.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();

  // Global variables
  const steps = document.querySelectorAll("article");
  const navLinks = document.querySelectorAll(".sidebar-num");
  const btnNext = document.querySelector(".next-btn");
  const btnBack = document.querySelector(".go-back-btn");

  // Step 1 Inputs
  const inputName = document.getElementById("fullname");
  const inputEmail = document.getElementById("email");
  const inputPhone = document.getElementById("phone-number");

  // Step 2 Plans
  const planCards = document.querySelectorAll(".plan-content");
  const planToggleBtn = document.querySelector(".plan-btn");
  const planWhiteBg = document.querySelector(".plan-btn .white-bg");
  const planBtnText = document.querySelectorAll(".plan-btn-text");
  const monthlyPlan = document.querySelectorAll(".price.monthly");
  const yearlyPlan = document.querySelectorAll(".price.yearly");
  const yearlyText = document.querySelectorAll(".yearly.free-package");

  // Step 3 Add-ons
  const addOnCards = document.querySelectorAll(".add-ons-content");

  // Step 4 Summary
  const summaryPlanName = document.querySelector(".summary-plan-name");
  const summaryPlanType = document.querySelector(".summary-plan-type");
  const summaryPlanPrice = document.querySelector(".summary-plan-price");
  const summaryAddons = document.querySelector(".add-ons-summary");
  const summaryTotal = document.querySelector(".summary-total");
  const changePlanBtn = document.querySelector(".plan-summary-change-btn");

  // initialize state
  let stepCount = 0;
  const formData = {
    name: "",
    email: "",
    phone: "",
    plan: {name: "", type: "monthly", price: ""},
    addons: []
  }

  // link navlink steps and form
  function showStep(stepIndex){
    steps.forEach((step, i) =>{
      step.style.display = i === stepIndex ? "block" : "none";
    })

    // Activate nav links in relation to corresponding form articles
    navLinks.forEach((link, i) => {
      link.parentElement.classList.remove("active");

      const isFinalStep = stepIndex === 3 || stepIndex === 4;
      const isMatchingStep = i === stepIndex;

      if((isFinalStep && i === 3) || (isMatchingStep && stepIndex < 3)){
        link.parentElement.classList.add("active")
      }

    });

    // Display buttons dynamically
    if(stepIndex === 0){
      btnBack.style.visibility = "hidden";
    }else if(stepIndex === 3){
      btnBack.style.visibility = "visible";
      btnNext.textContent = "Confirm"
    }else if(stepIndex === 4){
      btnBack.style.display = "none";
      btnNext.style.display = "none"; 
    }else{
      btnBack.style.visibility = "visible";
      btnNext.textContent = "Next step"
    }
  }
  
  // FORM VALIDATION (STEP 1)
  function validateStep1(){
    let valid = true;

    function validInput(input, regex = null){
      const errorMsg = input.previousElementSibling?.querySelector(".error-msg");
      const inputValue = input.value.trim();
      const validRegex = regex && !regex.test(inputValue);

      if(!inputValue || validRegex){
        input.classList.add("error");
        errorMsg.style.display = "block";
        valid = false;
      }else{
        input.classList.remove("error");
        errorMsg.style.display = "none";
        valid = true;
      }
    }
    validInput(inputName);
    validInput(inputEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    validInput(inputPhone, /^\+?\d[\d\s-]{7,}$/);

    if(valid){
      formData.name = inputName.value.trim();
      formData.email = inputEmail.value.trim();
      formData.phone = inputPhone.value.trim();
    }
    return valid;
  }

  // Navigate forward via the form
  function nextStep(){
    if(stepCount === 0 && !validateStep1()) return;
     
    stepCount++;
    showStep(stepCount);

    if(stepCount === 3) populateSummary();
  }
  
  // Navigate backwards
  function prevStep(){
    if(stepCount > 0){
      stepCount --;
      showStep(stepCount);
    }
  }

  // sidebar click navigation
  navLinks.forEach((link, i) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if(i > stepCount && stepCount === 0 && !validateStep1()) return;
     if(i === 3 && stepCount !== 4){
       stepCount = 3;
       populateSummary();
     }else{
       stepCount = i;
     }
      showStep(stepCount);
    })    
  })
   

  // PLAN SELECTION (STEP 2)
  // initialize  plan selection state 
  let isYearly = false;

  function updateSelectedPlan(card){
    const planName = card.querySelector(".plan").textContent;
    const planType = card.querySelector(isYearly ? ".price.yearly": ".price.monthly");
    const planPrice = parseInt(planType.textContent.match(/\d+/)[0], 10);

    formData.plan.name = planName;
    formData.plan.type = isYearly ? "yearly" : "monthly";
    formData.plan.price = planPrice;
  }

  // Click on each card
  planCards.forEach((card) => {
    card.addEventListener("click", () => {
      // remove initial state
      planCards.forEach(cardItem => cardItem.classList.remove("active"));

      // activate a card
      card.classList.add("active");
      
      // update form data
      updateSelectedPlan(card)
    })
  });
  
  // Toggle between plan type
  planToggleBtn.addEventListener("click", () => {
    isYearly = !isYearly;
    formData.plan.type = isYearly ? "yearly" : "monthly";

    // display content according to plan type
    monthlyPlan.forEach(monthEl => monthEl.style.display = isYearly ? "none" : "block");
    yearlyPlan.forEach(yearEl => yearEl.style.display = isYearly ? "block" : "none");
    yearlyText.forEach(yearEl => yearEl.style.display = isYearly ? "block" : "none");

    // Move toggle UI
    planWhiteBg.style.transform = formData.plan.type === "yearly" ? "translateX(200%)" : "translateX(0)";

    // Display btn text
    planBtnText.forEach((text) => {
      const monthlyText = text.classList.contains("monthly");
      const yearlyText = text.classList.contains("yearly");
      const active = (isYearly && yearlyText) || (!isYearly && monthlyText);

      text.classList.toggle("active", active)
    });

    const activeCard = document.querySelector(".plan-content.active");
    if(activeCard){
      updateSelectedPlan(activeCard);
    };

    updateAddOnPrices();
  });
  

  // ADDONS SELECTION (STEP 3)
  // update addon prices based on plan selection type
  function updateAddOnPrices(){
    addOnCards.forEach((addOn) => {
      const monthlyPrice = addOn.querySelector(".monthly");
      const yearlyPrice = addOn.querySelector(".yearly");

      if(formData.plan.type === "monthly"){
        monthlyPrice.style.display = "inline";
        yearlyPrice.style.display = "none";
      }else{
        monthlyPrice.style.display = "none";
        yearlyPrice.style.display = "inline";
      }
    })
  }

  // Handle add-on selection by clicking anywhere on the container
  addOnCards.forEach((card) => {
    const checkbox = card.querySelector("input[type='checkbox']");

    card.addEventListener("click", (e) => {
      // Prevent double toggle if clicking directly on checkbox
      if(e.target.tagName.toLowerCase() !== "input"){
        checkbox.checked = !checkbox.checked;
      };

      // Toggle addon selection for styling
      card.classList.toggle("active", checkbox.checked);

      // save selected addons on formData 
      const addOnName = card.querySelector("label").textContent.trim();
  
      const planType = formData.plan.type === "monthly"
      ? card.querySelector(".monthly")
      : card.querySelector(".yearly")
      const addOnPrice = parseInt(planType.textContent.match(/\d+/)[0], 10)
      
      if(checkbox.checked){
        if (!formData.addons.some(addon => addon.name === addOnName)){
          formData.addons.push({name: addOnName, price: addOnPrice});
        }
      }else{
        formData.addons = formData.addons.filter(addon => addon.name !== addOnName)
      }
      console.log(formData.addons)
    });
  });
  
  // SUMMARY (STEP 4)
  function populateSummary(){
    // select unit
    const unit = formData.plan.type === "monthly"
    ? "mo" : "yr";

    // update Plan summary info
    // summaryPlanName.textContent = formData.plan.name;
    // summaryPlanType.textContent = formData.plan.type;
    // summaryPlanPrice.textContent = `$${formData.plan.price}/${unit}`;

    document.querySelector(".plan-summary-name").textContent = formData.plan.name;
    document.querySelector(".plan-summary-type").textContent = `(${formData.plan.type})`;
    document.querySelector(".plan-summary-price").textContent = `$${formData.plan.price}/${unit}`;

    //populate Add-ons summary  
    const addsOnSummary = document.querySelector(".add-ons-summary");
    addsOnSummary.innerHTML = formData.addons.map(addon => 
      `
        <li class="add-ons-summary-info flex">
          <span>${addon.name}</span>
          <span class="add-ons-summary-info-price">
            $${addon.price}/${unit}
          </span>
        </li>
      `
    ).join("");

    // Update total price
    const totalPrice = formData.plan.price + formData.addons.reduce((sum,addon) => sum + addon.price, 0);

    document.querySelector(".summary-total-text .summary-plan-date").textContent = `(per ${formData.plan.type.toLowerCase()})`;
    document.querySelector(".summary-total-price").textContent = `+$${totalPrice}/${unit}`
  }
  
  changePlanBtn.addEventListener("click", () => {
    stepCount = 1;
    showStep(stepCount)
  })

  btnNext.addEventListener("click", nextStep);
  btnBack.addEventListener("click", prevStep);
  showStep(stepCount)
})