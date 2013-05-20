var select = require('../../xpath').SelectNodes
  , Dom = require('xmldom').DOMParser
  , utils = require('../../utils')
  , consts = require('../../consts')

exports.WsAddressingClientHandler = WsAddressingClientHandler

function WsAddressingClientHandler(version) {
  this.version = version		
}

WsAddressingClientHandler.prototype.send = function(ctx, callback) {	
  var self = this
    , doc = new Dom().parseFromString(ctx.request)
    , header = select(doc, "/*[local-name(.)='Envelope']/*[local-name(.)='Header']")[0]
  doc.firstChild.setAttribute("xmlns:" + consts.addressing_prefix, this.version)
  utils.appendElement(doc, header, this.version, consts.addressing_prefix + ":Action", ctx.action)
  utils.appendElement(doc, header, this.version, consts.addressing_prefix + ":To", ctx.url)
  utils.appendElement(doc, header, this.version, consts.addressing_prefix + ":MessageID", utils.guid().toUpperCase())
  /*
  only populate if replyTo address provided in ctx
  */
  if (ctx.replyTo !== undefined){
    var reply = utils.appendElement(doc, header, this.version, consts.addressing_prefix + ":ReplyTo", null)
    utils.appendElement(doc, reply, this.version, consts.addressing_prefix + ":Address", ctx.replyTo)    
  }

  ctx.request = doc.toString()	
	this.next.send(ctx, function(ctx) { 
    self.receive(ctx, callback)
  })
}

WsAddressingClientHandler.prototype.receive = function(ctx, callback) {		
  callback(ctx)
}