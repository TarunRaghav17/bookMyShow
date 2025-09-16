import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-events-details',
  standalone: true,
  templateUrl: './events-details.component.html',
  styleUrl: './events-details.component.scss'
})
export class EventsDetailsComponent implements OnInit {
  id: any;
  constructor(private route: ActivatedRoute, public commonService: CommonService, private toastr: ToastrService) { }
  eventDetails: any;
  showHeader = false;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.commonService.getEventDetailsById(this.id).subscribe({
      next: (res: any) => {
        this.eventDetails = res.data
      },
      error: () => {
        this.toastr.error("Failed to fetch Id")
      }
    })
  }
  @HostListener('window:scroll')
  onScroll() {
    const section = document.getElementsByClassName('description_movie_section');
    if (!section.length) return;
    this.showHeader = window.scrollY >= (section[0] as HTMLElement).offsetTop;
  }
}
