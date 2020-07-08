import {Component, ViewChildren, QueryList, ElementRef} from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { CarService } from './carservice';
import { Car } from './car';
import { FilterUtils } from 'primeng/utils';
import { LazyLoadEvent } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import {MessageService} from 'primeng/api';
import { EditableColumn } from 'primeng';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent { 
    columns = ["Delete", "Sold?", "Brand", "Color", "Price"];  

    carForm: FormGroup;

    cars1: Car[];

    cars2: Car[];

    brands: SelectItem[];

    clonedCars: { [s: string]: Car; } = {};

    cellBeingEdited: string;

    rowBeingEdited = -1;

    newRowAdded = false;

    constructor(private fb: FormBuilder, private carService: CarService, private messageService: MessageService) { }

    ngOnInit() {
        this.carService.getCarsSmall().then(cars => this.cars1 = cars);
        this.carService.getCarsSmall().then(cars => this.cars2 = cars);

        this.brands = [
            {label: 'Audi', value: 'Audi'},
            {label: 'BMW', value: 'BMW'},
            {label: 'Fiat', value: 'Fiat'},
            {label: 'Ford', value: 'Ford'},
            {label: 'Honda', value: 'Honda'},
            {label: 'Jaguar', value: 'Jaguar'},
            {label: 'Mercedes', value: 'Mercedes'},
            {label: 'Renault', value: 'Renault'},
            {label: 'VW', value: 'VW'},
            {label: 'Volvo', value: 'Volvo'}
        ];

        this.createForm();
    }

    private createForm(): void {  
        this.carForm = this.fb.group({  
            tableRowArray: this.fb.array([  
                this.createTableRow()  
            ])  
        })  
    }

    private createTableRow(): FormGroup {  
        return this.fb.group({  
            vin: new FormControl(null, {  
                validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]  
            }),  
            brand: new FormControl(null, {  
                validators: [Validators.required, Validators.maxLength(500)]  
            }),  
            year: new FormControl(null, {  
                validators: [Validators.required, Validators.pattern(/^\d{4}$/), Validators.minLength(4), Validators.maxLength(4)]  
            }),  
            price: new FormControl(null, {  
                validators: [Validators.required, Validators.pattern(/^\d{1,6}(?:\.\d{0,2})?$/), Validators.minLength(3), Validators.maxLength(50)]  
            }),  
            color: new FormControl(null, {  
                validators: [Validators.required, Validators.maxLength(500)]  
            }),
            isSold: new FormControl({  
                value: true,  
                disabled: true  
            })  
        });  
    }

    get tableRowArray(): FormArray {  
      return this.carForm.get('tableRowArray') as FormArray;  
    }

    addNewRow(): void {  
      this.tableRowArray.push(this.createTableRow());
      //this.cars1.push({"brand": "", "year": 2020, "color": "", "vin": "", "sold": false});
      //this.newRowAdded = true;
    }
    
    onDeleteRow(rowIndex:number): void {  
      this.tableRowArray.removeAt(rowIndex);  
    }  

    onKeyDown(event: KeyboardEvent) {
      //console.log(event);
      if (
        event.key === 'Tab' && this.cellBeingEdited == 'color' && 
        this.rowBeingEdited == this.cars1.length - 1
      ) {
        this.addNewRow();
      }
    }

    toggleSold(event, car: Car) {
      car.sold = event.checked;
    }
}
