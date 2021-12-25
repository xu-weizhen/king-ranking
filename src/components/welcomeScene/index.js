import * as PIXI from 'pixi.js'

export default class WelcomeScene {
    constructor(app) {

        // 加载背景元素
        this.bg = PIXI.Sprite.from("/static/images/king-ranking_bg_welcome.jpg");
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;

        // 加载按钮元素
        this.button = PIXI.Sprite.from("/static/images/king-ranking_start.png");
        this.button.position.set(window.innerWidth / 2 - 80, window.innerHeight - 200);
        
        this.button.interactive = true;
        this.button.buttonMode = true;
        
        // 元素放入场景
        this.scene = new PIXI.Container();
        this.scene.addChild(this.bg);
        this.scene.addChild(this.button);

        // 舞台放入场景
        app.stage.addChild(this.scene);

        // 控制按钮闪烁
        let rate = 1.0;
        let up = true;

        app.ticker.add(() => {

            if(up){
                rate += 0.001
                if(rate >= 1.1){
                    up = !up 
                }
            } else {
                rate -= 0.001
                if(rate <= 0.9){
                    up = !up 
                }
            }
            
            this.button.scale.set(rate);
            this.button.position.set(window.innerWidth / 2 - this.button.width / 2, window.innerHeight -  this.button.height / 2 - 120)
        });
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
