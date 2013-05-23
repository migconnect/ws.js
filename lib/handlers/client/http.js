var utils = require('../../utils')
  , request = require('request')
var d = require('domain').create();
d.on('error', function(er) {
  console.log('Domain Error:', er.message);
});


exports.HttpClientHandler = HttpClientHandler

function HttpClientHandler() {}

HttpClientHandler.prototype.send = function(ctx, callback) {
	d.run(function() {

		request.post({ url: ctx.url
               , strictSSL: false
               , body: ctx.request
               , headers: { "SOAPAction": ctx.action
                          , "Content-Type": ctx.contentType
                          , "MIME-Version": "1.0"
                          }
               , encoding: null
               }, 		
               function (error, response, body) {
				  ctx.response = body
				  if (response) {
					ctx.resp_contentType = response.headers["content-type"]
				  }
				  if (error) ctx.error = error
				  else ctx.statusCode = response.statusCode
				  callback(ctx)
				})			
	});
}