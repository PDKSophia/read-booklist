# JavaScript 高级程序设计 - 第三版

## Chapter Twenty-Three

### 离线检测

通过 `navagator.online` 属性来知道设备是否在线或者离线。

```javascript
if (navagator.online) {
  // 正常工作
} else {
  // 执行离线状态时的任务
}
```

除 `navigator.onLine` 属性之外，为了更好地确定网络是否可用，HTML5 还定义了两个事件: online 和 offline。 当网络从离线变为在线或者从在线变为离线时，分别触发这两个事件。这两个事件在 window 对象上触发。

```javascript
  EventUtil: {
    /*
     * desc: 视情况而定使用不同的事件处理程序
     * @param : element，要操作的元素
     * @param : type，事件名称
     * @param : handler，事件处理程序函数
    */
    addHandler: function (element, type, handler) {
      if (element.addEventListener) { // DOM2级
        element.addEventListener(type, handler, false)
      } else if (element.attachEvent) { // IE级
        element.attachEvent(`on${type}`, handler)
      } else {
        element[`on${type}`] = handler // DOM0级
      }
    }
  }

  EventUtil.addHandler(window, 'online', function () {
    console.log('online')
  })

  EventUtil.addHandler(window, 'offline', function () {
    console.log('offline')
  })
```

> 为了检测应用是否离线，在页面加载后，最好先通过 navigator.onLine 取得初始的状态。然后，就是通过上述两个事件来确定网络连接状态是否变化。当上述事件触发时，navigator.onLine 属性的值也会改变，不过必须要手工轮询这个属性才能检测到网络状态的变化

### 应用缓存

HTML5 的应用缓存，或者简称为 `appcache` ，是专门为开发离线 Web 应用而设计的。Appcache 就是从浏览器的缓存中分出来的一块缓存区。要想在这个缓存中保存数据，可以使用一个描述文件(manifest file)，列出要下载和缓存的资源。比如:

```
  CACHE MANIFEST
  #Comment

  file.js
  file.css
```

> 在最简单的情况下，描述文件中列出的都是需要下载的资源，以备离线时使用。

要将描述文件与页面关联起来，可以在`<html>`中的 manifest 属性中指定这个文件的路径，例如:

```html
<html manifest="/offline.manifest"></html>
```

以上代码告诉页面，/offline.manifest 中包含着描述文件。这个文件的 MIME 类型必须是 `text/cache-manifest`。

虽然应用缓存的意图是确保离线时资源可用，但也有相应的 JavaScript API 让你知道它都在做什么。 这个 API 的核心是 `applicationCache` 对象，这个对象有一个 status 属性，属性的值是常量，表示应用缓存的如下当前状态。

- 0 : 无缓存，即没有与页面相关的应用缓存。

- 1 : 闲置，即应用缓存未得到更新。

- 2 : 检查中，即正在下载描述文件并检查更新。

- 3 : 下载中，即应用缓存正在下载描述文件中指定的资源。

- 4 : 更新完成，即应用缓存已经更新了资源，而且所有资源都已下载完毕，可以通过 swapCache() 来使用了。

- 5 : 废弃，即应用缓存的描述文件已经不存在了，因此页面无法再访问应用缓存。

应用缓存还有很多相关的事件，表示其状态的改变。以下是这些事件

- checking : 在浏览器为应用缓存查找更新时触发。

- error : 在检查更新或下载资源期间发生错误时触发。

- noupdate : 在检查描述文件发现文件无变化时触发。

- downloading : 在开始下载应用缓存资源时触发。

- progress : 在文件下载应用缓存的过程中持续不断地触发。

- updateready : 在页面新的应用缓存下载完毕且可以通过 swapCache()使用时触发。

- cached : 在应用缓存完整可用时触发。

一般来讲，这些事件会随着页面加载按上述顺序依次触发。不过，通过调用 `update()` 方法也可以手工干预，让应用缓存为检查更新而触发上述事件。

```javascript
applicationCache.update()
```

update()一经调用，应用缓存就会去检查描述文件是否更新(触发 checking 事件)，然后就像页面刚刚加载一样，继续执行后续操作。如果触发了 cached 事件，就说明应用缓存已经准备就绪，不会再发生其他操作了。如果触发了 updateready 事件，则说明新版本的应用缓存已经可用，而此时你需要调用 swapCache()来启用新应用缓存。

```javascript
EventUtil.addHandler(applicationCache, 'updateready', function() {
  applicationCache.swapCache()
})
```
