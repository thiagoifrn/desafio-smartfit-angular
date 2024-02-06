import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
})
export class FormsComponent implements OnInit {
  results = [];
  formGroup!: FormGroup;

  constructor(private FormBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.FormBuilder.group({
      hour: '',
      showClosed: false,
    });
  }

  onSubmit(): void {
    console.log(this.formGroup.value);
  }
  onClean(): void {
    this.formGroup.reset();
  }
}
