var http = require('http')
var qs = require('querystring')
http
  .createServer(function(req, res) {
    var body = ''
    req.on('data', function(chunk) {
      body += chunk
    })
    req.on('end', function() {
      res.writeHead(200)
      res.end('Done')
      console.log('接受的 name  : ', qs.parse(body).name)
    })
  })
  .listen(3001)
