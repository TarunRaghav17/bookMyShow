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
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;
  loading: boolean = false;
  hasMoreData = true;
  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) { }

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
    if (this.loading || !this.hasMoreData) return;
    this.loading = true;

    this.adminService.getAllUsers(this.page, this.size).subscribe({
      next: (res: any) => {
        this.totalCount = res.data.totalEntries;
        this.usersData = [...this.usersData, ...res.data.users];
        this.hasMoreData = this.usersData.length < this.totalCount;
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.message);
        this.loading = false;
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
        error: (err) => {
          this.toastr.error(err.message);
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
    this.page = 0;
    this.usersData = [];
    this.hasMoreData = true;
    const roleValue = role.target.value;
    if (roleValue === 'All') {
      this.getAllUserData();
      return;
    }
    this.loading = true;
    this.adminService.getAllDataListByRole(roleValue).subscribe({
      next: (res: any) => {
        this.usersData = res?.data?.users || [];
        this.totalCount = this.usersData.length;
        this.hasMoreData = false; // no pagination for filtered roles
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.message);
        this.loading = false;
      },
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
          this.usersData = [];
          this.page = 0;
          this.getAllUserData();
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
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
        this.usersData = [];
        this.page = 0;
        this.getAllUserData();
      },
      error: (res: any) => {
        this.toastr.error(res.message);
      },
    });
  }
  /**
    * @description Scroll by get UserList.
    * @author Gurmeet Kumar
    ** @param userId - The user's ID.
    */
  onScroll(event: any) {
    const element = event.target as HTMLElement;
    const reachedBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 5;
    if (reachedBottom && this.hasMoreData) {
      this.page++;
      this.getAllUserData();
    }
  }
}

