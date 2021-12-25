import * as PIXI from 'pixi.js'
import {LINE1, LINE2} from '../scene/constant'

export default class Daida {
    constructor() {
        
        // 加载人物
        this.sprite1 = PIXI.Sprite.from("/static/images/king-ranking_daida1.png");
        this.sprite1.x = window.innerWidth - 96 - 30;
        this.sprite1.y = LINE1 - 23;

        this.sprite2 = PIXI.Sprite.from("/static/images/king-ranking_daida2.png");
        this.sprite2.x = window.innerWidth - 220;
        this.sprite2.y = LINE1 - 30;
        this.sprite2.visible = false;

        this.sprite3 = PIXI.Sprite.from("/static/images/king-ranking_daida3.png");
        this.sprite3.x = window.innerWidth - 133 - 200;
        this.sprite3.y = LINE1 - 30;
        this.sprite3.visible = false;

        this.sprite4 = PIXI.Sprite.from("/static/images/king-ranking_daida4.png");
        this.sprite4.x = 80;
        this.sprite4.y = LINE1 - 30;
        this.sprite4.visible = false;

        this.showing = 1;
        this.posUp = true;
    }

    add2stage(stage){
        // 元素添加到舞台
        stage.addChild(this.sprite1);
        stage.addChild(this.sprite2);
        stage.addChild(this.sprite3);
        stage.addChild(this.sprite4);
    }

    action(bojiPosUp){
        // 戴达进攻效果

        this.sprite1.visible = false;
        this.sprite2.visible = true;
        setTimeout(()=>{
            this.sprite2.visible = false;
            if(bojiPosUp === this.posUp){
                this.sprite4.visible = true;
            } else {
                this.sprite3.visible = true;
            }
        }, 800)
    }

    reset(posUp){
        // 重置戴达状态

        this.sprite3.visible = false;
        this.sprite4.visible = false;
        this.sprite1.visible = true;
        
        // 移动位置
        if(posUp !== this.posUp){
            if(posUp){
                let delta = LINE1 - LINE2;
                this.sprite1.y += delta;
                this.sprite2.y += delta;
                this.sprite3.y += delta;
                this.sprite4.y += delta;
            } else {
                let delta = LINE2 - LINE1;
                this.sprite1.y += delta;
                this.sprite2.y += delta;
                this.sprite3.y += delta;
                this.sprite4.y += delta;
            }
            this.posUp = posUp;
        }
    }
}