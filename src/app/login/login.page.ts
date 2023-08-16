import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  constructor(
    private api: ApiService,
    private alertController: AlertController,
    public router: Router,
    private loadingController: LoadingController
  ) { }

  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.api.removeName('access_token');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        email: this.email,
        password: this.password
      }
      this.api.login(data).subscribe((resp: any) => {
        this.api.setName('access_token', resp.access_token).then(() => {
          this.api.checkName('cart').then((resp: any) => {
            loading.dismiss();
            if (resp.value == null || JSON.parse(resp.value).length == 0) {
              this.alertController.create({
                header: 'Parabéns',
                subHeader: 'Login realizado com sucesso',
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
                subHeader: 'Login realizado com sucesso',
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
              text: 'Pedir recuperação',
              handler: () => {
                window.location.href="https://newrail.pt/password/reset";
              }
            },
            {
              text: 'Criar conta',
              handler: () => {
                this.router.navigateByUrl('create');
              }
            }
          ]
        }).then((alert) => {
          alert.present();
        });
      });
    });
  }

}
