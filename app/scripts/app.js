(function () {
  'use strict';

  var dough = {
    hydration: 70,
    yeastPrc: 0.003,
    saltPrc: 0.015,
    weightPerPizza: 225,
    pizzas: 4,
    flour: 0,
    water: 0,
    salt: 0,
    yeast: 0
  };
  
  dough.update = function() {
    
    dough.flour = Math.round(dough.pizzas * dough.weightPerPizza / (1 + dough.hydration/100));
    dough.water = dough.pizzas * dough.weightPerPizza - dough.flour;
    dough.salt = Math.round(dough.pizzas * dough.weightPerPizza * dough.saltPrc);
    dough.yeast = Math.round(dough.pizzas * dough.weightPerPizza * dough.yeastPrc);
  }
  
  dough.update();
  
  var app = {};

  app.updateIngredients = function () {
    
    var pizzas = document.getElementById('pizzas').value;
    
    if (!pizzas) 
      return;
    
    dough.pizzas = pizzas;
    localStorage.numberOfPizzas = pizzas;
    
    dough.hydration = document.getElementById('hydration-input').value;
    localStorage.hydration = dough.hydration;
    
    dough.update();
    
    document.getElementById('flour').innerHTML = dough.flour.toString() + "g";
    document.getElementById('water').innerHTML = dough.water.toString() + "g";
    document.getElementById('salt').innerHTML = dough.salt.toString() + "g";
    document.getElementById('yeast').innerHTML = dough.yeast.toString() + "g";
    
  }
  
  app.restoreData = function () {
     dough.pizzas = localStorage.numberOfPizzas;
     document.getElementById('pizzas').value = dough.pizzas ? dough.pizzas : 4;
     dough.hydration = localStorage.hydration;
     document.getElementById('hydration-input').value = dough.hydration ? dough.hydration : 65;
     document.getElementById('hydration-value').innerHTML = dough.hydration + "%";
     this.updateIngredients();
  }
      
  document.getElementById('pizzas').addEventListener('input', function(){ app.updateIngredients(); });
  
  document.getElementById('pizzas').addEventListener('focusout', 
    function(){ 
      if (!this.value)
        app.restoreData(); 
    });
  
  var hi = document.getElementById('hydration-input');
  hi.addEventListener('input', function() {
    document.getElementById('hydration-value').innerHTML = this.value + "%";  
  });
  hi.addEventListener('input', app.updateIngredients);
  hi.addEventListener('change', app.updateIngredients);
  
  // Init app
  app.restoreData();
  
})();
