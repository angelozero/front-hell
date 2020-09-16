import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { TokenService } from '../token/token.service'

const API_URL = 'http://localhost:3000';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  authenticate(userName: String, password: string) {
    return this.http
      .post(API_URL + '/user/login/', { userName: userName, password: password }, { observe: 'response' })
      .pipe(
        tap(
          res => {
            const authToken = res.headers.get('x-access-token');
            this.tokenService.setToken(authToken)
            console.log(`User: ${userName} -- Token: ${authToken}`)
          }
        )
      )
  }
}