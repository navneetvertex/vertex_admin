import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.scss']
})

export class Login2Component implements OnInit {

  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router,
    private authenticationService: AuthenticationService) { }
  loginForm: UntypedFormGroup;
  submitted = false;
  error = '';
  element;
  document;
  loading = false;
  passwordFieldType: string = 'password';

  year: number = new Date().getFullYear();

  ngOnInit(): void {
    document.body.classList.add('auth-body-bg')
    this.element = document.documentElement;
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  showHidePassword(passwordField) {
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      this.passwordFieldType = 'text';
    } else {
      passwordField.type = 'password';
      this.passwordFieldType = 'password';
    }
  }



  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      // Shake animation for invalid form
      return;
    } else {
      this.loading = true;
      this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Welcome back to Vertex Kalyan Cooperative',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        error => {
          this.loading = false;
          this.error = error ? error : '';
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password. Please try again.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#667eea'
          });
        });
    }
  }

  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        this.document.msExitFullscreen();
      }
    }
  }
}
