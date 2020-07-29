import { IReel, ITween } from "@models/models";

export const lerp = (a1: number, a2: number, t: any) =>  a1 * (1 - t) + a2 * t;

export const backout = (amount: number) =>  (t: number) => (t * ((amount + 1) * t + amount) + 1);

export const tweenTo = (reel: IReel, target: number, time: number, easing?: (arg: number) => {}, onchange?: (arg: ITween) => {}, oncomplete?: (arg: ITween) => {}): ITween => {
    return {
        reel,
        propertyBeginValue: reel.position,
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now()
    };
};
