import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class Tab1Page {
  constructor(
    private api: ApiService
  ) { }

  categories: any = [];

  ionViewWillEnter() {
    this.api.categories();
  }
}
