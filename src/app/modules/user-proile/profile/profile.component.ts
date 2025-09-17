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
  modalForm!: FormGroup; // separate form for modal (email / phone)

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
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  ngOnDestroy(): void {
    this.service._profileHeader.set(false);
  }

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

  openEditProfileModal(editProfileModal: TemplateRef<any>, type: 'email' | 'number'): void {
    this.editNumberFlag = type === 'number';
    this.modalForm.reset();
    this.modalRef = this.modalService.open(editProfileModal, {
      backdrop: 'static',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  closeEditProfileModal(): void {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }

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

  onSubmitProfile(): void {
    if (this.editProfileForm.invalid) {
      this.toastr.error('Please fill required fields');
      return;
    }

    // const payload = {
    //   ...this.editProfileForm.value,
    //   profileImage: this.base64String || null,
    // };

    // this.userService.updateProfile(payload).subscribe({
    //   next: (res: any) => {
    //     this.toastr.success('Profile updated successfully');
    //   },
    //   error: (err: any) => {
    //     this.toastr.error(err.error.message, 'Error');
    //   },
    // });
  }

  
  onSubmitModal(): void {
    if (this.editNumberFlag) {
      if (this.modalForm.get('phone')?.invalid) {
        this.toastr.error('Enter a valid 10-digit phone number');
        return;
      }
    } else {
      if (this.modalForm.get('email')?.invalid) {
        this.toastr.error('Enter a valid email');
        return;
      }
    }

    const payload: any = {};
    if (this.editNumberFlag) {
      payload.phone = this.modalForm.value.phone;
    } else {
      payload.email = this.modalForm.value.email;
    }

    // this.userService.updateProfile(payload).subscribe({
    //   next: () => {
    //     this.toastr.success(`${this.editNumberFlag ? 'Phone' : 'Email'} updated successfully`);
    //     this.closeEditProfileModal();
    //   },
    //   error: (err: any) => {
    //     this.toastr.error(err.error.message, 'Error');
    //   },
    // });
  }
}
