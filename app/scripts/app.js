(function () {
  'use strict';

  var defaults = {
    hydration: 70,
    yeastPrc: 0.3,
    saltPrc: 1.5,
    weightPerPizza: 225,
    pizzas: 4
  }
  var dough = {
    hydration: defaults.hydration,
    yeastPrc: defaults.yeastPrc,
    saltPrc: defaults.saltPrc,
    weightPerPizza: defaults.weightPerPizza,
    pizzas: defaults.pizzas
  };

  dough.flour = function() {
   return Math.round(this.pizzas * this.weightPerPizza / (1 + this.hydration/100));
  }

  dough.water = function() {
    return this.pizzas * this.weightPerPizza - this.flour();
  }

  dough.salt = function() {
    return Math.round(dough.pizzas * dough.weightPerPizza * dough.saltPrc / 100);
  }

  dough.yeast = function() {
    return Math.round(dough.pizzas * dough.weightPerPizza * dough.yeastPrc / 100);
  }

  dough.setPizzas = function(pizzas) {
    dough.pizzas = pizzas;
  }

  dough.setHydration = function(hydration) {
    dough.hydration = hydration;
  }

  dough.setWeightPerPizza = function(w) {
    dough.weightPerPizza = w;
  }

  dough.setYeastPrc = function(y) {
    dough.yeastPrc = y;
  }

  dough.setSaltPrc = function(s) {
    dough.saltPrc = s;
  }

  var app = {};

  app.refreshUi = function() {

    document.getElementById('flour').innerHTML = dough.flour().toString() + "g";
    document.getElementById('water').innerHTML = dough.water().toString() + "g";
    document.getElementById('salt').innerHTML = dough.salt().toString() + "g";
    document.getElementById('yeast').innerHTML = dough.yeast().toString() + "g";
    document.getElementById('pizzas').value = dough.pizzas;
    document.getElementById('hydration-input').value = dough.hydration;
    document.getElementById('hydration-value').innerHTML = dough.hydration + "%";
    document.getElementById('wpp-input').value = dough.weightPerPizza;
    document.getElementById('wpp-value').innerHTML = dough.weightPerPizza + "g";
    document.getElementById('salt-input').value = dough.saltPrc;
    document.getElementById('salt-value').innerHTML = dough.saltPrc + "%";
    document.getElementById('yeast-input').value = dough.yeastPrc;
    document.getElementById('yeast-value').innerHTML = dough.yeastPrc + "%";
  }

  app.updatePizzas = function() {

    var pizzas = document.getElementById('pizzas').value;

    if (!pizzas)
      return;

    dough.setPizzas(pizzas);
    localStorage.numberOfPizzas = pizzas;
    app.refreshUi();
  }

  app.updateHydration = function() {
    var hydration = document.getElementById('hydration-input').value;
    dough.setHydration(hydration);
    localStorage.hydration = hydration;
    app.refreshUi();
  }

  app.updateWeightPerPizza = function() {
    var wpp = document.getElementById('wpp-input').value;
    dough.setWeightPerPizza(wpp);
    localStorage.weightPerPizza = wpp;
    app.refreshUi();
  }

 app.updateSaltPrc = function() {
    var s = document.getElementById('salt-input').value;
    dough.setSaltPrc(s);
    localStorage.saltPrc = s;
    app.refreshUi();
  }

  app.updateYeastPrc = function() {
    var y = document.getElementById('yeast-input').value;
    dough.setYeastPrc(y);
    localStorage.yeastPrc = y;
    app.refreshUi();
  }

  app.restoreData = function () {
     dough.setPizzas(localStorage.numberOfPizzas ? localStorage.numberOfPizzas : defaults.pizzas);
     dough.setHydration(localStorage.hydration ? localStorage.hydration : defaults.hydration);
     dough.setWeightPerPizza(localStorage.weightPerPizza ? localStorage.weightPerPizza : defaults.weightPerPizza);
     dough.setSaltPrc(localStorage.saltPrc ? localStorage.saltPrc : defaults.saltPrc);
     dough.setYeastPrc(localStorage.yeastPrc ? localStorage.yeastPrc : defaults.yeastPrc);
     this.refreshUi();
  }


  app.toggleSettings = function () {
    var s = document.getElementById('settings-panel');
    if (s.hasAttribute('hidden')) {
      s.removeAttribute('hidden');
    } else{
      s.setAttribute('hidden', 'true');
    }
  }

  document.getElementById('settings-button').addEventListener('click', function(){ app.toggleSettings(); });

  document.getElementById('pizzas').addEventListener('change', function(){ app.updatePizzas(); });

  document.getElementById('pizzas').addEventListener('focusout',
    function(){
      if (!this.value)
        app.restoreData();
    });

  var el = document.getElementById('hydration-input');
  el.addEventListener('input', function() {
    document.getElementById('hydration-value').innerHTML = this.value + "%";
  });
  el.addEventListener('input', app.updateHydration);
  el.addEventListener('change', app.updateHydration);

  el = document.getElementById('wpp-input');
  el.addEventListener('input', function() {
    document.getElementById('wpp-value').innerHTML = this.value + "g";
  });

  el.addEventListener('input', app.updateWeightPerPizza);

  el = document.getElementById('salt-input');
  el.addEventListener('input', function() {
    document.getElementById('salt-value').innerHTML = this.value + "%";
  });
  el.addEventListener('input', app.updateSaltPrc);

  el = document.getElementById('yeast-input');
  el.addEventListener('input', function() {
    document.getElementById('yeast-value').innerHTML = this.value + "%";
  });
  el.addEventListener('input', app.updateYeastPrc);

  // Init app
  app.restoreData();

})();
