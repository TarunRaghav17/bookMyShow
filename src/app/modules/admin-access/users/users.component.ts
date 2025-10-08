import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SortPipe } from '../../../core/pipes/sort.pipe';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  searchControl: FormControl = new FormControl(); // FormControl for search input
  openedDropdownId: string | null = null;
  rowData: any[] = [];
  searchText: string = '';
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;
  isLoading = false;
  scrollTimeout: any;
  loading: boolean = false;
  hasMoreData = true;
  selectedRole: string = 'All'
  currentSortKey: string = '';
  currentSortOrder: 'asc' | 'desc' = 'asc';
  colDefVal: [] = []

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private sortPipe: SortPipe
  ) { }

  ngOnInit() {
    this.getAllUserData();
    this.onSearchHandler();
  }
  /**
   * @description Get all users from backend and update rowData
   * @author Gurmeet Kumar
   * @return void
   */
  getAllUserData(role?: any): void {
    if (role?.target) {
      this.selectedRole = role.target.value;
      this.page = 0;
      this.rowData = [];
    }
    this.loading = true;
    this.adminService.getAllUsers(this.page, this.size, this.selectedRole).subscribe({
      next: (res: any) => {
        this.totalCount = res.data.totalEntries;
        this.rowData = [...this.rowData, ...res.data.users];
        this.hasMoreData = this.rowData.length < this.totalCount;
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
            this.rowData = res.data.users;
            return;
          }
        },
        error: (err) => {
          this.toastr.error(err.message);
          this.rowData = [];
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
          this.rowData = [];
          this.page = 0;
          this.getAllUserData(this.selectedRole);
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
        this.rowData = [];
        this.page = 0;
        this.getAllUserData(this.selectedRole);
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
  onScroll() {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const allLoaded = this.rowData.length >= this.totalCount;
      if (allLoaded || this.isLoading) return;
      this.page++;
      this.getAllUserData();
    }, 500);
  }


  /**
    * @description Toggle Fun for the shorting values.
    * @author Gurmeet Kumar
    ** @param userId - The user's ID
    */

  toggleSort(key: string) {
    if (this.currentSortKey === key) {
      this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortKey = key;
      this.currentSortOrder = 'asc';
    }
    this.rowData = this.sortPipe.transform(
      this.rowData,
      this.currentSortOrder,
      this.currentSortKey
    );
  }

  /**
    * @description Heddings array of table.
    * @author Gurmeet Kumar
    ** @param userId - The user's ID
    */
  colDefs = [
    { field: 'userId', headerName: 'Id', sortable: true },
    { field: 'username', headerName: 'UserName', sortable: true },
    { field: 'name', headerName: 'Name', sortable: true },
    { field: 'email', headerName: 'Email', sortable: true },
    { field: 'phoneNumber', headerName: 'Phone', sortable: true },
    { field: 'roleName', headerName: 'RoleName', sortable: false },
    { field: 'actions', headerName: 'Actions', sortable: false }
  ];

}