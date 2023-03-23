import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  name?: string;
  email: string;
  password: string;
}

interface LoggedUser {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private secret = 'NOTE_PLUS_DHP';
  private loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private currentUser: LoggedUser = {
    id: '',
    name: '',
    email: '',
  };

  constructor(private http: HttpClient, private auth: Auth) {}

  async userSignup(
    user: User,
    rememberMe: boolean
  ): Promise<Observable<boolean>> {
    const url = 'https://dark-gray-blackbuck-fez.cyclic.app/transform/encrypt';
    const body = {
      secret: this.secret,
      payload: '',
    };
    this.loaderStatus.next(true);

    await createUserWithEmailAndPassword(this.auth, user.email, user.password)
      .then((data) => {
        body['payload'] = data.user.uid;
        updateProfile(data.user, { displayName: user.name });
        this.http.post(url, body).subscribe({
          next: (token) => {
            if (rememberMe) {
              localStorage.setItem('authToken', token as string);
            } else {
              sessionStorage.setItem('authToken', token as string);
            }
            this.currentUser['id'] = data.user.uid;
            this.currentUser['name'] = user.name as string;
            this.currentUser['email'] = user.email;
            console.log(this.currentUser);
            
            this.loaderStatus.next(false);
          },
          error: (error) => {
            alert(error.error.message);
            this.loaderStatus.next(false);
          },
        });
      })
      .catch((err) => {
        alert(err.message);
        this.loaderStatus.next(false);
      });
      return this.loaderStatus;
    }

    async userLogin(
      user: User,
      rememberMe: boolean
      ): Promise<Observable<boolean>> {
    const url = 'https://dark-gray-blackbuck-fez.cyclic.app/transform/encrypt';
    const body = {
      secret: this.secret,
      payload: '',
    };
    this.loaderStatus.next(true);
    
    await signInWithEmailAndPassword(this.auth, user.email, user.password)
    .then((data) => {
      body['payload'] = data.user.uid;
      this.http.post(url, body).subscribe({
        next: (token) => {
          if (rememberMe) {
            localStorage.setItem('authToken', token as string);
          } else {
            sessionStorage.setItem('authToken', token as string);
          }
            this.currentUser['id'] = data.user.uid;
            this.currentUser['name'] = data.user.displayName as string;
            this.currentUser['email'] = user.email;
            console.log(this.currentUser);
            this.loaderStatus.next(false);
          },
          error: (error) => {
            alert(error.error.message);
            this.loaderStatus.next(false);
          },
        });
      })
      .catch((err) => {
        alert(err.message);
        this.loaderStatus.next(false);
      });
    return this.loaderStatus;
  }
}
