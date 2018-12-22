# 四、网络层

## 概述
因为网络层是整个互联网的核心，因此应当让网络层尽可能简单。__网络层向上只提供简单灵活的、无连接的、尽最大努力交互的数据报服务。__

## 网际协议IP

与 IP 协议配套使用的还有三个协议：
- 地址解析协议 ARP（Address Resolution Protocol）

- 网际控制报文协议 ICMP（Internet Control Message Protocol）

- 网际组管理协议 IGMP（Internet Group Management Protocol

还有一个逆地址解析协议 RARP ，但已被淘汰不使用了。下图画出了这三个协议与网际协议IP的关系。在这一层中，ARP在最下面，因为IP经常要用到这个协议。ICMP 和 IGMP在着一层的上面，因为它们要使用IP协议。

<!-- <div align='center'>
  <img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/network/net-33.png' width=400>
</div> -->

将网络互相连接起来是要使用一些中间设备。根据中间设备所在的层次，可以有以下四种不同的中间设备: 
- 物理层使用的中间设备叫做 : `转发器`

- 数据链路层使用的中间设备叫做 : `网桥`

- 网络层使用的中间设备叫做 : `路由器`

- 在网络层以上使用的中间设备叫做 : `网关`

使用 IP 协议，可以把异构的物理网络连接起来，使得在网络层看起来好像是一个统一的网络。
<!-- <div align='center'>
  <img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/network/net-34.png' width=400>
</div> -->

## 分类的IP地址
IP地址就是给互联网上的每一台主机(或路由器)的每一个接口分配一个在全世界范围内是唯一的32位的标识符