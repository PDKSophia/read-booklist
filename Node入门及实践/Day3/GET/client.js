var http = require('http')

http
  .request(
    {
      host: 'localhost',
      port: 3001,
      url: '/',
      method: 'GET'
    },
    function(res) {
      var body = ''
      res.setEncoding('utf8')
      res.on('data', function(chunk) {
        body += chunk
      })
      res.on('end', function() {
        console.log('请求得到 : ' + body)
      })
    }
  )
  .end()
