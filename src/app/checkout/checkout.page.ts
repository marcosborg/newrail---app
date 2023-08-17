import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CheckoutPage implements OnInit {

  constructor(
    private api: ApiService,
    public router: Router,
    private alertController: AlertController
  ) { }

  cart: any = [];

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.checkCart();
  }

  checkCart() {
    this.api.checkName('cart').then((resp: any) => {
      const cart = JSON.parse(resp.value);
      cart.forEach((element: any) => {
        element.subtotal = element.price * element.quantity;
      });
      cart.total = cart.reduce((sum: any, item: { subtotal: any; }) => sum + item.subtotal, 0);
      this.cart = cart;
      if (this.cart.total == 0) {
        this.router.navigateByUrl('/');
      }
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

  deleteItem(index: number) {
    this.cart.splice(index, 1);
    this.api.setName('cart', JSON.stringify(this.cart)).then(() => {
      this.checkCart();
    });
  }

  order() {
    this.api.checkName('access_token').then((resp) => {
      let api_token = resp.value;
      if (!api_token) {
        this.alertController.create({
          message: 'Para dar seguimento ao pedido vamos precisar que faça login',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Continuar',
              handler: () => {
                this.router.navigateByUrl('login');
              }
            }
          ]
        }).then((alert) => {
          alert.present();
        });
      } else {
        this.router.navigateByUrl('order');
      }
    });
  }

}
