import Pixi from "constants/pixi.const";
import { REEL_WIDTH, SYMBOL_SIZE } from "constants/size.const";

export default class  Footer {
    public footer: Pixi.Graphics = new Pixi.Graphics();
    private _app: Pixi.Application;
    private _reelContainer: Pixi.Container = new Pixi.Container();

    constructor(app: Pixi.Application) {
        this._app = app;
        this._app.stage.addChild(this._reelContainer);
        this._initFooter();
    }

    public AddElemToFooter(rc: Pixi.Container): void {
        this._reelContainer.addChild(rc);
    }

    private _initFooter(): void {
        const margin = (this._app.screen.height - SYMBOL_SIZE * 3) / 2;
        this._reelContainer.y = margin - 20;
        this._reelContainer.x = Math.round(this._app.screen.width - 20 - REEL_WIDTH * 5);

        const top = new Pixi.Graphics();
        top.beginFill(0x1099bb, 1);
        top.drawRect(0, 0, this._app.screen.width, margin);

        this.footer.beginFill(0, 1);
        this.footer.drawRect(0, SYMBOL_SIZE * 3 + margin, this._app.screen.width, margin);
        const style = new Pixi.TextStyle({
            fontFamily: 'Arial',
            fontSize: 14,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#00ff99'],
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        });

        const playText = new Pixi.Text('CLICK SPIN TO START', style);
        playText.x = Math.round((this.footer.width - playText.width) * 0.9);
        playText.y = this._app.screen.height - margin + Math.round((margin - playText.height) / 2);

        this.footer.addChild(playText);
        this._app.stage.addChild(top);
        this._app.stage.addChild(this.footer);
        this.footer.interactive = true;
        this.footer.buttonMode = true;
    }
}
