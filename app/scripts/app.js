(function () {
  'use strict';

  var dough = {
    hydration: 70,
    yeastPrc: 0.003,
    saltPrc: 0.015,
    weightPerPizza: 225,
    pizzas: 4
  };
  
  dough.flour = function() {
   return Math.round(this.pizzas * this.weightPerPizza / (1 + this.hydration/100)); 
  }
  
  dough.water = function() {
    return this.pizzas * this.weightPerPizza - this.flour();
  }
  
  dough.salt = function() {
    return Math.round(dough.pizzas * dough.weightPerPizza * dough.saltPrc);
  }
  
  dough.yeast = function() {
    return Math.round(dough.pizzas * dough.weightPerPizza * dough.yeastPrc);
  }
  
  dough.setPizzas = function(pizzas) {
    dough.pizzas = pizzas;
  }
  
  dough.setHydration = function(hydration) {
    dough.hydration = hydration;
  }
   
  var app = {};

  app.refreshUi = function() {
    
    document.getElementById('flour').innerHTML = dough.flour().toString() + "g";
    document.getElementById('water').innerHTML = dough.water().toString() + "g";
    document.getElementById('salt').innerHTML = dough.salt().toString() + "g";
    document.getElementById('yeast').innerHTML = dough.yeast().toString() + "g";  
    document.getElementById('hydration-value').innerHTML = dough.hydration + "%";
    document.getElementById('pizzas').value = dough.pizzas ? dough.pizzas : 4;
    document.getElementById('hydration-input').value = dough.hydration ? dough.hydration : 65;
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
  
  app.restoreData = function () {
     dough.setPizzas(localStorage.numberOfPizzas);
     dough.setHydration(localStorage.hydration);
     this.refreshUi();
  }
      
  document.getElementById('pizzas').addEventListener('change', function(){ app.updatePizzas(); });
  
  document.getElementById('pizzas').addEventListener('focusout', 
    function(){ 
      if (!this.value)
        app.restoreData(); 
    });
  
  var hi = document.getElementById('hydration-input');
  hi.addEventListener('input', function() {
    document.getElementById('hydration-value').innerHTML = this.value + "%";  
  });
  hi.addEventListener('input', app.updateHydration);
  hi.addEventListener('change', app.updateHydration);
  
  // Init app
  app.restoreData();
  
})();
