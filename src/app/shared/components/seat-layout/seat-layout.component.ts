import { CommonModule, Location } from '@angular/common';
import { Component, ElementRef, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivitiesRoutingModule } from "../../../modules/explore/activities/activities-routing.module";
import { UserAuthComponent } from '../../../auth/user-auth/user-auth.component';
import { AuthService } from '../../../auth/auth-service.service';
import { ToastrService } from 'ngx-toastr';

type SeatStatus = 'available' | 'selected' | 'booked';

interface SeatCategory {
  name: string;
  price: number;
  status: 'available' | 'soldout' | 'almostfull' | 'fillingfast';
}
interface Category {
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
  private ctx!: CanvasRenderingContext2D;

  // UI/config
  showTimes = ['11:05 AM', '02:40 PM', '06:15 PM', '09:50 PM'];
  activeShow = this.showTimes[0]; //user selected show
  movieDetails: any;

  constructor(public commonService: CommonService,
    private modalService: NgbModal,
    private location: Location,
    private authService: AuthService,
    private toaster: ToastrService,
  ) { }

  private modalRef?: NgbModalRef | null = null;
  layouts: Category[] = [
    { layoutName: "Gold", rows: ["A", "B", "C", "D"], cols: 8, price: 1500, topGap: 16 },
    { layoutName: "Silver", rows: ["E", "F", "G", "H"], cols: 12, price: 800, topGap: 28 },
    { layoutName: "Platinum", rows: ["I", "J", "K", "M", "N", "O", "P", "Q", "R"], cols: 12, price: 1000, topGap: 28 }
  ]

  private dpi = 1;
  private padding = 24;
  private seat = { w: 26, h: 26, gapX: 10, gapY: 14, radius: 6 };
  private labelGapY = 20;
  private blockTitleGap = 18;

  seats: Seat[] = [];
  selectedSeats: string[] = [];
  maxSelect = 10;




  noOfSelectedSeats = 2;

  seatCategories: SeatCategory[] = [
    { name: 'RECLINER', price: 1100, status: 'almostfull' },
    { name: 'XTRA LEGROOM', price: 528, status: 'soldout' },
    { name: 'PRIME', price: 440, status: 'soldout' },
    { name: 'CLASSIC', price: 420, status: 'fillingfast' }
  ];

  ngAfterViewInit() {
    this.commonService.showHeader.set(false)
    this.initializeCanvas()
    this.open(this.seatModal);
  }
  ngOnDestroy() {
    this.commonService.showHeader.set(true);
    this.close()
  }
  get totalPrice() {
    return this.seats
      .filter(s => s.status === 'selected')
      .reduce((sum, s) => sum + s.price, 0);
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
    this.location.back()
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

  @HostListener('window:resize')
  onResize() {
    this.rebuildLayout();
    this.draw();
  }
  switchShow(t: string) {
    this.activeShow = t;
    this.randomizeBookedForDemo();
    this.clearSelection();
    this.draw();
  }



  setNoOfSelectedSeats(noOfSelectedSeats: number) {
    this.noOfSelectedSeats = noOfSelectedSeats;
  }

  // ----- Layout building 1-----
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
            id: `${rowLabel}-${c.toString().padStart(2, '0')}`,
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
    this.seats.forEach(s => {
      if (s.status !== 'selected') s.status = 'available';
    });
    const toBook = Math.floor(this.seats.length * 0.1);
    for (let i = 0; i < toBook; i++) {
      const idx = Math.floor(Math.random() * this.seats.length);
      if (this.seats[idx].status === 'available') this.seats[idx].status = 'booked';
    }
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

  // ----- Drawing 3-----
  private draw() {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(this.offsetX, this.offsetY); // PAN OFFSET applied here

    let yTitleAnchor = 0;
    let legendWidth = 30;
    let x = 10;
    let y = 25;
    let h = this.getContentBounds().height

    // Draw rounded rectangle background
    ctx.fillStyle = '#f5f5f5';
    this.roundRect(ctx, x, y, legendWidth, h, 10); // radius 30
    ctx.fill();
    for (const cat of this.layouts) {
      const first = this.seats.find(s => s.categoryId === cat.layoutName);
      if (first) {
        yTitleAnchor = first.y - this.blockTitleGap + 4;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#555';
        ctx.fillText(`${cat.price} ${cat.layoutName}`, canvas.width / this.dpi / 2 - this.offsetX, yTitleAnchor);
      }

      const catRows = [...new Set(this.seats.filter(s => s.categoryId === cat.layoutName).map(s => s.row))];

      catRows.forEach((row) => {
        const firstInRow = this.seats.find(s => s.categoryId === cat.layoutName && s.row === row)!;
        ctx.textAlign = 'left';
        ctx.fillStyle = 'black';
        ctx.font = '12px sans-serif';
        ctx.fillText(row, 20, firstInRow.y + firstInRow.h - 6);
      });

      this.drawScreen3D()

      for (const s of this.seats.filter(S => S.categoryId === cat.layoutName)) {
        this.drawSeatRect(s);
      }
    }
    ctx.restore();
  }

  private drawScreen3D() {
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;
    const screenWidthTop = canvas.width * 0.6;   // top width
    const screenWidthBottom = canvas.width * 0.7; // bottom width
    const screenHeight = 40;

    // find bottom-most seat
    const maxSeatBottom = Math.max(...this.seats.map(s => s.y + s.h));

    // dynamic positioning
    const yTop = maxSeatBottom + 50;  // start 50px below the last seat
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
    let noOfSeats: number = this.noOfSelectedSeats
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = evt.clientX - rect.left - this.offsetX;
    const y = evt.clientY - rect.top - this.offsetY;
    const hit = this.seats.find(
      s => x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h
    );

    if (!hit) return;
    if (hit.status === 'booked') return;

    // ---- RESET PREVIOUS SELECTION ----
    this.seats.forEach(s => {
      if (s.status === 'selected') {
        s.status = 'available';
      }
    });
    this.selectedSeats = [];

    // ---- CONTIGUOUS SEAT SELECTION ----
    const rowSeats = this.seats
      .filter(s => s.row === hit.row)
      .sort((a, b) => a.col - b.col);

    const startIndex = rowSeats.findIndex(s => s.id === hit.id);

    let block: any[] = [];

    // 1. Try forward block (hit → hit+noOfSeats)
    const forwardBlock = rowSeats.slice(startIndex, startIndex + noOfSeats);
    if (forwardBlock.length === noOfSeats && forwardBlock.every(s => s.status === 'available')) {
      block = forwardBlock;
    } else {
      // 2. Try backward block (hit-noOfSeats+1 → hit)
      const backwardBlock = rowSeats.slice(startIndex - noOfSeats + 1, startIndex + 1);
      if (backwardBlock.length === noOfSeats && backwardBlock.every(s => s.status === 'available')) {
        block = backwardBlock;
      }
    }
    if (block.length === noOfSeats) {
      block.forEach(s => {
        s.status = 'selected';
        this.selectedSeats.push(s.id);
      });
    } else {
      console.warn("No contiguous block available.");
      return;
    }

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
    if (!user) {
      let res = confirm('Please log in to book this Show.');
      if (res) {
        const modalOptions: NgbModalOptions = { centered: true };
        this.modalService.open(UserAuthComponent, modalOptions);
      }
      return;
    }
let confirmTicket = confirm(`Proceeding with: ${this.selectedSeats.join(', ')} (₹${this.totalPrice})`);  

if(confirmTicket){
  this.toaster.success(`${this.selectedSeats.join(', ')} Booked Successfully.`);
  this.location.back()

}

  }
}
