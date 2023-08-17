import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab3Page {
  constructor(
    public router: Router,
    private api: ApiService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  access_token: string = '';
  user: any;
  showPassword: boolean = false;

  ionViewWillEnter() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.api.checkName('access_token').then((resp) => {
        if (resp.value) {
          this.access_token = resp.value;
          let data = {
            access_token: this.access_token
          }
          this.api.user(data).subscribe((resp) => {
            this.user = resp;
            this.user.password = '';
            this.user.password_confirmation = '';
            console.log(this.user);
            loading.dismiss();
          });
        } else {
          loading.dismiss();
        }
      });
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  update() {
    this, this.loadingController.create().then((loading) => {
      loading.present();
      let data: any;
      if (this.user.password) {
        data = {
          access_token: this.access_token,
          name: this.user.name,
          password: this.user.password,
          password_confirmation: this.user.password_confirmation
        }
      } else {
        data = {
          access_token: this.access_token,
          name: this.user.name,
        }
      }
      this.api.userUpdate(data).subscribe((resp) => {
        loading.dismiss();
        this.user = resp;
        this.alertController.create({
          message: 'Atualizado com sucesso',
          buttons: ['OK']
        }).then((alert) => {
          alert.present();
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
            }
          ]
        }).then((alert) => {
          alert.present();
        });
      });
    });
  }

  logout() {
    this.api.removeName('cart').then(() => {
      this.api.removeName('access_token').then(() => {
        this.router.navigateByUrl('login')
      });
    });
  }
}
