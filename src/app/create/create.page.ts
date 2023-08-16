import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CreatePage implements OnInit {

  constructor(
    public router: Router,
    private api: ApiService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  name: string = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';
  showPassword: boolean = false;

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  register() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      }
      this.api.register(data).subscribe((resp: any) => {
        this.api.setName('access_token', resp.access_token).then(() => {
          this.api.checkName('cart').then((resp: any) => {
            loading.dismiss();
            if (resp.value == null || JSON.parse(resp.value).length == 0) {
              this.alertController.create({
                header: 'Parabéns',
                subHeader: 'Conta criada com sucesso',
                message: 'Vamos encaminhar para o menu',
                backdropDismiss: false,
              }).then((alert) => {
                alert.present();
                setTimeout(() => {
                  alert.dismiss();
                  this.router.navigateByUrl('/');
                }, 2000);
              });
            } else {
              this.alertController.create({
                header: 'Parabéns',
                subHeader: 'Conta criada com sucesso',
                message: 'Vamos encaminhar para o checkout',
                backdropDismiss: false,
              }).then((alert) => {
                alert.present();
                setTimeout(() => {
                  alert.dismiss();
                  this.router.navigateByUrl('checkout');
                }, 2000);
              });
            }
          });
        });
      }, (error: any) => {
        loading.dismiss();
        let html = '';
        let errors: any = error.error.errors;
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            let err = errors[key];
            for (const k in err) {
              if (err.hasOwnProperty(k)) {
                html += err[k] + ' ';
              }
            }
          }
        }
        this.alertController.create({
          header: 'Erro de validação',
          message: html,
          buttons: [
            {
              text: 'Tentar novamente',
              role: 'cancel'
            },
            {
              text: 'Cancelar',
              handler: () => {
                this.router.navigateByUrl('/');
              }
            }
          ]
        }).then((alert) => {
          alert.present();
        });
      })
    });
  }

}
