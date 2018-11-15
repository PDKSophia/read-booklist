---
title: JavaScript高级程序设计 - 打卡第十一天
date: 2018-11-15 14:04:42
tags: card-11

---
# JavaScript高级程序设计 - 第三版

## Chapter Fifteen

### Canvas绘图
什么是canvas ？ HTML5 `<canvas>` 元素用于图形的绘制，通过脚本 (通常是JavaScript)来完成 , `<canvas>` 标签只是图形容器，必须使用脚本来绘制图形。`canvas` 元素本身是没有绘图能力的。所有的绘制工作必须在 JavaScript 内部完成

#### 基本用法
要使用`<canvas>`元素，必须先设置其 width 和 height 属性，指定可以绘图的区域大小。出现在开始和结束标签中的内容是后备信息

要在这块画布(canvas)上绘图，需要取得绘图上下文。而取得绘图上下文对象的引用，需要调用 getContext()方法并传入上下文的名字。传入 "2d" ，就可以取得 2D 上下文对象。

```javascript
  <canvas id="drawing" width=" 200" height="200"></canvas>

  var drawing = document.getElementById('drawing')
  if (drawing.getContext) {
    var context = drawing.getContext('2d')
  }
```

### 2D上下文
使用 2D 绘图上下文提供的方法，可以绘制简单的 2D 图形，比如矩形、弧线和路径。2D 上下文的坐标开始于`<canvas>`元素的左上角，原点坐标是(0,0)。所有坐标值都基于这个原点计算，x 值越大表示 越靠右，y 值越大表示越靠下。默认情况下，width 和 height 表示水平和垂直两个方向上可用的像素数目。

#### 填充和描边
2D 上下文的两种基本绘图操作是填充和描边。填充，就是用指定的样式(颜色、渐变或图像)填充图形; 描边，就是只在图形的边缘画线。这两个操作的取决属性为: `fillStyle` 和 `strokeStyle`。 这两个属性的值可以是字符串、渐变对象或模式对象，而且它们的默认值都是 "#000000"

```javascript
  var drawing = document.getElementById("drawing")
  //确定浏览器支持<canvas>元素 
  if (drawing.getContext) {
    var context = drawing.getContext("2d")
    context.strokeStyle = "red"
    context.fillStyle = "#0000ff"
  }
```
#### 绘制矩形
矩形是唯一一种可以直接在 2D 上下文中绘制的形状。与矩形有关的方法包括 fillRect()、 strokeRect() 和 clearRect()。这三个方法都能接收 4 个参数: 矩形的 x 坐标、矩形的 y 坐标、矩形宽度和矩形高度。这些参数的单位都是像素。

```javascript

  // fillRect()方法在画布上绘制的矩形会填充指定的颜色。填充的颜色通过 fillStyle 属 性指定

  var drawing = document.getElementById("drawing")
  //确定浏览器支持<canvas>元素 
  if (drawing.getContext) {
    var context = drawing.getContext("2d")
    //绘制红色矩形
    context.fillStyle = "#ff0000"
    context.fillRect(10, 10, 50, 50)

    //绘制半透明的蓝色矩形
    context.fillStyle = "rgba(0,0,255,0.5)"
    context.fillRect(30, 30, 50, 50)
  }

  // 结果是绘制一个红色填充和蓝色填充的矩形
  
```
```javascript

  // strokeRect()方法在画布上绘制的矩形会使用指定的颜色描边。描边颜色通过 strokeStyle 属性指定


  var drawing = document.getElementById("drawing")
  //确定浏览器支持<canvas>元素 
  if (drawing.getContext) {
    var context = drawing.getContext("2d")
    //绘制红色矩形
    context.strokeStyle = "#ff0000"
    context.strokeRect(10, 10, 50, 50)

    //绘制半透明的蓝色矩形
    context.strokeStyle = "rgba(0,0,255,0.5)"
    context.strokeRect(30, 30, 50, 50)
  }

  // 结果是绘制一个红色边框和蓝色边框的矩形
```
clearRect()方法用于清除画布上的矩形区域。本质上，这个方法可以把绘制上下文中的某 一矩形区域变透明。通过绘制形状然后再清除指定区域，就可以生成有意思的效果，例如把某个形状切掉一块

```javascript

  // strokeRect()方法在画布上绘制的矩形会使用指定的颜色描边。描边颜色通过 strokeStyle 属性指定


  var drawing = document.getElementById("drawing")
  //确定浏览器支持<canvas>元素 
  if (drawing.getContext) {
    var context = drawing.getContext("2d")
    //绘制红色矩形
    context.fillStyle = "#ff0000"
    context.fillRect(10, 10, 50, 50)

    //绘制半透明的蓝色矩形
    context.fillStyle = "rgba(0,0,255,0.5)"
    context.fillRect(30, 30, 50, 50)

    // 在两个矩形重叠的地方清除一个小矩形
    context.clearRect(40, 40, 10, 10) 
  }

  // 结果是中间会出现一块填充色是白色的小矩形
```

#### 绘制路径
要绘制路径，首先必须调用 beginPath()方法，表示要开始 绘制新路径。然后，再通过调用下列方法来实际地绘制路径

- arc(x, y, radius, startAngle, endAngle, counterclockwise): 以 `(x, y)` 为圆心绘制一条弧线，弧线半径为 radius，起始和结束角度(用弧度表示)分别为 startAngle 和 endAngle。最后一个参数表示 startAngle 和 endAngle 是否按逆时针方向计算，值为 false 表示按顺时针方向计算。

- arcTo(x1, y1, x2, y2, radius): 从上一点开始绘制一条弧线，到 `(x2, y2)` 为止，并且以给定的半径 radius 穿过(x1,y1)。

- bezierCurveTo(c1x, c1y, c2x, c2y, x, y): 从上一点开始绘制一条曲线，到 `(x, y)` 为止，并且以(c1x, c1y)和(c2x, c2y)为控制点。

- lineTo(x, y): 从上一点开始绘制一条直线，到(x,y)为止。

- moveTo(x, y): 将绘图游标移动到(x,y)，不画线。

- quadraticCurveTo(cx, cy, x, y): 从上一点开始绘制一条二次曲线，到(x,y)为止，并
且以(cx,cy)作为控制点。

- rect(x, y, width, height): 从点(x,y)开始绘制一个矩形，宽度和高度分别由 width 和
height 指定。这个方法绘制的是矩形路径，而不是 strokeRect()和 fillRect()所绘制的独
立的形状。

创建了路径后，接下来有几种可能的选择。如果想绘制一条连接到路径起点的线条，可以调用 closePath()。如果路径已经完成，你想用 fillStyle 填充它，可以调用 fill()方法。另外，还可以调用 stroke()方法对路径描边，描边使用的是 strokeStyle。最后还可以调用 clip()，这个方法可以在路径上创建一个剪切区域。

```javascript
  // 绘制一个不带数字的时钟
 
  var drawing = document.getElementById("drawing")
  
  //确定浏览器支持<canvas>元素 
  if (drawing.getContext) {
    var context = drawing.getContext("2d")
    
    // 开始路径
    context.beginPath()

    // 绘制外圆
    context.arc(100, 100, 99, 0, Math.PI * 2, false)

    // 绘制内圆
    context.moveTo(194, 100)
    context.arc(100, 100, 94, 0, Math.PI * 2, false)

    // 绘制分针
    context.moveTo(100, 100)
    context.lineTo(100, 15)

    // 绘制时针
    context.moveTo(100, 100)
    context.lineTo(35, 100)

    // 描边路径
    context.stroke()
  }
```

#### 绘制文本
绘制文本主要有两个方法: `fillText()`和 `strokeText()`。这两个方法都可以接收 4 个参数: 要绘制的文本字符串、x坐标、y坐标、可选的最大像素宽度。而且，这两个方法都以下列 3 个属性为基础。
- font: 表示文本样式、大小及字体，用 CSS 中指定字体的格式来指定，例如"10px Arial"。

- textAlign: 表示文本对齐方式。可能的值有"start"、"end"、"left"、"right"和"center"。

- textBaseline: 表示文本的基线。可能的值有"top"、"hanging"、"middle"、"alphabetic"、"ideographic"和"bottom"。

```javascript
  // 绘制一个带数字的时钟
 
  var drawing = document.getElementById("drawing")
  
  //确定浏览器支持<canvas>元素 
  if (drawing.getContext) {
    var context = drawing.getContext("2d")
    
    // 开始路径
    context.beginPath()

    // 绘制外圆
    context.arc(100, 100, 99, 0, Math.PI * 2, false)

    // 绘制内圆
    context.moveTo(194, 100)
    context.arc(100, 100, 94, 0, Math.PI * 2, false)

    // 绘制分针
    context.moveTo(100, 100)
    context.lineTo(100, 15)

    // 绘制时针
    context.moveTo(100, 100)
    context.lineTo(35, 100)

    context.font = "bold 14px Arial"
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillText("12", 100, 20)
    // 描边路径
    context.stroke()
  }

```
#### 变换
可以通过如下方法来修改变换矩阵。
- rotate(angle): 围绕原点旋转图像 angle 弧度。

- scale(scaleX, scaleY): 缩放图像，在 x 方向乘以 scaleX，在 y 方向乘以 scaleY。scaleX和scaleY 的默认值都是 1.0。 

- translate(x,y):将坐标原点移动到(x,y)。执行这个变换之后，坐标(0,0)会变成之前由(x,y)表示的点。

- transform(m1_1, m1_2, m2_1, m2_2, dx, dy): 直接修改变换矩阵，方式是乘以如下矩阵
```
  m1_1   m1_2   dx
  m2_1   m2_2   dy
  0      0      1
```
- setTransform(m1_1, m1_2, m2_1, m2_2, dx, dy): 将变换矩阵重置为默认状态，然后再调用 transform()。

#### 绘制图像
2D 绘图上下文内置了对图像的支持。如果你想把一幅图像绘制到画布上，可以使用 drawImage() 方法。

drawImage()方法的这种调 用方式总共需要传入 9 个参数: 要绘制的图像、源图像的 x 坐标、源图像的 y 坐标、源图像的宽度、源 图像的高度、目标图像的 x 坐标、目标图像的 y 坐标、目标图像的宽度、目标图像的高度。 例如:

```javascript
  context.drawImage(image, 0, 10, 50, 50, 0, 100, 40, 60)
```
#### 阴影
- shadowColor: 用 CSS 颜色格式表示的阴影颜色，默认为黑色。 

- shadowOffsetX: 形状或路径 x 轴方向的阴影偏移量，默认为 0。 

- shadowOffsetY: 形状或路径 y 轴方向的阴影偏移量，默认为 0。 

- shadowBlur: 模糊的像素数，默认 0，即不模糊。

```javascript
  var context = drawing.getContext("2d")
  //设置阴影
  context.shadowOffsetX = 5 
  context.shadowOffsetY = 5
  context.shadowBlur = 4 
  context.shadowColor = "rgba(0, 0, 0, 0.5)"
```
#### 渐变
渐变由 CanvasGradient 实例表示，很容易通过 2D 上下文来创建和修改。要创建一个新的线性渐变，可以调用 createLinearGradient()方法。这个方法接收 4 个参数: 起点的 x 坐标、起点的 y 坐标、终点的 x 坐标、终点的 y 坐标。调用这个方法后，它就会创建一个指定大小的渐变，并返回 CanvasGradient 对象的实例。

创建了渐变对象后，下一步就是使用 addColorStop()方法来指定色标。这个方法接收两个参数: 色标位置和 CSS 颜色值。色标位置是一个 0(开始的颜色)到 1(结束的颜色)之间的数字。

```javascript
  var gradient = context.createLinearGradient(30, 30, 70, 70)
  gradient.addColorStop(0, "white")
  gradient.addColorStop(1, "black")
```
#### 使用图像数据 (也就是吸取图片的颜色当作主题色调)
2D 上下文的一个明显的长处就是，可以通过 `getImageData()` 取得原始图像数据。这个方法接收 4 个参数:要取得其数据的画面区域的 x 和 y 坐标以及该区域的像素宽度和高度。

例如，要取得左上角 坐标为(10,5)、大小为 50×50 像素的区域的图像数据，可以使用以下代码:
```javascript
  var imageData = context.getImageData(10, 5, 50, 50)
```

这里返回的对象是 ImageData 的实例。每个 ImageData 对象都有三个属性:width、height 和 data。其中 data 属性是一个数组，保存着图像中每一个像素的数据。 在 data 数组中，每一个像素用4个元素来保存，分别表示红、绿、蓝和透明度值。因此，第一个像素的数据就保存在数组的第 0 到第 3 个元素中，例如:
```javascript
  var data = imageData.data
  red = data[0]
  green = data[1]
  blue = data[2]
  alpha = data[3]
```

<strong>我们在豆瓣上，看电影，里边最经典的一个就是，不同电影，进入的页面主题色调不同</strong>，应该是在进入电影详情页面的时候，通过canvas获取到图片的数据，从中将所有的像素获取，求得平均值，应用该平均值设为主题色调

```javascript
    var drawing = document.getElementById("drawing");
    var context = drawing.getContext("2d"),
      image = document.images[0],
      imageData, data,
      i, len, average,
      red, green, blue, alpha;

    //绘制原始图像 
    context.drawImage(image, 0, 0);

    //取得图像数据
    imageData = context.getImageData(0, 0, image.width, image.height); 
    data = imageData.data;
    for (i = 0, len = data.length; i < len; i += 4) {
      red = data[i];
      green = data[i+1];
      blue = data[i+2];
      alpha = data[i+3];

      //求得 rgb 平均值
      average = Math.floor((red + green + blue) / 3);
      //设置颜色值，透明度不变 
      data[i] = average;
      data[i+1] = average;
      data[i+2] = average;
    }

    //回写图像数据并显示结果
    imageData.data = data; 
    context.putImageData(imageData, 0, 0);
  }
```
