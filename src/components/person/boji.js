import * as PIXI from 'pixi.js'
import {LINE1, LINE2} from '../scene/constant'

export default class Boji {
    constructor(){

        // 加载人物
        this.sprite = PIXI.Sprite.from("/static/images/king-ranking_boji.png");

        // 波吉位置
        this.pos1 = [10, LINE1];
        this.pos2 = [10, LINE2];

        this.posUp = true;
        this.sprite.position.set(this.pos1[0], this.pos1[1]);
    }

    add2stage(stage){
        // 将波吉放入场景
        stage.addChild(this.sprite);
    }

    move(){
        // 波吉移动
        if(this.posUp){
            this.sprite.position.set(this.pos2[0], this.pos2[1]);
        } else {
            this.sprite.position.set(this.pos1[0], this.pos1[1]);
        }
        this.posUp = !this.posUp;
    }
}