import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductsPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    public router: Router
  ) { }

  category_id: any;
  category: any;
  products: any = [];
  cart: any = [];

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.route.paramMap.subscribe(params => {
        this.category_id = params.get('category_id');
        this.api.category(this.category_id).subscribe((resp) => {
          this.category = resp;
          this.api.productsByCategory(this.category_id).subscribe((resp) => {
            this.products = resp;
            loading.dismiss();
          });
        });
      });
    });
    this.checkCart();
  }

  checkCart() {
    this.api.checkName('cart').then((resp) => {
      if (resp.value == null) {
        this.cart = [];
      } else {
        this.cart = JSON.parse(resp.value);
      }
      console.log(this.cart);
    });
  }

  addToCart(product_id: number, name: string, price: number) {
    this.alertController.create({
      header: 'Adicionar ao carrinho',
      subHeader: 'Pode alterar a quantidade abaixo',
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Quantidade',
          value: 1,
          min: 1,
          max: 100,
        },
      ],
      buttons: [
        {
          text: 'Adicionar',
          handler: (data) => {
            const cartItem = {
              product_id: product_id,
              name: name,
              price: price,
              quantity: parseInt(data.quantity)
            };
            const existingCartItem = this.cart.find((item: { product_id: number; }) => item.product_id === product_id);
            if (existingCartItem) {
              existingCartItem.quantity += cartItem.quantity;
            } else {
              this.cart.push(cartItem);
            }
            this.api.setName('cart', JSON.stringify(this.cart)).then(() => {
              this.alertController.create({
                message: 'Pode continuar a escolher produtos ou finalizar o pedido.',
                buttons: [
                  {
                    text: 'Continuar a pedir',
                    handler: () => {
                      this.router.navigateByUrl('/');
                    }
                  },
                  {
                    text: 'Finalizar pedido',
                    handler: () => {
                      this.router.navigateByUrl('checkout');
                    }
                  }
                ]
              }).then((alert) => {
                alert.present();
              });
              this.checkCart();
            });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }


}
