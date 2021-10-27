import { PlanAdvantage } from "./plan-advantage.model";

export interface Plan {
    name:string;
    price:number;
    advantages?:PlanAdvantage[]
}