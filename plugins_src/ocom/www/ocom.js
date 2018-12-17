var exec = require('cordova/exec');
var channel = require('cordova/channel');

function Ocom() {
  var _debug = false;

  this._channels = {};

  this.channelExists = function(c) {
    return this._channels.hasOwnProperty(c);
  };

  this.channelCreate = function(c) {
    this._channels[c] = channel.create(c);
  };
  this.channelSubscribe = function(c, f) {
    var channel = this._channels[c];
    channel.subscribe(f);
    return channel.numHandlers;
  };
  this.channelUnsubscribe = function(c, f) {
    var channel = this._channels[c];
    channel.unsubscribe(f);
    return channel.numHandlers;
  };
  this.channelFire = function(event) {
    this._channels[event.type].fire(event);
  };
  this.channelDelete = function(c) {
    delete this._channels[c];
  };
}

Ocom.prototype.addOneDScanListener = f => {
  var eventname = 'scanner.read';
  console.log(this.ocom);
  if (!this.ocom.channelExists(eventname)) {
    this.ocom.channelCreate(eventname);
    var me = this.ocom;

    exec(
      () => me.channelSubscribe(eventname, f),
      err => console.log('ERROR addEventListener: ', err),
      'ocom',
      'add1DScanListener',
      null
    );
  } else {
    this.ocom.channelSubscribe(eventname, f);
  }
};

Ocom.prototype.removeOneDScanListener = f => {
  var eventname = 'scanner.read';

  if (this.ocom.channelExists(eventname)) {
    if (this.ocom.channelUnsubscribe(eventname, f) === 0) {
      var me = this.ocom;
      exec(
        () => me.channelDelete(eventname),
        err => console.log('ERROR removeEventListener: ', err),
        'ocom',
        'remove1DScanListener',
        null
      );
    }
  }
};

Ocom.prototype.start = (success, error) => exec(success, error, 'ocom', 'start', null);

module.exports = new Ocom();
