import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  usersData: any[] = [];
  searchText: string = '';

  constructor(private adminService: AdminService, private toastr: ToastrService) { }



  ngOnInit() {
    this.getAllUserData()

  }

  /**
   * @description Get all users from backend and update usersData
   * @author Gurmeet Kumar
   * @return void
   */
  getAllUserData(): void {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.usersData = res.data.users;
      },
      error: (res) => {
        this.toastr.error(res.error);
      }
    });
  }

  /**
   * @description Get user details by userId
   * @author Gurmeet Kumar
   * @return void
   */
  userGetById(id: any): void {
    this.adminService.getUserById(id).subscribe({
      next: () => {
        this.toastr.success("User get byId");
      },
      error: (res) => {
        this.toastr.error(res.error);
      }
    });
  }

  /**
   * @description Delete user by userId and refresh list
   * @author Gurmeet Kumar
   * @return void
   */
  deletUser(id: number): void {
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



  /**
   * @description Delete user by userId and refresh list
   * @author Gurmeet Kumar
   * @return void
   * @param searchText
   */

  onSearchUserData(searchText: any) {
    if (!searchText)
      return;
    of(searchText).pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      switchMap((val: string) => this.adminService.serachUsers(val.trim()))
    ).subscribe({
      next: (res: any) => {
        if (!searchText) {
          this.getAllUserData()
        }
        this.usersData = res.data.users
      },
      error: (err) => {
        console.error('Search error:', err);
        this.usersData = [];
      }
    });
  }


  /**
    * @description Here is Get the Data By param Iniside Html Select element 
    * @author Gurmeet Kumar
    * @param role
    * @return void
    */

  selectRoleByList(role: any) {
    this.adminService.getAllDataListByRole(role.target.value).subscribe({
      next: (res) => {
        if (role.target.value == 'All') {
          this.getAllUserData()
        }
        this.usersData = res?.data?.users;
      },
      error: (err) => console.error(err)
    });
  }
}