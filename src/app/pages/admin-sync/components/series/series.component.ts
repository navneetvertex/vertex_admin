import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {

  constructor(private adminService: AdminService) { }
  breadCrumbItems: Array<{}>;
  seriesList: any[] = []
  seriesFormGroup: FormGroup

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Quiz' }, { label: 'Add Common Quiz', active: true }];
    this.seriesFormGroup = new FormGroup({
      
    })
    this.getSeries();
  }

  getSeries() {
    this.adminService.get().subscribe((res: any) => {
      console.log(res);
      this.seriesList = res.data.series
    });
  }

  editSeriesModal(data: any, content: any){}

}
