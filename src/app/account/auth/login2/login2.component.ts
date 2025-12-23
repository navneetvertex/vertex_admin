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
  currentYear = new Date().getFullYear();

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
            html: `
              <div class="professional-success">
                <div class="success-content">
                  <div class="logo-container">
                    <img src="assets/images/logo-dark.png" alt="Vertex Logo" class="popup-logo">
                    <div class="success-badge">
                      <i class="mdi mdi-check"></i>
                    </div>
                  </div>
                  <h3 class="success-title">Login Successful!</h3>
                  <p class="success-subtitle">Welcome back to Vertex Kalyan Cooperative</p>
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                </div>
              </div>
            `,
            showConfirmButton: false,
            timer: 2200,
            width: '420px',
            padding: '0',
            background: 'transparent',
            backdrop: 'rgba(102, 126, 234, 0.1)',
            customClass: {
              popup: 'professional-popup',
              htmlContainer: 'professional-container'
            },
            didOpen: () => {
              const style = document.createElement('style');
              style.textContent = `
                .professional-popup {
                  border-radius: 24px !important;
                  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
                  border: 1px solid rgba(255, 255, 255, 0.2) !important;
                  backdrop-filter: blur(20px) !important;
                  overflow: hidden !important;
                }
                .professional-container {
                  margin: 0 !important;
                  padding: 0 !important;
                }
                .professional-success {
                  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
                  backdrop-filter: blur(20px);
                  position: relative;
                  overflow: hidden;
                }
                .professional-success::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                  animation: shimmer 2s ease-in-out infinite;
                }
                .success-content {
                  padding: 3rem 2.5rem;
                  text-align: center;
                  position: relative;
                  z-index: 2;
                }
                .logo-container {
                  position: relative;
                  display: inline-block;
                  margin-bottom: 1.5rem;
                }
                .popup-logo {
                  height: 80px;
                  width: auto;
                  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
                  animation: logoEntrance 0.6s ease-out;
                }
                .success-badge {
                  position: absolute;
                  top: -8px;
                  right: -8px;
                  width: 36px;
                  height: 36px;
                  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                  border: 3px solid white;
                  animation: badgeScale 0.5s ease-out 0.3s both;
                }
                .success-badge i {
                  color: white;
                  font-size: 18px;
                  font-weight: bold;
                }
                .success-title {
                  color: #2d3748;
                  font-size: 24px;
                  font-weight: 700;
                  margin: 0 0 0.5rem 0;
                  letter-spacing: -0.5px;
                  animation: textSlide 0.6s ease-out 0.2s both;
                }
                .success-subtitle {
                  color: #718096;
                  font-size: 16px;
                  margin: 0 0 2rem 0;
                  line-height: 1.5;
                  animation: textSlide 0.6s ease-out 0.4s both;
                }
                .progress-bar {
                  width: 100%;
                  height: 4px;
                  background: rgba(102, 126, 234, 0.1);
                  border-radius: 2px;
                  overflow: hidden;
                  animation: fadeIn 0.6s ease-out 0.6s both;
                }
                .progress-fill {
                  height: 100%;
                  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                  border-radius: 2px;
                  animation: progressFill 2.2s ease-out;
                  transform-origin: left;
                }
                
                @keyframes logoEntrance {
                  0% { opacity: 0; transform: scale(0.8) translateY(20px); }
                  100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes badgeScale {
                  0% { opacity: 0; transform: scale(0); }
                  50% { transform: scale(1.2); }
                  100% { opacity: 1; transform: scale(1); }
                }
                @keyframes textSlide {
                  0% { opacity: 0; transform: translateY(15px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                  0% { opacity: 0; }
                  100% { opacity: 1; }
                }
                @keyframes progressFill {
                  0% { transform: scaleX(0); }
                  100% { transform: scaleX(1); }
                }
                @keyframes shimmer {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.7; }
                }
                
                /* Responsive Design */
                @media (max-width: 480px) {
                  .professional-popup {
                    width: 90vw !important;
                    max-width: 350px !important;
                  }
                  .success-content {
                    padding: 2.5rem 2rem;
                  }
                  .popup-logo {
                    height: 70px;
                  }
                  .success-badge {
                    width: 32px;
                    height: 32px;
                    top: -6px;
                    right: -6px;
                  }
                  .success-badge i {
                    font-size: 16px;
                  }
                  .success-title {
                    font-size: 22px;
                  }
                  .success-subtitle {
                    font-size: 15px;
                  }
                }
              `;
              document.head.appendChild(style);
            }
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
