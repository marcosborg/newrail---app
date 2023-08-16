import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.page.html',
  styleUrls: ['./processing.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProcessingPage implements OnInit {

  constructor(
    private api: ApiService,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    public router: Router
  ) { }

  access_token: string = '';
  order_id: any;
  order: any;
  received: boolean = false;

  ngOnInit() {
    this.loadingController.create({
      message: 'O pedido está a ser processado'
    }).then((loading) => {
      loading.present();
      this.route.paramMap.subscribe(params => {
        this.order_id = params.get('order_id');
        this.api.checkName('access_token').then((resp: any) => {
          this.access_token = resp.value;
          let data = {
            access_token: this.access_token,
            order_id: this.order_id
          }
          const interval = setInterval(() => {
            this.api.checkOrderStatus(data).subscribe((resp: any) => {
              this.order = resp.data;
              let preparing = this.order.preparing;
              let delivered = this.order.delivered;
              let received = this.order.received;
              if (preparing && !delivered) {
                loading.message = 'O seu pedido está a ser preparado'
              }
              if (delivered && !received) {
                loading.message = 'O pedido está a ser levado ao seu lugar';
                loading.backdropDismiss = true;
                this.received = true;
              }
              if (received) {
                loading.dismiss();
                this.loadingController.create({
                  message: 'O pedido já foi entregue',
                  duration: 5000,
                }).then((load) => {
                  load.present();
                  load.onDidDismiss().then(() => {
                    clearInterval(interval);
                    this.router.navigateByUrl('/');
                  });
                })
              }
            });
          }, 10000);
        });
      });
    });
  }

  confirmReceived() {
    let data = {
      order_id: this.order_id,
      access_token: this.access_token
    }
    this.api.confirmReceived(data).subscribe((resp: any) => {
      this.order = resp.data;
      let received = this.order.received;
      if (received) {
        this.alertController.create({
          header: 'Parabéns',
          subHeader: 'Acabou de receber o seu pedido',
          message: 'Desejamos que desfrute do nosso serviço e continue a sua viagem em tranquilidade.',
          backdropDismiss: false,
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.router.navigateByUrl('/');
              }
            }
          ],
        }).then((alert) => {
          alert.present();
        });
      }
    });
  }

}
