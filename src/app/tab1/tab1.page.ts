import { Component, OnInit } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab1Page implements OnInit {
  constructor(
    private api: ApiService,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  categories: any = [];

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.api.categories().subscribe((resp) => {
        this.categories = resp;
        loading.dismiss();
      });
    });
  }

  goCategory(category_id: number) {
    this.router.navigateByUrl('products/' + category_id);
  }
}
