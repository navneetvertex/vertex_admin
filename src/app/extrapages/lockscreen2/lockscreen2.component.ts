import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lockscreen2',
  templateUrl: './lockscreen2.component.html',
  styleUrls: ['./lockscreen2.component.scss']
})
export class Lockscreen2Component implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private toast: ToastrService
  ) { }
  data : any = null
  year: number = new Date().getFullYear();
  name: string = '';
  email: string = '';
  passwordFormGroup: FormGroup;

  ngOnInit(): void {
    document.body.classList.add('auth-body-bg')
    this.data = JSON.parse(localStorage.getItem('currentUser'))
    if(this.data) {
      this.name = this.data.user.name
      this.email = this.data.user.email_id
    }

    this.passwordFormGroup = new FormGroup({
      password: new FormControl('', Validators.required),
      email: new FormControl(this.email),
    });

    history.pushState(null, '', location.href);
    window.addEventListener('popstate', () => {
      history.pushState(null, '', location.href); // Cancel back
    });
  }

  onSignIn() {

    if (this.passwordFormGroup.invalid) {
       this.toast.error('Password is required.', 'Error');
      return;
    }
    const password = this.passwordFormGroup.get('password').value;

    this.authenticationService.login(this.email, password)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.toast.error('Login failed, Redirecting to Login Page', 'Error');
          this.authenticationService.logout();
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
          this.router.navigate(['/account/login']);
        });
      }
  
}
