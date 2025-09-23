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
import { AuthService } from '../../../auth/auth-service.service';
import { Router } from '@angular/router';

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
  getProfileDataId: any;
  userDetails: any;
  profileImage: any;
  maxDateValue: any;

  constructor(
    public commonService: CommonService,
    private authService: AuthService,
    private userService: UserProfileService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.commonService._profileHeader.set(true);
    this.getProfileDataId = this.authService.userDetailsSignal();
    this.getProfileUser();
    this.getAllStates();
    this.setMaxDate()
    this.editProfileForm = this.fb.group({
      profileImg: [''],
      name: [{ value: '', disabled: !this.userDetails?.name }, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      dob: [''],
      gender: [''],
      married: ['no'],
      anniversaryDate: [''],
      identity: ['women'],
      pincode: ['', [Validators.pattern(/^[0-9]{6}$/), Validators.maxLength(6)]],
      addressLine1: ['', [Validators.maxLength(255)]],
      addressLine2: ['', [Validators.maxLength(255)]],
      city: ['', [Validators.maxLength(100)]],
      state: [''],
    });
    this.modalForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^(?![._-])[A-Za-z0-9._-]+(?<![._-])@(?:(?!-)[A-Za-z-]+(?<!-)\.)+[A-Za-z]{2,}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });

  }

  ngOnDestroy(): void {
    this.commonService._profileHeader.set(false);
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
   * @description Open the edit profile modal and set initial form values based on type and userDetails email or phone number Patch value to modal form
   * @param editProfileModal TemplateRef for the modal content
   * @param type 'email' or 'number' to determine which field to edit
   * @author Gurmeet Kumar
   * @return void
   */
  openEditProfileModal(
    editProfileModal: TemplateRef<any>,
    type: 'email' | 'number'
  ): void {
    this.editNumberFlag = type === 'number';
    this.modalForm.reset();
    if (type === 'number') {
      this.modalForm.get('phoneNumber')?.setValidators([Validators.required]);
      this.modalForm
        .get('phoneNumber')
        ?.patchValue(this.userDetails?.phoneNumber || '');
      this.modalForm.get('email')?.clearValidators();
    } else {
      this.modalForm.get('email')?.setValidators([Validators.required]);
      this.modalForm
        .get('email')
        ?.patchValue(this.userDetails?.email || '');
      this.modalForm.get('phoneNumber')?.clearValidators();
    }
    this.modalForm.get('phoneNumber')?.updateValueAndValidity();
    this.modalForm.get('email')?.updateValueAndValidity();
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
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      this.toastr.error('Only JPG and PNG images are allowed');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result || this.profileImage;
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
    if (this.editProfileForm.valid) {
      const formData = {
        ...this.editProfileForm.value,
        dob: this.commonService.formatDateToMMDDYYYY(
          this.editProfileForm.get('dob')?.value
        ),
        anniversaryDate: this.commonService.formatDateToMMDDYYYY(
          this.editProfileForm.get('anniversaryDate')?.value
        ),
      };

      if (this.base64String) {
        formData.profileImg = this.base64String;
      }

      this.userService
        .updateProfile(this.getProfileDataId?.userId, formData)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res.message);
            this.getProfileUser();
            this.router.navigate(['/']);

          },
          error: (err: any) => {
            this.toastr.error(err.message);
          },
        });
    }
  }

  /**
   * @description Handle modal form submission for email/phone, validate fields
   * @author Gurmeet Kumar
   * @return void
   */
  onVerifyEmailOrPhone(): void {
    if (this.modalForm.invalid) return;
    let payload: any = {
      userId: this.getProfileDataId?.userId,
    };

    if (this.editNumberFlag) {
      payload.phoneNumber = this.modalForm.value.phoneNumber;
    } else {
      payload.email = this.modalForm.value.email;
    }

    this.userService
      .updateEmailOrPhone(this.getProfileDataId?.userId, payload)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res.message);
          this.closeEditProfileModal();
          this.getProfileUser();
        },
        error: (err: any) => this.toastr.error(err.message),
      });
  }

  /**
   * @description Fetch user profile details by ID and patchvalue form fields & userDetails
   * @author Gurmeet Kumar
   * @return void
   */
  getProfileUser() {
    this.userService.getUserById(this.getProfileDataId?.userId).subscribe({
      next: (res: any) => {
        this.userDetails = res.data;
        this.profileImage = this.userDetails?.profileImg;
        this.editProfileForm.patchValue({
          name: this.userDetails?.name,
          username: this.userDetails?.username,
          dob: this.commonService.formatDateForPatch(this.userDetails?.dob),
          anniversaryDate: this.commonService.formatDateForPatch(this.userDetails?.anniversaryDate),
          gender: this.userDetails?.gender,
          married: this.userDetails?.married,
          identity: this.userDetails?.identity,
          pincode: this.userDetails?.pincode,
          addressLine1: this.userDetails?.addressLine1,
          addressLine2: this.userDetails?.addressLine2,
          city: this.userDetails?.city,
          state: this.userDetails?.state,
          profileImg: this.userDetails?.profileImg
        });
        if (this.userDetails?.dob) {
          this.editProfileForm.get('dob')?.disable();
        }
        if (this.userDetails?.name) {
          this.editProfileForm.get('name')?.disable();
        }
      },
      error: (err: any) => {
        this.toastr.error(err.message);
      },
    });
  }


  /** * @description Set the maximum selectable date for the date input to yesterday's date
    * @author Gurmeet Kumar
    * @return void
    */

  setMaxDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    this.maxDateValue = currentDate.toISOString().split('T')[0];
  }

}