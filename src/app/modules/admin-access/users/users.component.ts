import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  usersData: any[] = []
  constructor(private adminService: AdminService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.getAllUserData()
  }

  /**
  * @description Get all users List 
  * @author Gurmeet Kumar
  */
  getAllUserData() {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.usersData = res.data.users
      },
      error: (res) => {
        this.toastr.error(res.error);
      }
    });
  }


  /**
  * @description user Get by userId   
  * @author Gurmeet Kumar
  */
  userGetById(id: any) {
    this.adminService.getUserById(id).subscribe({
      next: () => {
        this.toastr.success("User get byId")
      },
      error: (res) => {
        this.toastr.error(res.error);
      }
    });
  }

  /**
  * @description delete by userID 
  * @author Gurmeet Kumar
  */
  deletUser(id: number) {
    this.adminService.deleteUserById(id).subscribe({
      next: () => {
        this.toastr.success('Delete Users SuccessFully');
        this.getAllUserData();
      },
      error: () => {
        this.toastr.error('Something went wrong');
      }
    });
  }





}
