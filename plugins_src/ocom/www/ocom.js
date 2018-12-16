var exec = require('cordova/exec');
var channel = require('cordova/channel');

function Ocom() {
  var _debug = false;

  this._channels = {};

  this.channelExists = function(c) {
    //return (c in this._channels);
    return this._channels.hasOwnProperty(c);
  };

  this.channelCreate = function(c) {
    if (_debug) console.log('CHANNEL ' + c + ' CREATED! ');
    this._channels[c] = channel.create(c);
  };
  this.channelSubscribe = function(c, f) {
    var channel = this._channels[c];
    channel.subscribe(f);
    if (_debug) console.log('CHANNEL ' + c + ' SUBSCRIBED! ' + channel.numHandlers);
    return channel.numHandlers;
  };
  this.channelUnsubscribe = function(c, f) {
    var channel = this._channels[c];
    channel.unsubscribe(f);
    if (_debug) console.log('CHANNEL ' + c + ' UNSUBSCRIBED! ' + channel.numHandlers);
    return channel.numHandlers;
  };
  this.channelFire = function(event) {
    if (_debug) console.log('CHANNEL ' + event.type + ' FIRED! ');
    this._channels[event.type].fire(event);
  };
  this.channelDelete = function(c) {
    delete this._channels[c];
    if (_debug) console.log('CHANNEL ' + c + ' DELETED! ');
  };
}

Ocom.prototype.addOneDScanListener = function(f) {
  var eventname = 'scanner.read';
  if (!this.channelExists(eventname)) {
    this.channelCreate(eventname);
    var me = this;

    exec(
      function() {
        me.channelSubscribe(eventname, f);
      },
      function(err) {
        console.log('ERROR addEventListener: ', err);
      },
      'ocom',
      'add1DScanListener',
    );
  } else {
    this.channelSubscribe(eventname, f);
  }
};

// Ocom.prototype.removeOneDScanListener = function(f) {
//   var eventname = 'scanner.read';
//   if (this.channelExists(eventname)) {
//     if (this.channelUnsubscribe(eventname, f) === 0) {
//       var me = this;
//     }
//   }

//   // if (this.channelExists(eventname)) {
//   //   if (this.channelUnsubscribe(eventname, f) === 0) {
//   //     var me = this;
//   //     exec(
//   //       function() {
//   //         me.channelDelete(eventname);
//   //       },
//   //       function(err) {
//   //         console.log('ERROR removeEventListener: ', err);
//   //       },
//   //       'ocom',
//   //       'remove1DScanListener',
//   //       null,
//   //     );
//   //   }
//   // }
// };

// Ocom.prototype.start = function(success, error) {
//   exec(success, error, 'ocom', 'start', null);
// };

module.exports = new Ocom();
