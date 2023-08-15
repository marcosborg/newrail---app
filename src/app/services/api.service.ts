import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  async setName(key: string, name: string) {
    await Preferences.set({
      key: key,
      value: name,
    });
  };

  async checkName(key: string) {
    return await Preferences.get({ key: key });
  };

  async removeName(key: string) {
    await Preferences.remove({ key: key });
  };

  url: string = 'http://127.0.0.1:8000/api/';

  httpOptions = {
    headers: new HttpHeaders({
      'Accept-Language': 'pt'
    })
  };

  categories() {
    return this.http.get(this.url + 'categories');
  }

  category(category_id: number) {
    return this.http.get(this.url + 'categories/' + category_id);
  }

  productsByCategory(category_id: number) {
    return this.http.get(this.url + 'products/category/' + category_id);
  }
}
