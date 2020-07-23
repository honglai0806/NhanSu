import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { WorkingTimeService } from '../../services/working-time.service';
import { WorkingTime } from '../../models/working-time';
import { TimeSlotService } from '../../services/time-slot.service';
import { TimeSlot } from '../../models/time-slot';
import {Employee} from '../../models/employee';
import { HttpClient } from '@angular/common/http';
import {ExcelService} from '../../services/excel.service';

@Component({
  selector: 'app-workingtime',
  templateUrl: './workingtime.component.html',
  styleUrls: ['./workingtime.component.css']
})
export class WorkingtimeComponent implements OnInit {

  @ViewChild('editModal', { static: false }) editModal: ModalDirective;

  workingTimes = [];
  timeSlots = [];

  workingTimeForm = new FormGroup({
    name: new FormControl(''),
    bio: new FormControl(''),
    workingTimeDetails: new FormArray([]),
  });
  columns = [
    { name: 'Name', prop: 'F_Name ', sortTable: true },
    { name: 'Lương cơ bản',prop: 'Salary', sortTable: true },
    { name: 'Email', sortTable: true },
    { name: 'Địa chỉ', sortTable: true },
  ];
  employees: Employee[] = [];
  employee: Employee = {Emp_ID: 0} as Employee;
  img: any = 'https://screenshotlayer.com/images/assets/placeholder.png';
  imgName: string = 'Choose file';
  public imagePath;
  public job: any;
  choosedEmp: Employee = {
    Emp_ID: 0,
    F_Name: '',
    L_Name: '',
    image: 'https://screenshotlayer.com/images/assets/placeholder.png',
    IDCard: '',
    Hire_Date: null,
    email: '',
    address: '',
    salary: 0, 
    commission: 0,
    isActive:true, 
    Manager_ID: null,
    Department_ID:null
};
  // workingTimeForm = this.fb.group({
  //   name: [''],
  //   bio: [''],
  //   period: [],
  // });

  constructor(
    private workingTimeService: WorkingTimeService,
    private timeSlotService: TimeSlotService,
    private fb: FormBuilder,
    private http: HttpClient, private excelService: ExcelService
  ) {

  }

  ngOnInit(): void {
    this.loadWorkingTime();
    this.loadTimeSlot();
    this.loadEmployee();
  }

  openAdd() {
    this.editModal.show();
  }

  loadWorkingTime() {
    this.workingTimeService.list().subscribe(res => {
      this.workingTimes = res.data;
    });    
  }

  loadTimeSlot() {
    this.timeSlotService.list().subscribe(res => {
      this.timeSlots = res.data;
    });
  }

  onCheckChange(event){
    // (this.workingTimeForm.controls.periods as FormArray).push(new FormControl(val));
    let formArray = this.workingTimeForm.controls.workingTimeDetails as FormArray;
    
    console.log(event);
    /*selected*/
    if(event.target.checked){
      formArray.push(new FormControl({"timeSlotId": parseInt(event.target.value)}));
    }else{
      // find the unselected element
      let i: number = 0;
  
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  save() {
     let workingTime = this.workingTimeForm.value;
     workingTime.id = 0;

     console.log(workingTime);
     

     this.workingTimeService.save(workingTime).subscribe(res => {
       this.workingTimes.push(res.data);
     });
  }
  // selectTab(tabId: number) {
  //   this.staticTabs.tabs[tabId].active = true;
  // }

  loadEmployee() {
    this.http.get<any>('../../../../assets/job.json')
    .subscribe((res) => {
      this.job = res.job;
    });
    this.http.get<any>('../../../../assets/employee.json')
    .subscribe((res) => {
      this.employees = res.employee;
    });
      console.log(this.employees);
  };


 

exportAsXLSX() {
  this.excelService.exportAsExcelFile(this.employees, 'DSNV');
}

choose(row){
  this.choosedEmp = row;
  this.choosedEmp.Hire_Date = new Date();
  console.log(this.choosedEmp);
}

preview(files) {
  if (files.length === 0)
    return;

  var mimeType = files[0].type;
  this.imgName = files[0].name;
  if (mimeType.match(/image\/*/) == null) {
    return;
  }

  var reader = new FileReader();
  this.imagePath = files;
  reader.readAsDataURL(files[0]); 
  reader.onload = (_event) => { 
    this.img = reader.result; 
    
  }
}

}
