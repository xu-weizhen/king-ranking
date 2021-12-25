import React, { Component } from 'react'
import * as PIXI from 'pixi.js'
import * as tf from '@tensorflow/tfjs'

import './scene.css'

import { Button } from '@arco-design/web-react';

import WelcomeScene from '../welcomeScene';
import FightScene from "../fightScene";
import TrainScene from '../trainScene';

import { model } from '../network/network';
import { VIDEO_WIDTH, VIDEO_HEIGHT } from './constant';

export default class Scene extends Component {

    state = {
        scene: 0,               // 当前场景 0:开始页面 1:训练网络 2:游戏页面 3:游戏结束页面
        textInfo: '即将开始',   // 页面提示信息
        count: 0,               // 成功躲避计数
        gameover: false,        // 游戏是否结束
        showGames: true,        // 是否显示游戏界面
        model: model,           // 神经网络
        stream: null,           // 视频流
        attackTime: 2000,       // 进攻等待时间
    }

    componentDidMount(){

        // 创建应用
        this.app = new PIXI.Application({});

        // 调整位置
        this.app.renderer.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";
        this.app.renderer.autoResize = true;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);

        // 添加到页面
        document.getElementById('scene').appendChild(this.app.view);

        // 添加场景
        this.welcomeScene = new WelcomeScene(this.app);
        this.fightScene = new FightScene(this.app);

        this.welcomeScene.showScene();
        this.fightScene.hideScene();

        // 绑定操作
        this.welcomeScene.button.on("pointerdown", (event) => {
            this.app.stage.removeChild(this.welcomeScene.scene);
            this.setState({scene: 1, showGames: false});
        })
    }

    reset = () => {
        // 重置游戏状态

        this.setState({
            textInfo: '即将开始',
            count: 0,
            gameover: false,
            scene: 2,
            attackTime: 2000,
        })

        // 随机生成戴达新位置
        let newPos = Math.round(Math.random());
        if(newPos === 0){
            this.fightScene.daida.reset(true);
        } else {
            this.fightScene.daida.reset(false);
        }
        
        // 开始攻击
        setTimeout(() => {
            this.gameAction();
        }, 2000);
    }

    trainedModel = (model) => {
        // 用于子组件将训练好网络传递给父组件
        this.setState({model})
    }

    finishTraining = () => {
        // 训练完成回调
        this.setState({scene: 2, showGames: true});
        this.fightScene.showScene();
        this.gameStart();
    }

    getStream = (stream) => {
        // 获取视频流
        this.setState({stream})
    }

    gameStart = () => {
        // 开始游戏

        this.video = document.getElementById("camera");

        // 设置视频流
        try {
            this.video.srcObject = this.state.stream;
        } catch (error) {
            this.video.src = this.state.stream;
        }

        // 开启第一次进攻
        setTimeout(() => {
            this.gameAction();
        }, this.state.attackTime);
        
    }

    gameAction = () => {
        // 开始攻击

        // 获取图片数据
        let context = document.getElementById("canvas_hidden").getContext("2d");

        context.drawImage(this.video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    
        let imgData_obj = context.getImageData(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        let imgData = imgData_obj.data; 

        let imgArr = []; 
        for(let i = 0; i < imgData.length; i += 4){
            imgArr.push(imgData[i], imgData[i + 1], imgData[i + 2])
        }


        // 神经网络处理图片
        let pre = this.state.model.predict(tf.tensor(imgArr, [1, 48, 48, 3]));
        let preValue = pre.arraySync()[0]

        // 波吉执行动作
        if(preValue[0] > preValue[1]){
            // 向上
            console.log(preValue, "up");
            this.setState({textInfo : "识别结果: 上"});
            if(!this.fightScene.boji.posUp){
                this.fightScene.boji.move();
                this.fightScene.boji.posUp = true;
            }
        } else {
            // 向下
            console.log(preValue, "down");
            this.setState({textInfo : "识别结果: 下"});
            if(this.fightScene.boji.posUp){
                this.fightScene.boji.move();
                this.fightScene.boji.posUp = false;
            }
        }

        // 判断游戏是否结束
        this.fightScene.daida.action(this.fightScene.boji.posUp);
        if(this.fightScene.daida.posUp === this.fightScene.boji.posUp){
            this.setState({gameover: true});
        } else {
            setTimeout(() => {
                this.newRound();
            }, 1000);
        }
    }

    newRound = () => {
        // 开始下一轮

        // 修改进攻等待时间
        let attackTime = this.state.attackTime;
        if(attackTime > 1000){
            attackTime -= 50;
        }

        // 修改躲避计数
        let count = this.state.count + 1;

        this.setState({attackTime, count});

        // 随机生成戴达新位置
        let newPos = Math.round(Math.random());
        if(newPos === 0){
            this.fightScene.daida.reset(true);
        } else {
            this.fightScene.daida.reset(false);
        }

        // 开启下一次攻击
        setTimeout(() => {
            this.gameAction();
        }, attackTime);
    }


    render() {
        return (
            <div>
                <div id='scene' style={{display: this.state.showGames? 'block': 'none'}}></div>
                <canvas id="canvas_hidden" width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{display: "none"}}></canvas>

                { this.state.scene === 1?
                    <TrainScene model={this.state.model} setModel={this.trainedModel} setFinish={this.finishTraining} setStream={this.getStream}/> :
                    <div></div>
                }

                <div id='bottomBox' style={{display: this.state.scene >= 2? "block":"none"}}>
                    <div id='gameInfoBox'>
                        <div id='buttonBox' style={{display: this.state.gameover? "block": "none"}}>
                            <Button size='large' onClick={this.reset}  style={{backgroundColor: "rgb(var(--gold-6))", color: "white"}} >重新开始</Button>
                        </div>
                        <video autoPlay id="camera" width="150" height="150" className='left' style={{display: this.state.gameover? "none": "block"}}></video>
                        <div id='gameInfo'>
                            <div>{this.state.textInfo}</div>
                            <div style={{display: this.state.gameover? "block":"none"}}>游戏结束</div>
                            <div>成功躲避: {this.state.count}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
