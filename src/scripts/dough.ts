export class Dough {

  hydration: number;
  yeastPrc: number;
  saltPrc: number;
  weightPerPizza: number;
  prefermentPrc: number;
  prefermentHydration: number;
  prefermentYeastPrc: number;

  constructor() {
    this.hydration = 68;
    this.yeastPrc = 0.5;
    this.saltPrc = 1.5;
    this.weightPerPizza = 230;
    this.prefermentPrc = 0;
    this.prefermentHydration = 100;
    this.prefermentYeastPrc = 0.2;
  }

  fromJSON(obj: any) {
    this.hydration = obj.hydration;
    this.yeastPrc =obj.yeastPrc;
    this.saltPrc = obj.saltPrc;
    this.weightPerPizza = obj.weightPerPizza;
    this.prefermentPrc = obj.prefermentPrc;
    this.prefermentHydration = obj.prefermentHydration;
    this.prefermentYeastPrc = obj.prefermentYeastPrc;
  }

  flour(pizzas: number) {
    return Math.round(pizzas * this.weightPerPizza / (1 + (this.hydration + this.saltPrc + this.yeastPrc)/100));
  }

  water(pizzas: number) {
    return Math.round(this.flour(pizzas)/100 * this.hydration);
  }

  prefermentFlour(pizzas: number) {
    return Math.round(this.flour(pizzas) * this.prefermentPrc/100);
  }

  prefermentWater(pizzas: number) {
    return Math.round(this.prefermentFlour(pizzas)*this.prefermentHydration/100);
  }

  prefermentYeast(pizzas: number) {
    return Math.round((this.prefermentFlour(pizzas)*this.prefermentYeastPrc/100)*10)/10;
  }

  prefermentTotal(pizzas: number) {
    return Math.round(this.prefermentFlour(pizzas) +
    this.prefermentWater(pizzas) + this.prefermentYeast(pizzas));
  }

  salt(pizzas: number) {
    return Math.round((this.flour(pizzas)/100 * this.saltPrc)*10)/10;
  }

  yeast(pizzas: number) {
    return Math.round((this.flour(pizzas)/100 * this.yeastPrc)*10)/10;
  }

};
