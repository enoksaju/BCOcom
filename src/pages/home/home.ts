import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  constructor(public navCtrl: NavController) {

  }

  start() {
    // this.ocom.start().then(() => {
    //   console.log('start');
    // });
  }
  register() {
    // this.ocom.add1DScanListener().subscribe(data => {
    //   console.log(data);
    // });
  }
}
