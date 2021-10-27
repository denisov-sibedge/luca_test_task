import { ContentsItemType } from "./contents-item-type.enum";
import { Duration } from "./duration.model";

export interface ContentsItem {
    name:string;
    duration?:Duration;
    type:ContentsItemType;
}
