var http = require('http')
var qs = require('querystring')
function send(name) {
  http
    .request(
      {
        host: 'localhost',
        port: 3001,
        url: '/',
        method: 'POST'
      },
      function(res) {
        res.setEncoding('utf8')
        res.on('end', function() {
          console.log('request complete')
          process.stdout.write('\n your name: ')
        })
      }
    )
    .end(
      qs.stringify({
        name: name
      })
    )
}

process.stdout.write('\n your name : ')
process.stdin.resume()
process.stdin.setEncoding('utf-8')
process.stdin.on('data', function(name) {
  console.log('你输入的name是: ', name)
  send(name.replace('\n', ''))
})
