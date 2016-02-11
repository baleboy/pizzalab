(function () {
  'use strict';

  var app = {
    hydration: 0.70,
    yeastPrc: 0.003,
    saltPrc: 0.015,
    weightPerPizza: 225
  };

  app.updateIngredients = function () {
    
    if (pizzas == 0)
      return;
      
    var pizzas = document.getElementById('pizzas').value;
    
    var flour = Math.round(pizzas * this.weightPerPizza / (1 + this.hydration));
    var water = pizzas * this.weightPerPizza - flour;
    var salt = Math.round(pizzas * this.weightPerPizza * this.saltPrc);
    var yeast = Math.round(pizzas * this.weightPerPizza * this.yeastPrc);
    
    document.getElementById('flour').innerHTML = flour.toString() + "g";
    document.getElementById('water').innerHTML = water.toString() + "g";
    document.getElementById('salt').innerHTML = salt.toString() + "g";
    document.getElementById('yeast').innerHTML = yeast.toString() + "g";
    
    localStorage.numberOfPizzas = pizzas;
  }
  
  document.getElementById('pizzas').addEventListener('input', function(){ app.updateIngredients();});
 
  var pizzas = localStorage.numberOfPizzas;
  document.getElementById('pizzas').value = pizzas ? pizzas : 4;
  
  // Init app
  app.updateIngredients();
})();
