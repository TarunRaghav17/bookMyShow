import { CommonModule } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivitiesRoutingModule } from "../../../modules/explore/activities/activities-routing.module";
import { UserAuthComponent } from '../../../auth/user-auth/user-auth.component';
import { AuthService } from '../../../auth/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

type SeatStatus = 'available' | 'selected' | 'booked';


interface Category {
  id: number;
  layoutName: string;
  price: number;
  rows: string[];
  cols: number;
  topGap?: number;
}

interface Seat {
  id: string;
  row: string;
  col: number;
  x: number;
  y: number;
  w: number;
  h: number;
  status: SeatStatus;
  categoryId: string;
  price: number;
}

@Component({
  selector: 'app-seat-layout',
  standalone: true,
  imports: [CommonModule, ActivitiesRoutingModule],
  templateUrl: './seat-layout.component.html',
  styleUrl: './seat-layout.component.scss'
})
export class SeatLayoutComponent {
  @ViewChild('seatCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('seatModal', { static: true }) seatModal!: TemplateRef<any>;
  @ViewChild('confirmModal', { static: true }) confirmModal!: TemplateRef<any>;
  @ViewChild('confirmSeatBookingModal', { static: true }) confirmSeatBookingModal!: TemplateRef<any>;

  private ctx!: CanvasRenderingContext2D;

  screenShows: any[] = [];
  // showData:any[]=[]
  activeShow: any = [];
  movieDetails: any;
  venueDetails: any;
  userSelectedVenueScreen!: any[];
  reservedSeats: any[] = [];
  venueId!: string

  constructor(public commonService: CommonService,
    private modalService: NgbModal,
    private authService: AuthService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.screenShows = navigation?.extras?.state?.['screenShows'].map((screen: any) => ({
      screenId: screen.screenId,
      showTimes: screen.showTimes
    }));
    this.venueId = navigation?.extras?.state?.['venueId'];
  }
  private modalRef?: NgbModalRef | null = null;
  layouts: Category[] = [];

  private dpi = 1;
  private padding = 24;
  private seat = { w: 26, h: 26, gapX: 10, gapY: 14, radius: 6 };
  private labelGapY = 20;
  private blockTitleGap = 18;

  seats: Seat[] = [];
  selectedSeats: string[] = [];
  maxSelect = 10;
  noOfSelectedSeats = 2;

  ngOnInit() {
    this.commonService.showHeader.set(false)
    this.fetchContentIdByUrl();
    this.fetchVenueById();
    this.activeShow = this.commonService.getUserSelectedShow();
    this.getReservedSeatsByShowId(this.activeShow.showDateId, this.activeShow.showTimeId);
  }

  ngAfterViewInit() {
    this.initializeCanvas();
    this.open(this.seatModal);
  }

  ngOnDestroy() {
    this.commonService.showHeader.set(true);
    this.close();
  }
  get totalPrice() {
    return this.seats
      .filter(s => s.status === 'selected')
      .reduce((sum, s) => sum + s.price, 0);
  }

  getReservedSeatsByShowId(showTimeDateId: string | undefined, showTimeId: string | undefined) {
    this.reservedSeats = []
    this.commonService.getReservedSeats(showTimeDateId, showTimeId).subscribe(
      {
        next: (res) => {
          this.reservedSeats = res.data || [];
          this.randomizeBookedForDemo();
        },
        error: (err) => {
          this.toaster.error(err.error.message)
        }
      }
    )
  }

  fetchContentIdByUrl() {
    let contentId: string | null | undefined = this.route.snapshot.paramMap.get('movieId')?.split('-')[1]
    this.commonService.getContentDetailsById(contentId).subscribe({
      next: (res) => {
        this.movieDetails = res.data;
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })
  }

  fetchVenueById() {
    let venueId: string | null | undefined = this.route.snapshot.paramMap.get('theatreId')?.split('-')[1]
    this.commonService.getVenueDetailsById(venueId).subscribe({
      next: (res) => {
        this.venueDetails = res.data;
        const screenLayout = this.venueDetails.screens.find(
          (screen: any) => screen.id == this.activeShow.screenId
        );

        const layouts = screenLayout?.layouts || [];
        const availableCategories = this.activeShow.availableCategories || [];
        this.layouts = layouts.map((layout: any) => {
          const matchedCategory = availableCategories.find(
            (cat: any) => cat.categoryName === layout.layoutName
          );
          return {
            id: layout.id,
            layoutName: layout.layoutName,
            rows: layout.rows,
            cols: layout.cols,
            price: matchedCategory ? Number(matchedCategory.categoryPrice) : 0,
            topGap: layout.topGap ?? 20,
          };
        });
        this.initializeCanvas()
      },

      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    })
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

  goBack() {
    this.router.navigate([`/movies/${this.commonService._selectCity()?.toLowerCase()}/${this.movieDetails.eventId}/buytickets/${this.movieDetails.eventId}`]);
  }

  // ---- Drag/Pan state ----
  private offsetX = 0;
  private offsetY = 0;
  private lastX = 0;
  private lastY = 0;
  private isDragging = false;

  initializeCanvas() {

    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.rebuildLayout();
    this.draw();

    const canvas = this.canvasRef.nativeElement;
    canvas.addEventListener("mousemove", (e: MouseEvent) =>
      this.onMouseMove(e)
    );

    // Mouse drag events
    canvas.addEventListener('mousedown', this.startDrag.bind(this));
    canvas.addEventListener('mousemove', this.drag.bind(this));
    canvas.addEventListener('mouseup', this.endDrag.bind(this));
    canvas.addEventListener('mouseleave', this.endDrag.bind(this));

    // Touch drag events (mobile)
    canvas.addEventListener('touchstart', this.startDrag.bind(this));
    canvas.addEventListener('touchmove', this.drag.bind(this));
    canvas.addEventListener('touchend', this.endDrag.bind(this));
  }


  switchShow(t: any, show: any) {
    let activeShow = { ...t, screenId: show.screenId };
    if (activeShow.screenId == this.activeShow.screenId && this.activeShow.showIds[0] == activeShow.showIds[0] && this.activeShow.time == activeShow.time) return;

    else {
      this.activeShow = activeShow
      this.commonService.setUserSelectedShow(this.activeShow);
      this.router.navigate([`/movies/city-${this.commonService._selectCity()?.toLowerCase()}/seat-layout/eventId-${this.movieDetails?.eventId}/venueId-${this.venueId}/screenId-${this.activeShow.screenId}/showId-${this.commonService.userSelectedShow()?.showIds[0]}/showDateId-${this.commonService.userSelectedShow()?.showDateId}/showTimeId-${this.commonService.userSelectedShow()?.showTimeId}/date-${this.commonService.userSelectedDate()?.today}`], { replaceUrl: true, state: { screenShows: this.screenShows, venueId: this.venueId } });
      this.fetchVenueById()
      this.getReservedSeatsByShowId(this.activeShow.showDateId, this.activeShow.showTimeId);
      this.clearSelection();
      this.draw();
    }

  }

  setNoOfSelectedSeats(noOfSelectedSeats: number) {
    this.noOfSelectedSeats = noOfSelectedSeats;
    this.clearSelection();
    this.initializeCanvas()
  }

  private rebuildLayout() {
    const shell = this.canvasRef.nativeElement.parentElement as HTMLElement;
    const cssW = Math.min(shell.clientWidth, 1100);
    const cssH = 540;

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    this.dpi = dpr;

    const canvas = this.canvasRef.nativeElement;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.buildSeats(cssW);
  }

  private buildSeats(viewWidth: number) {
    const seats: Seat[] = [];
    const left = this.padding;
    let y = this.padding;
    const centerX = (viewWidth) / 2;

    this.layouts.forEach(cat => {
      y += cat.topGap ?? 0;
      y += this.blockTitleGap;

      cat.rows.forEach(rowLabel => {
        const rowWidth = (this.seat.w * cat.cols) + (this.seat.gapX * (cat.cols - 1));
        let startX = centerX - rowWidth / 2;
        startX = Math.max(startX, left + 40);

        for (let c = 1; c <= cat.cols; c++) {
          const x = startX + (c - 1) * (this.seat.w + this.seat.gapX);

          const seat: Seat = {
            id: `${rowLabel}${c.toString()}`,
            row: rowLabel,
            col: c,
            x, y,
            w: this.seat.w,
            h: this.seat.h,
            status: 'available',
            categoryId: cat.layoutName,
            price: cat.price,
          };
          seats.push(seat);
        }
        y += this.seat.h + this.seat.gapY;
      });

      y += this.labelGapY;
    });

    this.seats = seats;
    this.randomizeBookedForDemo();
  }

  private randomizeBookedForDemo() {

    const reservedSeatObjects = this.reservedSeats.map(id => {
      const found = this.seats.find(s => s.id === id);
      return found
        ? {
          id: found.id,
          row: found.row,
          col: found.col,
          price: found.price,
          category: found.categoryId,
          x: found.x,
          y: found.y,
          w: found.w,
          h: found.h,
          status: "booked",
        }

        : null;
    }).filter(Boolean);

    if (!this.seats?.length || !reservedSeatObjects?.length) return;

    this.seats.forEach(s => {
      const reserved = reservedSeatObjects.some(r => r?.id === s.id);
      if (reserved) s.status = 'booked';
    });

    this.draw();

  }

  private clearSelection() {
    this.selectedSeats = [];
    this.seats.forEach(s => { if (s.status === 'selected') s.status = 'available'; });
  }

  private getContentBounds() {
    const minX = Math.min(...this.seats.map(s => s.x));
    const minY = Math.min(...this.seats.map(s => s.y));
    const maxX = Math.max(...this.seats.map(s => s.x + s.w));
    const maxY = Math.max(...this.seats.map(s => s.y + s.h));
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY };
  }

  private draw() {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);

    let yTitleAnchor = 0;
    let legendWidth = 30;
    let x = 10;
    let y = 25;
    let h = this.getContentBounds().height

    ctx.fillStyle = '#f5f5f5';
    this.roundRect(ctx, x, y, legendWidth, h, 10);
    ctx.fill();
    for (const cat of this.layouts) {
      const first = this.seats.find(s => s.categoryId === cat.layoutName);
      if (first) {
        yTitleAnchor = first.y - this.blockTitleGap + 4;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#555';
        ctx.fillText(`₹${cat.price} ${cat.layoutName.toUpperCase()}`, canvas.width / this.dpi / 2 - this.offsetX, yTitleAnchor);
      }

      const catRows = [...new Set(this.seats.filter(s => s.categoryId === cat.layoutName).map(s => s.row))];

      catRows.forEach((row) => {
        const firstInRow = this.seats.find(s => s.categoryId === cat.layoutName && s.row === row)!;
        ctx.textAlign = 'left';
        ctx.fillStyle = 'black';
        ctx.font = '12px sans-serif';
        ctx.fillText(row, 20, firstInRow.y + firstInRow.h - 6);
      });

      this.drawScreen3D();

      for (const s of this.seats.filter(S => S.categoryId === cat.layoutName)) {
        this.drawSeatRect(s);
      }
    }
    ctx.restore();
  }

  private drawScreen3D() {
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;
    const screenWidthTop = canvas.width * 0.6;
    const screenWidthBottom = canvas.width * 0.7;
    const screenHeight = 40;

    const maxSeatBottom = Math.max(...this.seats.map(s => s.y + s.h));

    const yTop = maxSeatBottom + 50;
    const yBottom = yTop + screenHeight;

    const xTop = (canvas.width - screenWidthTop) / 2;
    const xBottom = (canvas.width - screenWidthBottom) / 2;

    ctx.beginPath();
    ctx.moveTo(xTop, yTop);
    ctx.lineTo(xTop + screenWidthTop, yTop);
    ctx.lineTo(xBottom + screenWidthBottom, yBottom);
    ctx.lineTo(xBottom, yBottom);
    ctx.closePath();

    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
    ctx.fill();

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#cbd5e1";
    ctx.stroke();

    ctx.font = "14px system-ui, Arial";
    ctx.fillStyle = "#6b7280";
    ctx.textAlign = "center";
    ctx.fillText("All eyes this way please", canvas.width / 2, yBottom + 25);
  }

  roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
  private drawSeatRect(s: Seat) {
    const ctx = this.ctx;
    const stroke = s.status == 'booked' ? '#e5e7eb' : '#22c55e'
    const fill = s.status === 'booked' ? '#e5e7eb' : s.status === 'selected' ? '#22c55e' : '#ffffff';

    const r = this.seat.radius;
    const x = s.x, y = s.y, w = s.w, h = s.h;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();

    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.stroke();

    ctx.fillStyle = s.status === 'selected' ? '#fff' : '#475569';
    ctx.textAlign = 'center';
    ctx.font = '10px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    const label = s.col.toString().padStart(2, '0');
    ctx.fillText(label, x + w / 2, y + h / 2 + 3);
  }

  onCanvasClick(evt: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = evt.clientX - rect.left - this.offsetX;
    const y = evt.clientY - rect.top - this.offsetY;

    const hit = this.seats.find(
      s => x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h
    );
    if (!hit || hit.status === 'booked') return;

    const maxSeats = this.noOfSelectedSeats;
    let selectedCount = this.selectedSeats.length;

    // Deselect if clicked again
    if (hit.status === 'selected') {
      hit.status = 'available';
      this.selectedSeats = this.selectedSeats.filter(id => id !== hit.id);
      this.draw();
      return;
    }

    // Reset if full
    if (selectedCount >= maxSeats) {
      this.seats.forEach(s => { if (s.status === 'selected') s.status = 'available'; });
      this.selectedSeats = [];
      selectedCount = 0;
    }

    let remaining = maxSeats - selectedCount;

    const rowSeats = this.seats
      .filter(s => s.row === hit.row)
      .sort((a, b) => a.col - b.col);
    const startIndex = rowSeats.findIndex(s => s.id === hit.id);
    if (startIndex === -1) return;

    // Check forward
    const forwardBlock: any[] = [];
    for (let i = startIndex; i < rowSeats.length && forwardBlock.length < remaining; i++) {
      if (rowSeats[i].status === 'available') forwardBlock.push(rowSeats[i]);
      else break;
    }

    // Check backward
    const backwardBlock: any[] = [];
    for (let i = startIndex; i >= 0 && backwardBlock.length < remaining; i--) {
      if (rowSeats[i].status === 'available') backwardBlock.unshift(rowSeats[i]);
      else break;
    }

    // Choose the longer contiguous run
    let block =
      forwardBlock.length >= backwardBlock.length
        ? forwardBlock
        : backwardBlock;

    // Select seats
    block.forEach(s => {
      s.status = 'selected';
      this.selectedSeats.push(s.id);
    });

    this.draw();
  }

  // ----- Dragging -----
  private startDrag(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    this.isDragging = true;
    const pos = this.getEventPos(e);
    this.lastX = pos.x;
    this.lastY = pos.y;
    const canvas = this.canvasRef.nativeElement;
    canvas.style.cursor = "grabbing";
  }

  private drag(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    e.preventDefault();
    const pos = this.getEventPos(e);
    const dx = pos.x - this.lastX;
    const dy = pos.y - this.lastY;

    this.offsetX += dx;
    this.offsetY += dy;

    // clamp to prevent moving out of bounds
    const canvas = this.canvasRef.nativeElement;
    const maxX = canvas.width * 0.4;
    const maxY = canvas.height * 1

    if (this.offsetX > maxX) this.offsetX = maxX;
    if (this.offsetX < -maxX) this.offsetX = -maxX;

    if (this.offsetY > maxY) this.offsetY = maxY;
    if (this.offsetY < -maxY) this.offsetY = -maxY;

    this.lastX = pos.x;
    this.lastY = pos.y;

    this.draw();
    canvas.style.cursor = "grabbing";
  }

  private endDrag(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    this.isDragging = false;
    const canvas = this.canvasRef.nativeElement;
    canvas.style.cursor = "grab";
  }

  private getEventPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    if (e instanceof MouseEvent) {
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    } else {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
  }

  // ---- Hover Detection ----
  private isMouseOverSeat(x: number, y: number, seat: Seat): boolean {
    return (
      x >= seat.x + this.offsetX &&
      x <= seat.x + seat.w + this.offsetX &&
      y >= seat.y + this.offsetY &&
      y <= seat.y + seat.h + this.offsetY
    );
  }

  private onMouseMove(e: MouseEvent) {
    if (this.isDragging) return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let overSeat = false;

    for (const seat of this.seats) {
      if (this.isMouseOverSeat(mouseX, mouseY, seat)) {
        overSeat = true;
        break;
      }
    }
    // update cursor
    this.canvasRef.nativeElement.style.cursor = overSeat ? "pointer" : "grab";
  }

  handleBookNow(): void {
    let user = this.authService.getUserFromToken()
    let payload = [
      {

        "userId": user?.userId,
        "eventId": this.movieDetails?.eventId,
        "venueId": this.venueDetails?.id,
        "screenId": this.activeShow?.screenId,
        "showId": Number(this.activeShow?.showIds?.[0]),
        "date": this.commonService?.getUserSelectedDate()?.today,
        "time": this.activeShow?.time,
        "reservedSeats": this.selectedSeats,
        "totalPrice": this.totalPrice,
      }
    ]
    this.commonService.bookUserSeats(payload).subscribe({
      next: (res) => {
        this.toaster.success(`${this.selectedSeats.join(', ')} ${res.message}`);
        this.close()
        this.goBack()
      },
      error: (err) => {
        this.toaster.error(err.error.message)
        this.close()
      }
    })
  }
  openLoginModal() {
    this.close()
    const modalOptions: NgbModalOptions = { centered: true };
    this.modalService.open(UserAuthComponent, modalOptions);
  }

  confirmBookNow() {
    let user = this.authService.getUserFromToken()
    if (!user) {
      this.open(this.confirmModal)
    }
    else {
      this.open(this.confirmSeatBookingModal)
    }
  }
}
