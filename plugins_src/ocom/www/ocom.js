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

Ocom.prototype.fireEvent = function(type, data) {
  if (!this.channelExists(type)) return;
  var event = document.createEvent('Event');
  event.initEvent(type, false, false);
  if (data) {
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        event[i] = data[i];
      }
    }
  }
  this.channelFire(event);
};

Ocom.prototype.addOneDScanListener = f => {
  var eventname = 'scanner.read';
  if (!this.ocom.channelExists(eventname)) {
    this.ocom.channelCreate(eventname);
    var me = this.ocom;
    exec(() => me.channelSubscribe(eventname, f), err => console.log('ERROR addEventListener: ', err), 'ocom', 'add1DScanListener', [eventname]);
  } else {
    this.ocom.channelSubscribe(eventname, f);
  }
};

Ocom.prototype.addKeyFPressedListener = f => {
  var eventname = 'key.function.press';
  if (!this.ocom.channelExists(eventname)) {
    this.ocom.channelCreate(eventname);
    var me = this.ocom;
    exec(() => me.channelSubscribe(eventname, f), err => console.log('ERROR addEventListener: ', err), 'ocom', 'addKPListener', [eventname]);
  } else {
    this.ocom.channelSubscribe(eventname, f);
  }
};

Ocom.prototype.removeOneDScanListener = f => {
  var eventname = 'scanner.read';
  if (this.ocom.channelExists(eventname)) {
    if (this.ocom.channelUnsubscribe(eventname, f) === 0) {
      var me = this.ocom;
      exec(() => me.channelDelete(eventname), err => console.log('ERROR removeEventListener: ', err), 'ocom', 'remove1DScanListener', [eventname]);
    }
  }
};

Ocom.prototype.removeKeyFPressedListener = f => {
  var eventname = 'scanner.read';
  if (this.ocom.channelExists(eventname)) {
    if (this.ocom.channelUnsubscribe(eventname, f) === 0) {
      var me = this.ocom;
      exec(() => me.channelDelete(eventname), err => console.log('ERROR removeEventListener: ', err), 'ocom', 'removeKPListener', [eventname]);
    }
  }
};

/**
 * ```
  window.ocom.start(buttons, successCallBack, errorCallBack)

  Example
    window.ocom.start(
      "scan, scan_right",
      ()=>{},
      e=> console.log(e)
    )
 * ```
 * @param buttons They should be the names of the buttons separated by comma:
 * ```
  ["scan, scan_right, f1, right, left"]
  ```
 */
Ocom.prototype.start = (buttons = 'scan', success, error) => {
  console.log('Init with ' + buttons + ' configured');
  exec(success, error, 'ocom', 'start', [buttons]);
};

module.exports = new Ocom();
