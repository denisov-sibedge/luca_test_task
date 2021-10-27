import { Author } from "./author.model";
import { ContentsItem } from "./contents-item.model";
import { DateRange } from "./data-range.model";
import { Duration } from "./duration.model";
import { Plan } from "./plan.model";

export interface Course {
    id:string;
    name:string;
    description:string;
    contents:ContentsItem[];
    plans:Plan[];
    sales?:DateRange;
    author:Author;
    coauthors?:Author[];
    duration?:Duration;
}








