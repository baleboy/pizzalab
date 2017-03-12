export class Dough {

  pizzas: number;
  hydration: number;
  yeastPrc: number;
  saltPrc: number;
  weightPerPizza: number;
  prefermentPrc: number;
  prefermentHydration: number;
  prefermentYeastPrc: number;

  constructor() {
    this.pizzas = 4;
    this.hydration = 68;
    this.yeastPrc = 0.5;
    this.saltPrc = 1.5;
    this.weightPerPizza = 230;
    this.prefermentPrc = 0;
    this.prefermentHydration = 100;
    this.prefermentYeastPrc = 0.2;
  }

  fromJSON(obj: any) {
    this.pizzas = obj.pizzas;
    this.hydration = obj.hydration;
    this.yeastPrc =obj.yeastPrc;
    this.saltPrc = obj.saltPrc;
    this.weightPerPizza = obj.weightPerPizza;
    this.prefermentPrc = obj.prefermentPrc;
    this.prefermentHydration = obj.prefermentHydration;
    this.prefermentYeastPrc = obj.prefermentYeastPrc;
  }

  flour() {
    return Math.round(this.pizzas * this.weightPerPizza / (1 + (this.hydration + this.saltPrc + this.yeastPrc)/100));
  }

  water() {
    return Math.round(this.flour()/100 * this.hydration);
  }

  prefermentFlour() {
    return Math.round(this.flour() * this.prefermentPrc/100);
  }

  prefermentWater() {
    return Math.round(this.prefermentFlour()*this.prefermentHydration/100);
  }

  prefermentYeast() {
    return Math.round((this.prefermentFlour()*this.prefermentYeastPrc/100)*10)/10;
  }

  prefermentTotal() {
    return Math.round(this.prefermentFlour() +
    this.prefermentWater() + this.prefermentYeast());
  }

  salt() {
    return Math.round((this.flour()/100 * this.saltPrc)*10)/10;
  }

  yeast() {
    return Math.round((this.flour()/100 * this.yeastPrc)*10)/10;
  }

};
