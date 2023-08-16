import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OrderPage implements OnInit {

  constructor(
    private api: ApiService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    public router: Router
  ) { }

  access_token: string = '';
  user: any;
  trains: any = [];
  train_id: any;
  carriages: any = [];
  carriage_id: any;
  seat: any;
  cart: any = [];

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.api.checkName('access_token').then((resp: any) => {
        this.access_token = resp.value;
        this.api.checkName('cart').then((resp: any) => {
          const cart = JSON.parse(resp.value);
          cart.forEach((element: any) => {
            element.subtotal = element.price * element.quantity;
          });
          cart.total = cart.reduce((sum: any, item: { subtotal: any; }) => sum + item.subtotal, 0);
          this.cart = cart;
          let data = {
            access_token: this.access_token
          }
          this.api.user(data).subscribe((resp) => {
            this.user = resp;
            this.api.trains(data).subscribe((resp: any) => {
              loading.dismiss();
              this.trains = resp.data;
            });
          });
        });
      });
    });
  }

  trainSelect() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        access_token: this.access_token,
        train_id: this.train_id
      }
      this.api.carriages(data).subscribe((resp: any) => {
        this.carriages = resp;
        loading.dismiss();
      });
    });
  }

  order() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        access_token: this.access_token,
        user_id: this.user.id,
        carriage_id: this.carriage_id,
        seat: this.seat,
        cart: JSON.stringify(this.cart),
        total: this.cart.total
      }
      this.api.order(data).subscribe((resp: any) => {
        loading.dismiss();
        this.api.removeName('cart').then(() => {
          this.router.navigateByUrl('processing/' + resp.data.id);
        });
      });
    });
  }

  emptyCart() {
    this.alertController.create({
      header: 'Tem a certeza?',
      subHeader: 'Não poderá recuperar os itens do carrinho.',
      message: 'Terá de acrescentar novamente o que necessitar.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.api.removeName('cart').then(() => {
              this.router.navigateByUrl('/');
            });
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });

  }


}
