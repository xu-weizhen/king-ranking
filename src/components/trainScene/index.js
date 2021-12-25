import { Button, Progress } from '@arco-design/web-react';
import React, { Component } from 'react'
import * as tf from '@tensorflow/tfjs'

import { VIDEO_WIDTH, VIDEO_HEIGHT } from '../scene/constant';

import './index.css'

export default class TrainScene extends Component {

    state = {
        upPicCount: 0,      // 已经拍摄的图片数量
        downPicCount: 0,
        picUp: true,        // 当前正在拍摄的图片类别
        upPic: [],          // 图片数组
        downPic: [],
        state: 0,           // 当前状态 0:准备数据  1:训练中  2:训练完成
        trainProgress: 0,   // 训练进度
    }

    getUserMedia = (constraints, success, error) => {
        // 获取用户摄像头
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
        } else if (navigator.webkitGetUserMedia) {
            //webkit核心浏览器
            navigator.webkitGetUserMedia(constraints, success, error);
        } else if (navigator.mozGetUserMedia) {
            //Firefox浏览器
            navigator.mozGetUserMedia(constraints, success, error);
        } else if (navigator.getUserMedia) {
            //旧版API
            navigator.getUserMedia(constraints, success, error);
        }
    }

    success = (stream) => {
        // 获取用户摄像头成功的回调函数
        let video = document.getElementById("video");
        let compatibleURL = window.URL || window.webkitURL;         // 兼容的webkit核心浏览器

        // 设置视频源
        try {
            video.srcObject = stream;
            this.props.setStream(stream);
        } catch (error) {
            video.src = compatibleURL.createObjectURL(stream);     // 兼容旧版 API
            this.props.setStream(compatibleURL.createObjectURL(stream));
        }

        // 开启视频
        video.play();
    }

    error = (error) => {
        // 获取用户摄像头失败的回调函数
        alert('访问用户媒体设备失败: ', error.name, error.message);
    }


    getPic = () => {
        // 拍摄图片

        // 获取页面元素
        let video = document.getElementById("video");
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");

        // 绘制画面
        context.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

        // 获取图片像素值
        let imgData_obj = context.getImageData(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        let imgData = imgData_obj.data;

        // 写入图片数组
        let imgArr = [];
        for(let i = 0; i < imgData.length; i += 4){
            imgArr.push(imgData[i], imgData[i + 1], imgData[i + 2])
        }

        // 计数
        if(this.state.picUp){
            let upPicCount = this.state.upPicCount + 1
            this.setState({upPic: [...this.state.upPic, ...imgArr], upPicCount})

            if(upPicCount === 10){
                this.setState({picUp: false})
            }
        } else {
            let downPicCount = this.state.downPicCount + 1;
            imgArr =  [...this.state.downPic, ...imgArr];
            this.setState({downPic: imgArr, downPicCount})

            if(downPicCount === 10){
                this.setState({state: 1});
                this.trainModel([...this.state.upPic, ...imgArr]);
            }
        }
    }

    train = async (model, epoch, x, y) => {
        // 训练网络
        
        for(let i = 0; i < epoch; i++){
            const t = await model.fit(x, y, {epochs: 2});
            this.setState({trainProgress: ((i + 1) / epoch).toFixed(2) * 100})

            // 打印损失
            if(i % 10 === 0 || i === epoch - 1){
                console.log(i, t.history.loss[0]);
            }
        }
    }

    trainModel = async (imgArr) => {
        // 训练网络

        // 设置网络
        this.props.model.compile({loss: 'categoricalCrossentropy', optimizer: tf.train.adam(0.001), metrics: ['accuracy']});

        // 处理数据
        const x = tf.tensor(imgArr, [20, 48, 48, 3]);
        const y = tf.tensor([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                              0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ], [20, 2]);

        // 训练
        await this.train(this.props.model, 100, x, y);

        // 将模型保存到父组件
        this.props.setModel(this.props.model);

        this.setState({state: 2})
    }

    componentDidMount() {

        // 获取用户摄像头
        if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia ||
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
            this.getUserMedia({ video: { width: 480, height: 480 } }, this.success, this.error);
        } else {
            alert('你的浏览器不支持访问用户媒体设备!');
        }
    }

    render() {
        
        return (
            <div>
                <video id="video" autoPlay style={{width: window.innerWidth, height: window.innerWidth, display: this.state.state === 0? "block" : "none"}}></video>

                {
                    this.state.state === 0 ? 
                    (
                        this.state.picUp ?
                        (
                            <div id='infoBox'>
                                <div className='textInfo'>设置控制波吉 向上 躲避的动作</div> 
                                <div className='textInfo'>已拍摄{this.state.upPicCount}张，还需{10 - this.state.upPicCount}张</div>
                                <Button size='large' id="capture" onClick={this.getPic} style={{backgroundColor: "rgb(var(--gold-6))", color: "white"}}>拍照</Button>
                                <canvas id="canvas" width="48" height="48" style={{display: 'none'}}></canvas>
                            </div>
                        ) :
                        (
                            <div id='infoBox'>
                                <div className='textInfo'>设置控制波吉 向下 躲避的动作</div> 
                                <div className='textInfo'>已拍摄{this.state.downPicCount}张，还需{10 - this.state.downPicCount}张</div>
                                <Button size='large' id="capture" onClick={this.getPic} style={{backgroundColor: "rgb(var(--gold-6))", color: "white"}}>拍照</Button>
                                <canvas id="canvas" width="48" height="48" style={{display: 'none'}}></canvas>
                            </div>
                        )
                    ) :
                    (
                        this.state.state === 1?
                        (
                            <div id='trainingBox'>
                                <div className='textInfo'>神经网络训练中...</div>
                                <Progress type='circle' color='gold' trailColor="white" showText={false} percent={this.state.trainProgress} style={{ margin: 0}} />
                            </div>
                        ) : 
                        (
                            <div id='trainingBox'>
                                <div className='textInfo'>神经网络训练完成</div>
                                <Progress type='circle' percent={this.state.trainProgress} style={{ margin: 0 }} />
                                <div>
                                    <Button size='large' style={{ marginTop: 20, backgroundColor: "rgb(var(--gold-6))", color: "white"}} onClick={this.props.setFinish}>开始游戏</Button>
                                </div>
                            </div>
                        )
                    )
                }
            </div>
        )
    }
}
