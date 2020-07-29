import * as Pixi from 'pixi.js';

export interface IReel {
    container: Pixi.Container;
    symbols: Pixi.Sprite[];
    position: number;
    previousPosition: number;
    blur: Pixi.filters.BlurFilter;
}

export interface ITween {
    change: (number: ITween) => {};
    complete: (number: ITween) => {};
    easing: (number: number) => {};
    reel: IReel;
    propertyBeginValue: number;
    start: number;
    target: number;
    time: number;
}
