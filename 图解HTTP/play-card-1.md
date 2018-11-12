---
title: 图解HTTP - 打卡第一天
date: 2018-11-05 20:56:05
tags: card-1、HTTP的诞生、TCP、DNS、IP的基本了解、

---

# 图解HTTP 

## Chapter One

### HTTP的诞生
超文本传输协议；HTTP与1990年出世，那时候属于HTTP/0.9， 后来，HTTP正式被作为标准是在1996年5月，版本为HTTP/1.0，在1997年1月，版本为HTTP/1.1，现在的HTTP版本为HTTP/2.0，你可能想了解一下 [HTTP1.0、1.1、2.0的区别](https://github.com/PDKSophia/blog.io/blob/master/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C%E7%AF%87-HTTP1.0%20%E3%80%81HTTP1.1%20%E5%92%8C%20HTTP2.0%E7%9A%84%E5%8C%BA%E5%88%AB.md)

### TCP/IP的了解
通常使用的网络是在TCP/IP协议族的基础上运作的，而HTTP属于它内部的一个子集

计算机与网络设备要相互通信，双方就必须基于相同的方法。不同的硬件、操作系统之间的通信，所有的这一切都需要一种规则，而我们把这种规则称为: *协议*

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-1.png' width=500>

<strong>TCP/IP是互联网相关的各类协议族的总称</strong>

TCP/IP协议族里重要的一点是: 分层。依次分为: 应用层、传输层、网络层和数据链路层

- 应用层: 决定了向用户提供应用服务时通信的活动。(FTP、DNS、HTTP)

- 传输层: 提供处于网络连接中的两台计算机之间的数据传输。（UTP、TCP）

- 网络层: 处理在网络上流动的数据包。数据包是网络传输的最小数据单位，该层规定了通过怎样的路径到达对方计算机，并把数据包传送给对方

- 数据链路层: 用来处理连接网络的硬件部分。包括控制操作系统、硬件的设备驱动、网络适配器(网卡)

利用TCP/IP协议族进行网络通信时，会通过分层顺序与对方进行通信。发送端从应用层往下走，接收端则往应用层往上走。你可能想了解一下 : [从输入URL到页面加载完成的过程](https://github.com/PDKSophia/blog.io/blob/master/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C%E7%AF%87-%E4%BB%8E%E8%BE%93%E5%85%A5URL%E5%88%B0%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E5%AE%8C%E6%88%90%E8%BF%87%E7%A8%8B.md)

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-2.png' width=500 height=550>

首先作为发送端的客户端在应用层(HTTP协议)发出一个想看某个Web页面的HTTP请求，然后在传输层(TCP协议)把从应用层处收到的数据(HTTP请求报文)进行分割，并在各个报文上打上标记序号及端口号后转发给网络层，在网络层(IP协议)，增加作为通信目的地的MAC地址后转发给链路层。

接收端的服务器在链路层接收到数据，按序往上层发送，一直到应用层。当传输到应用层，才能算真正接收到有客户端发送过来的HTTP请求

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-3.png' width=600 height=650>

发送端在层与层之间传输数据时，每经过一层时必定会被打上一个该层所属的首部信息。反之，接收端在层与层传输数据时，每经过一层时会把对应的首部消去。

#### 负责传输的IP协议
IP 位于网络层。记住，IP是一种协议的名称，很多人会把“IP”和“IP地址”搞混

IP协议的作用是把各种数据包传送给对方，而要保证确实传送到对方的手中，就需要满足两个条件 : `IP地址` 和 `MAC地址`

IP地址可以和MAC地址进行匹配。IP地址可变换，但是MAC地址是不可更改

> 什么是MAC地址？根据以太网规定，连入网络的所有设备，都必须具有"网卡"接口。数据包必须是从一块网卡，传送到另一块网卡。网卡的地址，就是数据包的发送地址和接收地址，这叫做MAC地址。每块网卡出厂的时候，都有一个全世界独一无二的MAC地址，长度是48个二进制位，通常用12个十六进制数表示

使用ARP协议，凭借MAC地址进行通信。不太理解的可以去看看阮一峰老师的讲解: [互联网协议入门](http://www.ruanyifeng.com/blog/2012/05/internet_protocol_suite_part_i.html)

IP间的通信依赖于MAC地址，在网络中，通信的双方很少会出现在同一个局域网内，通常是经过多台计算机和网络设备中转才能连接到双方。而在进行中转时，会利用下一站中转设备的MAC地址来搜索下一个中转目标。<strong>ARP是一种以解析地址的协议，根据通信方的IP地址就可以反查出对应的MAC地址</strong>

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-4.png' width=600 height=650>

#### 确保可靠性的TCP协议
TCP 位于传输层，提供可靠的字节流服务。

所谓的字节流服务是指: 将大块数据分割成以报文段为单位的数据包进行管理。

可靠的服务是指: 能够把数据准确可靠地传给对方

那么怎样确保能够准确无误地传送呢？ TCP协议采用了[三次握手和四次挥手](https://github.com/PDKSophia/blog.io/blob/master/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C%E7%AF%87-TCP%E7%9A%84%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B%E5%92%8C%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B.md)

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-5.png' width=650 height=480>

#### 负责域名解析的DNS服务
DNS：位于应用层，它提供域名到IP地址间的解析服务

DNS协议提供通过域名查找IP地址，或逆向从IP地址反查域名的服务

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-6.png' width=700 height=550>

### URI和RUL

- URI : 统一资源标识符， 用于标识某一互联网资源

- URL : 统一资源定位符，用于表示资源的地点

#### URI格式
<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-7.png'>
