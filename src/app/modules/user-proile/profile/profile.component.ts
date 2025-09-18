import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { UserProfileService } from '../service/user-profile.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('editProfileModal', { static: true })
  editProfileModal!: TemplateRef<any>;
  states: any[] = [];
  preview: any;
  base64String: any;
  editNumberFlag: boolean = false;
  private modalRef?: NgbModalRef;
  editProfileForm!: FormGroup;
  modalForm!: FormGroup; 

  constructor(
    private service: CommonService,
    private userService: UserProfileService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.service._profileHeader.set(true);
    this.getAllStates();
    this.editProfileForm = this.fb.group({
      profileImg: [''],
      name: ['', Validators.required],
      username: ['', Validators.required],
      dob: [''],
      gender: [''],
      married: ['yes'],
      anniversaryDate:[''],
      identity: ['women'],
      pincode: [''],
      address1: [''],
      address2: [''],
      landmark: [''],
      city: [''],
      state: [''],
    });

    this.modalForm = this.fb.group({
      email: ['', [Validators.email,Validators.pattern(/^(?![._-])[A-Za-z0-9._-]+(?<![._-])@(?:(?!-)[A-Za-z-]+(?<!-)\.)+[A-Za-z]{2,}$/)]],
      phone: ['', [Validators.required,Validators.pattern(/^[0-9]{10}$/), Validators.minLength(10), Validators.maxLength(15)]],
    });
  }

  ngOnDestroy(): void {
    this.service._profileHeader.set(false);
  }

 /**
  * @description Fetch all states for the state dropdown
  * @author Gurmeet Kumar
  * @return void
  */
  getAllStates(): void {
    this.userService.getAllStates().subscribe({
      next: (res: any) => {
        this.states = res.data.stateDto;
      },
      error: (err: any) => {
        this.toastr.error(err.message);
      },
    });
  }

 /**
  * @description Open modal to edit email or phone number
  * @param editProfileModal TemplateRef for the modal content
  * @param type 'email' or 'number' to determine which field to edit
  * @author Gurmeet Kumar
  * @return void
  */

  openEditProfileModal(editProfileModal: TemplateRef<any>, type: 'email' | 'number'): void {
    this.editNumberFlag = type === 'number';
    this.modalForm.reset();
    this.modalRef = this.modalService.open(editProfileModal, {
      backdrop: 'static',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    });
  }

   /**
  * @description Close the edit profile modal if it's open
  * @author Gurmeet Kumar
  * @return void
  */

  closeEditProfileModal(): void {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }

 /**
  * @description Handle image upload, convert to base64, and set preview
  * @author Gurmeet Kumar
  * @return void
  */
  onUploadImg(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.toastr.error('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result;
      this.base64String = (reader.result as string).split(',')[1];
      this.toastr.success('Image uploaded successfully');
    };
    reader.onerror = () => this.toastr.error('Failed to read file');
    reader.readAsDataURL(file);
  }
 /**
  * @description Handle profile form submission, validate fields
  * @author Gurmeet Kumar
  * @return void
  */

  onSubmitProfile(): void {
    if (this.editProfileForm.invalid) {
      return;
    }
 
  }

 /**
  * @description Handle modal form submission for email/phone, validate fields
  * @author Gurmeet Kumar
  * @return void
  */
  onSubmitModal(): void {
    if (this.editNumberFlag) {
      if (this.modalForm.get('phone')?.invalid) {
        return;
      }
    } else {
      if (this.modalForm.get('email')?.invalid) {
        return;
      }
    }
  }
}
