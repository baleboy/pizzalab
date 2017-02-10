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
  this.hydrationLabel = document.getElementById('hydration-value');
  this.weightPerPizzaLabel = document.getElementById('wpp-value');
  this.yeastPrcLabel = document.getElementById('yeast-value');
  this.saltPrcLabel = document.getElementById('salt-value');
  this.usernameLabel = document.getElementById('username');

  // Controls
  this.loginButton = document.getElementById('login-button');
  this.logoutButton = document.getElementById('logout-button');
  this.settingsButton = document.getElementById('settings-button');
  this.hydrationInput = document.getElementById('hydration-input');
  this.weightPerPizzaInput = document.getElementById('wpp-input');
  this.saltPrcInput = document.getElementById('salt-input');
  this.yeastPrcInput = document.getElementById('yeast-input');
  this.pizzasInput = document.getElementById('pizzas');

  // Events
  this.loginButton.addEventListener('click', this.signIn.bind(this));
  this.logoutButton.addEventListener('click', this.signOut.bind(this));
  this.pizzasInput.addEventListener('change', this.updatePizzas.bind(this));
  this.hydrationInput.addEventListener('change', this.updateHydration.bind(this));
  this.hydrationInput.addEventListener('input', this.updateHydration.bind(this));
  this.weightPerPizzaInput.addEventListener('change', this.updateWeightPerPizza.bind(this));
  this.weightPerPizzaInput.addEventListener('input', this.updateWeightPerPizza.bind(this));
  this.yeastPrcInput.addEventListener('change', this.updateYeastPrc.bind(this));
  this.yeastPrcInput.addEventListener('input', this.updateYeastPrc.bind(this));
  this.saltPrcInput.addEventListener('change', this.updateSaltPrc.bind(this));
  this.saltPrcInput.addEventListener('input', this.updateSaltPrc.bind(this));
  this.settingsButton.addEventListener('click', this.toggleSettings.bind(this));

  this.refreshUI();
};

PizzaLab.prototype.toggleSettings = function () {
  if (this.settingsPanel.hasAttribute('hidden')) {
    this.settingsPanel.removeAttribute('hidden');
  } else{
    this.settingsPanel.setAttribute('hidden', 'true');
  }
}

PizzaLab.prototype.updatePizzas = function() {
  this.pizzas = this.pizzasInput.value;
  if (this.userId) {
    this.database.ref('users/' + this.userId).set( {
      pizzas: this.pizzas
    });
  }
  this.refreshUI();
}

PizzaLab.prototype.updateHydration = function(event) {
  this.dough.hydration = this.hydrationInput.value;
  this.hydrationLabel.innerHTML = this.hydrationInput.value + "%";
  if (this.userId && event.type === 'change') {
    this.database.ref('users/' + this.userId + '/dough/hydration').set(this.dough.hydration);
  }
  this.refreshUI();
}

PizzaLab.prototype.updateWeightPerPizza = function(event) {
  this.dough.weightPerPizza = this.weightPerPizzaInput.value;
  this.weightPerPizzaLabel.innerHTML = this.weightPerPizzaInput.value;
  if (this.userId && event.type === 'change') {
    this.database.ref('users/' + this.userId + '/dough/weightPerPizza').set(this.dough.weightPerPizza);
  }
  this.refreshUI();
}

PizzaLab.prototype.updateSaltPrc = function(event) {
  this.dough.saltPrc = this.saltPrcInput.value;
  this.saltPrcLabel.innerHTML = this.saltPrcInput.value + "%";
  if (this.userId && event.type === 'change') {
    this.database.ref('users/' + this.userId + '/dough/saltPrc').set(this.dough.saltPrc);
  }
  this.refreshUI();
}

PizzaLab.prototype.updateYeastPrc = function(event) {
  this.dough.yeastPrc = this.yeastPrcInput.value;
  this.yeastPrcLabel.innerHTML = this.yeastPrcInput.value + "%";
  if (this.userId && event.type === 'change') {
    this.database.ref('users/' + this.userId + '/dough/yeastPrc').set(this.dough.yeastPrc);
  }
  this.refreshUI();
}

PizzaLab.prototype.signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
}

PizzaLab.prototype.signOut = function() {
  this.auth.signOut();
};

PizzaLab.prototype.onAuthStateChanged = function(user) {

  if (user) {
    this.usernameLabel.textContent=user.displayName;
    this.usernameLabel.removeAttribute('hidden');
    this.loginButton.setAttribute('hidden', 'true');
    this.logoutButton.removeAttribute('hidden', 'true');
    this.userId = user.uid;
    var app = this;
    this.database.ref('users/' + user.uid).once('value').then(function(snapshot) {
      var uiNeedsUpdate = false;
      if (snapshot.val()) {
        if (snapshot.val().pizzas) {
          this.pizzas = snapshot.val().pizzas;
          console.log('pizzas: ' + this.pizzas);
          uiNeedsUpdate = true;
        }
        if (snapshot.val().dough) {
          if (snapshot.val().dough.hydration) {
            this.dough.hydration = snapshot.val().dough.hydration;
            uiNeedsUpdate = true;
          }
          if (snapshot.val().dough.weightPerPizza) {
            this.dough.weightPerPizza = snapshot.val().dough.weightPerPizza;
            uiNeedsUpdate = true;
          }
          if (snapshot.val().dough.saltPrc) {
            this.dough.saltPrc = snapshot.val().dough.saltPrc;
            uiNeedsUpdate = true;
          }
          if (snapshot.val().dough.yeastPrc) {
            this.dough.yeastPrc = snapshot.val().dough.yeastPrc;
            uiNeedsUpdate = true;
          }
        }
      }
      if (uiNeedsUpdate)
        this.refreshUI();
    }.bind(this));
  } else {
    this.usernameLabel.setAttribute('hidden', 'true');
    this.loginButton.removeAttribute('hidden');
    this.logoutButton.setAttribute('hidden', 'true');
    this.userId = null;
  }
};

PizzaLab.prototype.refreshUI = function() {
  this.flourLabel.innerHTML = this.dough.flour(this.pizzas).toString() + "g";
  this.waterLabel.innerHTML = this.dough.water(this.pizzas).toString() + "g";
  this.saltLabel.innerHTML = this.dough.salt(this.pizzas).toString() + "g";
  this.yeastLabel.innerHTML = this.dough.yeast(this.pizzas).toString() + "g";
  this.hydrationLabel.innerHTML = this.dough.hydration + "%";
  this.saltPrcLabel.innerHTML = this.dough.saltPrc + "%";
  this.yeastPrcLabel.innerHTML = this.dough.yeastPrc + "%";
  this.weightPerPizzaLabel.innerHTML = this.dough.weightPerPizza;
  this.pizzasInput.value = this.pizzas;
};

window.onload = function() {
  window.pizzaLab = new PizzaLab();
};
