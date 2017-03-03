'use strict';

// Class holding dough parameters and amounts
function Dough() {

  this.hydration = 68;
  this.yeastPrc = 0.5;
  this.saltPrc = 1.5;
  this.weightPerPizza = 230;
  this.prefermentPrc = 0;
  this.prefermentHydration = 100;
  this.prefermentYeastPrc = 0.2;
};

Dough.prototype.fromJSON = function(obj) {
  this.hydration = obj.hydration;
  this.yeastPrc =obj.yeastPrc;
  this.saltPrc = obj.saltPrc;
  this.weightPerPizza = obj.weightPerPizza;
  this.prefermentPrc = obj.prefermentPrc;
  this.prefermentHydration = obj.prefermentHydration;
}

Dough.prototype.flour = function(pizzas) {
 return Math.round(pizzas * this.weightPerPizza / (1 + (this.hydration + this.saltPrc + this.yeastPrc)/100));
};

Dough.prototype.water = function(pizzas) {
  return Math.round(this.flour(pizzas)/100 * this.hydration);
};

Dough.prototype.prefermentFlour = function(pizzas) {
  return Math.round(this.flour(pizzas) * this.prefermentPrc/100);
}

Dough.prototype.prefermentWater = function(pizzas) {
  return Math.round(this.prefermentFlour(pizzas)*this.prefermentHydration/100);
}

Dough.prototype.prefermentYeast = function(pizzas) {
  return Math.round((this.prefermentFlour(pizzas)*this.prefermentYeastPrc/100)*10)/10;
}

Dough.prototype.salt = function(pizzas) {
  return Math.round((this.flour(pizzas)/100 * this.saltPrc)*10)/10;
};

Dough.prototype.yeast = function(pizzas) {
  return Math.round((this.flour(pizzas)/100 * this.yeastPrc)*10)/10;
};

function hide(element) {
  element.style.display = 'none';
}

function show(element) {
  element.style.display = '';
}
// Initialize the app
function PizzaLab() {

  this.dough = new Dough();
  this.pizzas = 4;
  this.userId = null;

  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
  this.database = firebase.database();
  // Create shortcuts for the DOM elements

  // Containers
  this.settingsPanel = document.getElementById('settings-panel');

  // Labels
  this.flourLabel = document.getElementById('flour');
  this.waterLabel = document.getElementById('water');
  this.saltLabel = document.getElementById('salt');
  this.yeastLabel = document.getElementById('yeast');
  this.prefermentFlourLabel = document.getElementById('preferment-flour');
  this.prefermentWaterLabel = document.getElementById('preferment-water');
  this.prefermentYeastLabel = document.getElementById('preferment-yeast');
  this.usernameLabel = document.getElementById('username');

  // Controls
  this.loginButton = document.getElementById('login-button');
  this.logoutButton = document.getElementById('logout-button');
  this.saveSettingsButton = document.getElementById('save-settings-button');
  this.hydrationInput = document.getElementById('hydration-input');
  this.weightPerPizzaInput = document.getElementById('wpp-input');
  this.saltInput = document.getElementById('salt-input');
  this.yeastInput = document.getElementById('yeast-input');
  this.prefermentInput = document.getElementById('preferment-input');
  this.prefermentHydrationInput = document.getElementById('preferment-hydration-input');
  this.prefermentYeastInput = document.getElementById('preferment-yeast-input');
  this.pizzasInput = document.getElementById('pizzas');
  this.resetButton = document.getElementById('reset-button');

  // Wrappers
  this.prefermentIngredients = document.getElementById('preferment-ingredients');

  // Events
  this.loginButton.addEventListener('click', this.signIn.bind(this));
  this.logoutButton.addEventListener('click', this.signOut.bind(this));
  this.pizzasInput.addEventListener('change', this.updatePizzas.bind(this));
  this.hydrationInput.addEventListener('change', this.updateHydration.bind(this));
  this.weightPerPizzaInput.addEventListener('change', this.updateWeightPerPizza.bind(this));
  this.yeastInput.addEventListener('change', this.updateYeastPrc.bind(this));
  this.saltInput.addEventListener('change', this.updateSaltPrc.bind(this));
  this.prefermentInput.addEventListener('change', this.updatePrefermentPrc.bind(this));
  this.prefermentHydrationInput.addEventListener('change', this.updatePrefermentHydration.bind(this));
  this.prefermentYeastInput.addEventListener('change', this.updatePrefermentYeast.bind(this));
  this.saveSettingsButton.addEventListener('click', this.saveSettings.bind(this));
  this.resetButton.addEventListener('click', this.reset.bind(this));

  this.saveSettingsButton.disabled = true;
  hide(this.logoutButton);
  hide(this.usernameLabel);
  this.updateSettings();
  this.updateIngredients();
};

PizzaLab.prototype.updatePizzas = function() {
  this.pizzas = this.pizzasInput.value;
  if (this.userId) {
    this.database.ref('users/' + this.userId + '/pizzas').set(this.pizzas);
  }
  this.updateIngredients();
}

PizzaLab.prototype.updateHydration = function(event) {
  this.dough.hydration = parseInt(this.hydrationInput.value);
  this.updateIngredients();
}

PizzaLab.prototype.updateWeightPerPizza = function(event) {
  this.dough.weightPerPizza = parseInt(this.weightPerPizzaInput.value);
  this.updateIngredients();
}

PizzaLab.prototype.updateSaltPrc = function(event) {
  this.dough.saltPrc = parseFloat(this.saltInput.value);
  this.updateIngredients();
}

PizzaLab.prototype.updateYeastPrc = function(event) {
  this.dough.yeastPrc = parseFloat(this.yeastInput.value);
  this.updateIngredients();
}

PizzaLab.prototype.updatePrefermentPrc = function(event) {
  this.dough.prefermentPrc = parseFloat(this.prefermentInput.value);
  this.updateIngredients();
}

PizzaLab.prototype.updatePrefermentHydration = function(event) {
  this.dough.prefermentHydration = parseFloat(this.prefermentHydrationInput.value);
  this.updateIngredients();
}

PizzaLab.prototype.updatePrefermentYeast = function(event) {
  this.dough.prefermentYeastPrc = parseFloat(this.prefermentYeastInput.value);
  this.updateIngredients();
}

PizzaLab.prototype.signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
}

PizzaLab.prototype.signOut = function() {
  this.auth.signOut();
};

PizzaLab.prototype.saveSettings = function() {
  this.database.ref('users/' + this.userId + '/pizzas').set(this.pizzas);
  this.database.ref('users/' + this.userId + '/dough').set(this.dough);
}

PizzaLab.prototype.onAuthStateChanged = function(user) {

  if (user) {
    this.usernameLabel.textContent=user.displayName;
    show(this.usernameLabel);
    hide(this.loginButton);
    show(this.logoutButton);
    this.userId = user.uid;
    this.saveSettingsButton.disabled = false;
    this.loadSettings.bind(this)(user);
  } else {
    hide(this.usernameLabel);
    show(this.loginButton);
    hide(this.logoutButton);
    this.userId = null;
    this.saveSettingsButton.disabled = true;
  }
};

PizzaLab.prototype.updateIngredients = function() {
  var prefermentFlour = this.dough.prefermentFlour(this.pizzas);
  var prefermentWater = this.dough.prefermentWater(this.pizzas);
  var prefermentYeast = this.dough.prefermentYeast(this.pizzas);

  var flour = this.dough.flour(this.pizzas) - prefermentFlour;
  var water = this.dough.water(this.pizzas) - prefermentWater;
  var yeast = this.dough.yeast(this.pizzas) - prefermentYeast;

  this.flourLabel.innerHTML = flour.toString() + "g";
  this.waterLabel.innerHTML = water.toString() + "g";
  this.saltLabel.innerHTML = this.dough.salt(this.pizzas).toString() + "g";
  this.yeastLabel.innerHTML = this.dough.yeast(this.pizzas).toString() + "g";
  this.prefermentFlourLabel.innerHTML = prefermentFlour.toString() + "g";
  this.prefermentWaterLabel.innerHTML = prefermentWater.toString() + "g";
  this.prefermentYeastLabel.innerHTML = prefermentYeast.toString() + "g";

  if (this.dough.prefermentPrc > 0.0) {
    show(this.prefermentIngredients);
  } else {
    hide(this.prefermentIngredients);
  }
};

PizzaLab.prototype.updateSettings = function() {
  this.pizzasInput.value = this.pizzas;
  this.hydrationInput.value = this.dough.hydration;
  this.weightPerPizzaInput.value = this.dough.weightPerPizza;
  this.saltInput.value = this.dough.saltPrc;
  this.yeastInput.value = this.dough.yeastPrc;
  this.prefermentInput.value = this.dough.prefermentPrc;
  this.prefermentHydrationInput.value = this.dough.prefermentHydration;
  this.prefermentYeastInput.value = this.dough.prefermentYeastPrc;
};

PizzaLab.prototype.loadSettings = function(user) {
  this.database.ref('users/' + user.uid).once('value').then(function(snapshot) {
    if (snapshot.val()) {
      if (snapshot.val().pizzas) {
        this.pizzas = snapshot.val().pizzas;
      }
      if (snapshot.val().dough) {
        this.dough.fromJSON(snapshot.val().dough);
      }
      this.updateSettings.bind(this)();
      this.updateIngredients.bind(this)();
    }
  }.bind(this));
};

PizzaLab.prototype.reset = function() {
  this.dough = new Dough();
  this.updateSettings();
  this.updateIngredients();
};


window.onload = function() {
  window.pizzaLab = new PizzaLab();
};
