'use strict';

// Class holding dough parameters and amounts
function Dough() {

  this.hydration = 68;
  this.yeastPrc = 0.3;
  this.saltPrc = 1.5;
  this.weightPerPizza = 225;
};

Dough.prototype.flour = function(pizzas) {
 return Math.round(pizzas * this.weightPerPizza / (1 + this.hydration/100));
};

Dough.prototype.water = function(pizzas) {
  return pizzas * this.weightPerPizza - this.flour(pizzas);
};

Dough.prototype.salt = function(pizzas) {
  return Math.round(pizzas * this.weightPerPizza * this.saltPrc / 100);
};

Dough.prototype.yeast = function(pizzas) {
  return Math.round(pizzas * this.weightPerPizza * this.yeastPrc / 100);
};

function hide(element) {
  element.style.display = 'none';
}

function show(element) {
  element.style.display = 'block';
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
  this.usernameLabel = document.getElementById('username');

  // Controls
  this.loginButton = document.getElementById('login-button');
  this.logoutButton = document.getElementById('logout-button');
  this.saveSettingsButton = document.getElementById('save-settings-button');
  this.hydrationInput = document.getElementById('hydration-input');
  this.weightPerPizzaInput = document.getElementById('wpp-input');
  this.saltInput = document.getElementById('salt-input');
  this.yeastInput = document.getElementById('yeast-input');
  this.pizzasInput = document.getElementById('pizzas');

  // Events
  this.loginButton.addEventListener('click', this.signIn.bind(this));
  this.logoutButton.addEventListener('click', this.signOut.bind(this));
  this.pizzasInput.addEventListener('change', this.updatePizzas.bind(this));
  this.hydrationInput.addEventListener('change', this.updateHydration.bind(this));
  this.weightPerPizzaInput.addEventListener('change', this.updateWeightPerPizza.bind(this));
  this.yeastInput.addEventListener('change', this.updateYeastPrc.bind(this));
  this.saltInput.addEventListener('change', this.updateSaltPrc.bind(this));
  this.saveSettingsButton.addEventListener('click', this.saveSettings.bind(this));

  this.saveSettingsButton.disabled = true;
  hide(this.logoutButton);
  hide(this.usernameLabel);
  this.updateIngredients();
  this.updateSettings();
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
  this.dough.saltPrc = parseFloat(this.saltInput.value) / 10.0;
  this.updateIngredients();
}

PizzaLab.prototype.updateYeastPrc = function(event) {
  this.dough.yeastPrc = parseFloat(this.yeastInput.value / 10.0);
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
  this.flourLabel.innerHTML = this.dough.flour(this.pizzas).toString() + "g";
  this.waterLabel.innerHTML = this.dough.water(this.pizzas).toString() + "g";
  this.saltLabel.innerHTML = this.dough.salt(this.pizzas).toString() + "g";
  this.yeastLabel.innerHTML = this.dough.yeast(this.pizzas).toString() + "g";
};

PizzaLab.prototype.updateSettings = function() {
  this.pizzasInput.value = this.pizzas;
  this.hydrationInput.value = this.dough.hydration;
  this.weightPerPizzaInput.value = this.dough.weightPerPizza;
  this.saltInput.value = this.dough.saltPrc * 10.0;
  this.yeastInput.value = this.dough.yeastPrc * 10.0;
}

PizzaLab.prototype.loadSettings = function(user) {
  this.database.ref('users/' + user.uid).once('value').then(function(snapshot) {
    if (snapshot.val()) {
      if (snapshot.val().pizzas) {
        this.pizzas = snapshot.val().pizzas;
      }
      if (snapshot.val().dough) {
        this.dough = snapshot.val().dough;
      }
    }
    this.updateIngredients();
    this.updateSettings();
  }.bind(this));
}

window.onload = function() {
  window.pizzaLab = new PizzaLab();
};
