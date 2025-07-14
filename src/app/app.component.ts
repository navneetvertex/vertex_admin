import { Component , OnInit} from '@angular/core';
import { SettingsService } from './core/services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  constructor(private settingService: SettingsService) { }

  ngOnInit() {
    this.settingService.loadGeneralSettings().subscribe(() => {
      console.log('General settings loaded successfully');
    });
  }
}
