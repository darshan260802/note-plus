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
  private userId = '';
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
      payload: {},
    };
    this.loaderStatus.next(true);

    await createUserWithEmailAndPassword(this.auth, user.email, user.password)
      .then((data) => {
        body['payload'] = {userId: data.user.uid, name: user.name, email: user.email};
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
      payload: {},
    };
    this.loaderStatus.next(true);

    await signInWithEmailAndPassword(this.auth, user.email, user.password)
      .then((data) => {
        body['payload'] = {userId: data.user.uid, name: data.user.displayName, email: user.email};
        this.http.post(url, body).subscribe({
          next: (token) => {
            if (rememberMe) {
              localStorage.setItem('authToken', token as string);
            } else {
              sessionStorage.setItem('authToken', token as string);
            }
            this.userId = data.user.uid as string;

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

  async getAutoLogin(): Promise<boolean> {
    let status = true;

    // First Check in Local Storage
    let authToken = localStorage.getItem('authToken');

    // If not then in session storage
    if (!authToken) {
      authToken = sessionStorage.getItem('authToken');
    }

    // If not then user is not signed in.
    if (!authToken) {
      return false;
    }

    const url = 'https://dark-gray-blackbuck-fez.cyclic.app/transform/decrypt';
    const body = {
      token: authToken,
      secret: this.secret,
    };
    this.http.post(url, body).subscribe({
      next: (data) => {
        this.currentUser = data as LoggedUser;
        status = true;
      },
      error: (err) => {
        alert(err.error.message);
        status = false;
      },
    });

    return status;
  }

  getUser(): LoggedUser{
    return this.currentUser;
  }
}
