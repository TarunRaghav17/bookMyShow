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

  constructor(
    private service: CommonService,
    private userService: UserProfileService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  /**
   * @description Handle profile image upload and convert to Base64 string
   * @param event - File input change event
   * @returns void
   */
  onUploadImg(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.preview = reader.result;
      this.base64String = (reader.result as string).split(',')[1];
    };
  }

  ngOnInit(): void {
    this.service._profileHeader.set(true);
    this.getAllStates();
  }

  ngOnDestroy(): void {
    this.service._profileHeader.set(false);
  }

  /**
   * @description Fetch all states from backend API
   * @returns void
   */
  getAllStates(): void {
    this.userService.getAllStates().subscribe({
      next: (res: any) => {
        this.states = res.data.stateDto;
      },
      error: (err: any) => {
        this.toastr.error(err.error.message, 'Error');
      },
    });
  }

  /**
   * @description Open editProfileModal popup for Email or Number
   * @param editProfileModal - TemplateRef of the modal content
   * @param type - 'email' | 'number'
   */
  openEditProfileModal(editProfileModal: TemplateRef<any>,type: 'email' | 'number'): void {
    this.editNumberFlag = type === 'number'; // true if number, false if email
    this.modalRef = this.modalService.open(editProfileModal, {
      backdrop: 'static',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  /**
   * @description Close ProfileModal  popup
   * @author Gurmeet Kumar
   * @returns void
   */
  closeEditProfileModal(): void {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }
  
}
