import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab2Page {

  constructor(
    private api: ApiService,
    private loadingController: LoadingController
  ) { }

  access_token: string = '';
  orders: any = [];

  ionViewWillEnter() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.api.checkName('access_token').then((resp) => {
        if (resp.value) {
          this.access_token = resp.value;
          console.log(this.access_token);
          let data = {
            access_token: this.access_token
          }
          this.api.myOrders(data).subscribe((resp) => {
            loading.dismiss();
            this.orders = resp;
            console.log(this.orders);
          });
        }
      });
    });
  }

  parseProducts(cart: string): string {
    const parsedCart = JSON.parse(cart);
    let html = '';
    parsedCart.forEach((element: any, index: any) => {
      if (index == 0) {
        html += element.name;
      } else {
        html += ', ' + element.name;
      }
    });
    return html;
  }

  parseSubTotal(cart: string) {
    let parsedCart = JSON.parse(cart);
    let subtotal = 0;
    parsedCart.forEach((element: any) => {
      console.log(element);
      subtotal = subtotal + element.price * element.quantity;
    });
    return subtotal.toFixed(2) + ' €';
  }

}
