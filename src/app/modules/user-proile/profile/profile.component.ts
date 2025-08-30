import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'

})
export class ProfileComponent implements OnInit, OnDestroy {

  constructor(private service: CommonService) {

  }
  preview: any;
  base64String: any
  onUploadImg(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.preview = reader.result;
      this.base64String = (reader.result as string).split(',')[1];

    }
  }
  ngOnInit(): void {
    this.service._profileHeader.set(true)
  }

  ngOnDestroy() {
    this.service._profileHeader.set(false)
  }
}




