import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  searchControl: FormControl = new FormControl(); // FormControl for search input
  openedDropdownId: string | null = null;
  usersData: any[] = [];
  searchText: string = '';
  selectedRole: any;
  singleUserDetail: any;
  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllUserData();
    this.onSearchHandler();
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
      },
    });
  }

  /**
   * @description Get user details by userId, this.selectedRole this use purpose to auto patch in select Element Role
   * @author Gurmeet Kumar
   * @return void
   * @param id
   */
  userGetById(id: any): void {
    this.adminService.getUserById(id).subscribe({
      next: (res: any) => {
        this.singleUserDetail = res.data.user;
        this.selectedRole = res.data.user.roleName;
      },
      error: (res) => {
        this.toastr.error(res.error);
      },
    });
  }

  /**
   * @description Handles user search with debounce. Fetches all users if search input is empty, or searches users based on query.
   * @author Gurmeet Kumar
   * @return void
   */

  onSearchHandler(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        map((value) => value.trim()),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value) {
            return this.adminService.getAllUsers();
          }
          return this.adminService.serachUsers(value);
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.usersData = res.data.users;
            return;
          }
        },
        error: () => {
          this.usersData = [];
        },
      });
  }

  /**
   * @description Filter user by roles
   * @author Gurmeet Kumar
   * @param role
   * @return void
   */

  selectRoleByList(role: any) {
    if (role.target.value == 'All') {
      this.getAllUserData();
      return;
    }
    this.adminService.getAllDataListByRole(role.target.value).subscribe({
      next: (res) => {
        this.usersData = res?.data?.users;
      },
      error: (err) => this.toastr.error(err.error),
    });
  }

  /**
   * @description Delete user by userId and refresh list
   * @author Gurmeet Kumar
   * @return void
   */
  deleteUser(id: number): void {
    this.adminService.deleteUserById(id).subscribe({
      next: () => {
        if (confirm('Are you sure to delete this user?')) {
          this.toastr.success('Delete Users SuccessFully');
          this.getAllUserData();
        }
      },
      error: () => {
        this.toastr.error('Something went wrong');
      },
    });
  }

  /**
   * @description Toggles dropdown for the specified user ID.
   * @author Gurmeet Kumar
   ** @param userId - The user's ID.
   */

  toggleDropdown(userId: string) {
    if (this.openedDropdownId === userId) {
      this.openedDropdownId = null;
    } else {
      this.openedDropdownId = userId;
      this.userGetById(userId);
    }
  }

  /**
   * @description Makes the specified user an Admin by ID.
   * Makes the specified user an Admin by ID.
   * On success: shows toast, closes dropdown, refreshes user list.
   * On error: shows error toast.
   * @author Gurmeet Kumar
   ** @param userId - The user's ID.
   */

  makeAnAdmin(id: number) {
    this.adminService.editRoleById(id).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.openedDropdownId = null;
        this.getAllUserData();
      },
      error: (res: any) => {
        this.toastr.error(res.message);
      },
    });
  }
}
