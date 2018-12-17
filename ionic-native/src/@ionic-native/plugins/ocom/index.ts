/**
 * This is a template for new plugin wrappers
 *
 * TODO:
 * - Add/Change information below
 * - Document usage (importing, executing main functionality)
 * - Remove any imports that you are not using
 * - Remove all the comments included in this template, EXCEPT the @Plugin wrapper docs and any other docs you added
 * - Remove this note
 *
 */
import { Injectable } from '@angular/core';
import { Cordova, IonicNativePlugin, Plugin } from '@ionic-native/core';
import { Observable } from 'rxjs/Observable';

/**
 * @name Ocom
 * @description
 * This plugin does something
 *
 * @usage
 * ```typescript
 * import { Ocom } from '@ionic-native/ocom';
 *
 *
 * constructor(private ocom: Ocom) {
 *  this.ocom.start();
 * }
 *
 * ...
 *
 *
 *
 * ```
 */
@Plugin({
  pluginName: 'Ocom',
  plugin: 'cordova_plugin_ocom', // npm package name, example: cordova-plugin-camera
  pluginRef: 'ocom', // the variable reference to call the plugin, example: navigator.geolocation
  platforms: ['Android'], // Array of platforms supported, example: ['Android', 'iOS']
})
@Injectable()
export class Ocom extends IonicNativePlugin {
  /**
   * This function listen to an event sent from the native code
   * @return {Observable<any>} Returns an observable to watch when an event is received
   */
  @Cordova({
    observable: true,
    clearFunction: 'remove1DScanListener',
    clearWithArgs: true,
  })
  add1DScanListener(): Observable<any> {
    return;
  }

  @Cordova({
    successIndex: 0,
    errorIndex: 1,
  })
  start(): Promise<any> {
    return;
  }
}
