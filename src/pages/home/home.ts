import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Ocom } from '@ionic-native/ocom';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, public ocom: Ocom) {}

  start() {
    this.ocom.start().then(() => {
      console.log('start');
    });
  }
  register() {
    this.ocom.addOneDScanListener().subscribe(data => {
      console.log(data);
    });
  }
}
