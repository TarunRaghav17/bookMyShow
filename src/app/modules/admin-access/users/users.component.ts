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
  UsersData: any[] = []
  constructor(private adminService: AdminService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.getAllUserData()
  }

  getAllUserData() {
    this.adminService.getAllUsers().subscribe((res) => {
      this.UsersData = res.data.users

    })
  }

  userGetById(id: any) {
    this.adminService.getUserById(id).subscribe(() => {

    })
  }

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
