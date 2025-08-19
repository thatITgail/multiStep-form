# Frontend Mentor - Multi-step form

This is a solution to the [Multi-step form challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/multistep-form-YVAnSdqQBJ). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Complete each step of the sequence
- Go back to a previous step to update their selections
- See a summary of their selections on the final step and confirm their order
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- Receive form validation messages if:
  - A field has been missed
  - The email address is not formatted correctly
  - A step is submitted, but no selection has been made

 ## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- Vanilla Javascript

### What I learned
- The use of flex property to hide other flex items and display only the first flex item.

```html
<section class="flex-container">
  <article class="flex-item">item 1 </article>
  <article class="flex-item">item 2</article>
  <article class="flex-item">item 3</article>
</section>
```
```css
.flex-container{
  display: flex;
  flex-direction: columnn;
  overflow: hidden;
}
.flex-item{
  flex: 0 0 100%;
}
```
- The use of Array methods like filter(), reduce(), forEach(), map() and some() used to calculate sums, dynamically create html elements with the use of template literals, display only needed elements with the use of some() and filter() methods. Used forEach() to loop through contents and perform similar actions like click on each content.

```js
  if(checkbox.checked){
    if (!formData.addons.some(addon => addon.name === addOnName)){
        formData.addons.push({name: addOnName, price: addOnPrice});
      }
    }else{
      formData.addons = formData.addons.filter(addon => addon.name !== addOnName);
  }

  const summaryTotal = formData.plan.price + formData.addons.reduce((sum, addon) => sum + addon.price, 0);

  addonsSummary.innerHTML = formData.addons.map(addon => 
    `
      <li class="add-ons-summary-info flex">
        <span>${addon.name}</span>
        <span class="add-ons-summary-info-price">
          $${addon.price}/${unit}
        </span>
      </li>
    `
  )
```

- The use of objects to save or store informations got from user and updating each information based on changes made by the user.

```js
  const formData = {
    name: "",
    email: "",
    phone: "",
    plan: {name: "", type: "", price: ""},
    addons: []
  }
```
- The use of parseInt() to convert strings to nos

```js
  parseInt(planType.textContent.match(/\d+/)[0], 10)
```
- The use of tenary conditions to write if else statements to reduce redundancy and repetition of statements 

```js
  steps.forEach((step, i) =>{
    step.style.display = i === stepIndex ? "block" : "none";
  })
  planBtn.style.transform = formData.plan.type === "yearly" ? "translateX(150%)" : "translateX(0)"; 
```

- The flexibility of the querySelector() in selecting elements from the DOM

```js
  let isYearly = false;
  function updateSelectedPlan(card){
    const planType = card.querySelector(isYearly ? ".price.yearly": ".price.monthly");
  }
```
### Continued development
- After learning APIs, i'd like to post the user info collected. 

### Useful resources
- ChatGpt was the resource i used to understand how to perform some functionalities and how to write clear and concise codes. 

## Author

- Website - [Michelle Dim](https://codepen.io/michelle122)
- Frontend Mentor - [@thatITgail](https://www.frontendmentor.io/profile/thatITgail)
- Twitter - [@Mich_ellene](https://www.twitter.com/Mich_ellene)