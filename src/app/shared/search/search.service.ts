import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

const url = 'assets/data/people.json';

@Injectable()
export class SearchService {
  
  constructor(private http: HttpClient) {}

  getAll(): any {
    return this.http.get(url)
    //.map((res: Response) => res)
  } 

  search(q: string): Observable<any> {
    if (!q || q === '*') {
      q = '';
    } else {
      q = q.toLowerCase();
    }
    return this.getAll().map(data => {
      const results: any = [];
      data.map(item => {
        // check for item in localStorage
        if (localStorage['person' + item.id]) {
          item = JSON.parse(localStorage['person' + item.id]);
        }
        if (JSON.stringify(item).toLowerCase().includes(q)) {
          results.push(item);
        }
      });
      return results;
    });
  }
  
  get(id: number) {
    return this.getAll().map(all => {
      if (localStorage['person' + id]) {
        return JSON.parse(localStorage['person' + id]);
      }
      return all.find(e => e.id === id);
    });
  }
  
  save(person: Person) {
    localStorage['person' + person.id] = JSON.stringify(person);
  }
  
}


export class Address {
  street: string;
  city: string;
  state: string;
  zip: string;

  constructor(obj?: any) {
    this.street = obj && obj.street || null;
    this.city = obj && obj.city || null;
    this.state = obj && obj.state || null;
    this.zip = obj && obj.zip || null;
  }
}

export class Person {
  id: number;
  name: string;
  phone: string;
  address: Address;

  constructor(obj?: any) {
    this.id = obj && Number(obj.id) || null;
    this.name = obj && obj.name || null;
    this.phone = obj && obj.phone || null;
    this.address = obj && obj.address || null;
  }
}