import * as tf from '@tensorflow/tfjs'

export const model = tf.sequential();

// block1 [48, 48, 3] -> [24, 24, 8]
model.add(tf.layers.depthwiseConv2d({
    inputShape: [48, 48, 3],
    kernelSize: 3,
    strides: 2,
    padding: 'same',
    activation: 'relu6',
    kernelInitializer: 'varianceScaling'
}));

model.add(tf.layers.batchNormalization());

model.add(tf.layers.conv2d({
    kernelSize: 1,
    filters: 8,
    strides: 1,
    kernelInitializer: 'varianceScaling'
}));

// block2 [24, 24, 8] -> [12, 12, 16]

model.add(tf.layers.batchNormalization());

model.add(tf.layers.depthwiseConv2d({
    kernelSize: 3,
    strides: 2,
    padding: 'same',
    activation: 'relu6',
    kernelInitializer: 'varianceScaling'
}));

model.add(tf.layers.batchNormalization());

model.add(tf.layers.conv2d({
    kernelSize: 1,
    filters: 16,
    strides: 1,
    kernelInitializer: 'varianceScaling'
}));


// block3 [12, 12, 16] -> [6, 6, 24]
model.add(tf.layers.depthwiseConv2d({
    kernelSize: 3,
    strides: 2,
    padding: 'same',
    activation: 'relu6',
    kernelInitializer: 'varianceScaling'
}));

// model.add(tf.layers.batchNormalization());

model.add(tf.layers.conv2d({
    kernelSize: 1,
    filters: 24,
    strides: 1,
    kernelInitializer: 'varianceScaling'
}));


// block4 [6, 6, 24] -> [3, 3, 28]
model.add(tf.layers.depthwiseConv2d({
    kernelSize: 3,
    strides: 2,
    padding: 'same',
    activation: 'relu6',
    kernelInitializer: 'varianceScaling'
}));

// model.add(tf.layers.batchNormalization());

model.add(tf.layers.conv2d({
    kernelSize: 1,
    filters: 28,
    strides: 1,
    kernelInitializer: 'varianceScaling'
}));


// block5 [3, 3, 28] -> [1, 1, 32]
model.add(tf.layers.depthwiseConv2d({
    kernelSize: 3,
    strides: 2,
    padding: 'same',
    activation: 'relu6',
    kernelInitializer: 'varianceScaling'
}));

// model.add(tf.layers.batchNormalization());

model.add(tf.layers.conv2d({
    kernelSize: 1,
    filters: 32,
    strides: 1,
    kernelInitializer: 'varianceScaling'
}));


model.add(tf.layers.flatten());

model.add(tf.layers.dense({
    units: 2,
    kernelInitializer: 'varianceScaling',
    activation: 'softmax'
}));
