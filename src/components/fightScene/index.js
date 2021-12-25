import * as PIXI from 'pixi.js'

import Boji from "../person/boji";
import Daida from "../person/daida";

export default class FightScene {
    constructor(app) {

        // 加载背景
        this.background = PIXI.Sprite.from("/static/images/king-ranking_bg_fight.jpg");
        this.background.width = window.innerWidth;
        this.background.height = window.innerHeight;

        // 创建元素
        this.boji = new Boji();
        this.daida = new Daida();

        // 创建容器
        this.scene = new PIXI.Container();

        // 元素添加到容器
        this.scene.addChild(this.background);
        this.boji.add2stage(this.scene);
        this.daida.add2stage(this.scene);

        // 容器添加到舞台
        app.stage.addChild(this.scene);   
    }

    showScene(){
        // 显示场景
        this.scene.visible = true;
    }

    hideScene(){
        // 隐藏场景
        this.scene.visible = false;
    }
}