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

  login(data: any) {
    return this.http.post(this.url + 'login', data, this.httpOptions);
  }

  register(data: any) {
    return this.http.post(this.url + 'register', data, this.httpOptions);
  }

  user(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + data.access_token
      })
    };
    return this.http.get(this.url + 'v1/user', httpOptions);
  }

  trains(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + data.access_token
      })
    };
    return this.http.get(this.url + 'v1/trains', httpOptions);
  }

  carriages(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + data.access_token
      })
    };
    return this.http.get(this.url + 'v1/carriages/' + data.train_id, httpOptions);
  }

  order(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + data.access_token,
        'Accept-Language': 'pt'
      })
    };
    return this.http.post(this.url + 'v1/orders', data, httpOptions);
  }

  myOrders(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + data.access_token
      })
    };
    return this.http.get(this.url + 'v1/my-orders', httpOptions);
  }

  checkOrderStatus(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + data.access_token
      })
    };
    return this.http.get(this.url + 'v1/orders/' + data.order_id, httpOptions);
  }

  confirmReceived(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + data.access_token
      })
    };
    return this.http.get(this.url + 'v1/confirm-received/' + data.order_id, httpOptions);
  }

  userUpdate(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + data.access_token
      })
    };
    return this.http.post(this.url + 'v1/user-update', data, httpOptions);
  }
}
