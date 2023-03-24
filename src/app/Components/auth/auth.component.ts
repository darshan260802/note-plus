import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Shared/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isSignup: boolean = true;
  isLoading: boolean = false;

  UserForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    remember: new FormControl(true),
    isSignup: new FormControl(this.isSignup),
  });

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.UserForm.get('isSignup')?.valueChanges.subscribe(
      (newVal: boolean | null) => {
        if (newVal === null) return;
        this.isSignup = newVal;
      }
    );
  }

  async handleSubmit(): Promise<void> {
    if (this.isSignup) {
      const data = {
        name: this.UserForm.get('name')?.value as string,
        email: this.UserForm.get('email')?.value as string,
        password: this.UserForm.get('password')?.value as string,
      };
      if (Object.values(data).filter((item) => item.length < 1).length) {
        alert('All Fields Are mandatory');
        return;
      }
      this.isLoading = true;
      await this.authService
        .userSignup(data, this.UserForm.get('remember')?.value ?? false)
        .then((data) => {
          data.subscribe((loader: boolean) => {
            this.isLoading = loader;
            // this.UserForm.reset({ isSignup: true, remember: true });
            this.UserForm.controls['name'].reset();
            this.UserForm.controls['email'].reset();
            this.UserForm.controls['password'].reset();
            this.router.navigate(['dashboard']);
          });
        });
    } else {
      const data = {
        email: this.UserForm.get('email')?.value as string,
        password: this.UserForm.get('password')?.value as string,
      };
      if (Object.values(data).filter((item) => item.length < 1).length) {
        alert('All Fields Are mandatory');
        return;
      }
      this.isLoading = true;
      await this.authService
        .userLogin(data, this.UserForm.get('remember')?.value ?? false)
        .then((data) => {
          data.subscribe((loader: boolean) => {
            this.isLoading = loader;
            // this.UserForm.reset({ isSignup: true, remember: true });
            this.UserForm.controls['email'].reset();
            this.UserForm.controls['password'].reset(); 
            this.router.navigate(['dashboard']);
          });
        });
    }
  }

  
}
