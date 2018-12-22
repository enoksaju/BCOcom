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

export interface ICodeBarData {
  data: string;
}

export interface IKeyFunctionEvent {
  key: string;
  button: string;
}

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
 *  this.ocom.start('scan');
 *
 *  this.ocom.addOneDScanListener()
 *      .subscribe(data => console.log(data.data));
 *
 *  this.ocom.addKeyFPressedListener()
 *      .subscribe(data => {
 *        console.log(data.key);
 *        console.log(data.button);
 *      });
 * }
 *
 * ...
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
   * This function listens to the event of the 1D bar code reader.
   * @return {Observable<any>} Returns an observable to watch when an event is received
   */
  @Cordova({
    observable: true,
    clearFunction: 'removeOneDScanListener',
    clearWithArgs: true,
  })
  addOneDScanListener(): Observable<ICodeBarData> {
    return;
  }

  /**
   * This function listens to the function keyboard event.
   * @return {Observable<any>} Returns an observable to watch when an event is received
   */
  @Cordova({
    observable: true,
    clearFunction: 'removeKeyFPressedListener',
    clearWithArgs: true,
  })
  addKeyFPressedListener(): Observable<IKeyFunctionEvent> {
    return;
  }

  /**
   *
   * ```
   * Example
   *
   * this.ocom.start(
   *   "scan, scan_right",
   *   ()=>{},
   *   e=> console.log(e)
   * )
   * ```
   *
   * @param buttons They should be the names of the buttons separated by comma:
   * ```
   * ["scan, scan_right, f1, right, left"]
   * ```
   */
  @Cordova({
    successIndex: 1,
    errorIndex: 2,
  })
  start(buttons?: string): Promise<any> {
    return;
  }
}
