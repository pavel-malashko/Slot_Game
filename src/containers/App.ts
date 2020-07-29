import Pixi from 'constants/pixi.const';
import { Howl } from 'howler';
import { backout, lerp } from 'util/util';
import { pathImage, pathSound } from '../constants/path.const';
import { REEL_WIDTH, SYMBOL_SIZE } from '../constants/size.const';
import { IReel, ITween } from './../models/models';
import { tweenTo } from './../util/util';
import Footer from './Footer';

export default class App {
    public app: Pixi.Application;
    public footerContainer: Footer;
    private _reels: IReel[] = [];
    private _slotTextures: Pixi.Texture[] = [];
    private _running: boolean = false;
    private _tweening: ITween[] = [];
    private _removeTweens: ITween[];

    constructor() {
        this.app = new Pixi.Application({ backgroundColor: 0x1099bb, width: 840});
        const footerComp = new Footer(this.app);
        this.footerContainer = footerComp;
        document.body.appendChild(this.app.view);
        this._loadImages();
        this.app.loader.load(this.onAssetsLoaded.bind(this));
        this._subscribeToUpdate();
    }

    public onAssetsLoaded(): void {
        this._buildReels();
        this.buttonStateInit();
        this._subscribeToAnimate();
    }

    public startPlay(): void {

        if (this._running) {
            return;
        }
        this._running = true;

        for (let i = 0; i < this._reels.length; i++) {
            const r = this._reels[i];
            const target = r.position + 10 + i * 5;
            const time = 2500 + i * 600;
            if (i === this._reels.length - 1) {
                this._running = false;
            }
            const tween = tweenTo(r, target, time, backout(0.5), null);
            this._tweening.push(tween);
        }
    }

    public buttonStateInit(): void {
        this.footerContainer.footer.addListener("pointerdown", () => {
            this.footerContainer.footer.visible = false;
            this.startPlay();
        });
    }

    private _buildSymbols(reel: IReel, rc: Pixi.Container): void {
        for (let index = 1; index < 9; index++) {
            this._slotTextures.push(Pixi.Texture.from(`${index}`));
        }
        for (let j = 0; j < 4; j++) {
            const symbol = new Pixi.Sprite(this._slotTextures[Math.floor(Math.random() * this._slotTextures.length)]);
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE + 10 / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }
    }

    private _loadImages(): void {
        for (let index = 1; index < 9; index++) {
            this.app.loader.add(`${index}`, `../${pathImage}_${index}.png`);
        }
    }

    private _buildReels(): void {
        for (let i = 0; i < 5; i++) {
            const rc = new Pixi.Container();
            rc.x = i * REEL_WIDTH;

            this.footerContainer.AddElemToFooter(rc);

            const reel: IReel = {
                container: rc,
                symbols: [],
                position: 0,
                previousPosition: 0,
                blur: new Pixi.filters.BlurFilter()
            };
            reel.blur.blurX = 0;
            reel.blur.blurY = 0;
            rc.filters = [reel.blur];
            this._buildSymbols(reel, rc);
            this._reels.push(reel);
        }
    }

    private _subscribeToAnimate(): void {
        this.app.ticker.add(() => {
                for (const real of this._reels) {
                    real.blur.blurY = (real.position - real.previousPosition) * 8;
                    real.previousPosition = real.position;
                    for (let j = 0; j < real.symbols.length; j++) {
                        const s = real.symbols[j];
                        const prevy = s.y;
                        s.y = ((real.position + j) % real.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                        if (s.y < 0 && prevy > SYMBOL_SIZE) {
                            s.texture = this._slotTextures[Math.floor(Math.random() * this._slotTextures.length)];
                            s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE + 10 / s.texture.width, SYMBOL_SIZE / s.texture.height);
                            s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                        }
                    }
                }
            });
    }

    private _subscribeToUpdate(): void {
        this.app.ticker.add(() => {
            const now = Date.now();
            this._removeTweens = [];
            for (let i = 0; i < this._tweening.length; i++) {
                const t = this._tweening[i];
                const phase = Math.min(1, (now - t.start) / t.time);
                t.reel.position = lerp(t.propertyBeginValue, t.target, t.easing(phase));
                if (t.change) {
                    t.change(t);
                }
                if (phase === 1) {
                    t.reel.position = t.target;
                    this._callSoundFall();
                    if (i + 1 === this._tweening.length) {
                        this.footerContainer.footer.visible = true;
                    }
                    if (t.complete) {
                        t.complete(t);
                    }
                    this._removeTweens.push(t);
                }
            }
            for (const item of this._removeTweens) {
                this._tweening.splice(this._tweening.indexOf(item), 1);
            }
        });
    }
    private _callSoundFall(): void{
        const idTrack = Math.floor(Math.random() +1 * 5);
        const sound = new Howl({
            src: [`${pathSound}/Reel_Stop_${idTrack}.mp3`]
        });
        sound.play();
    }
}
