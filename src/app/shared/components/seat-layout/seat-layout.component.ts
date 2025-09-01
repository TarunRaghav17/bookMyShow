import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

type SeatStatus = 'available' | 'selected' | 'booked';

interface Category {
  id: string;
  title: string;
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
  imports: [CommonModule],
  templateUrl: './seat-layout.component.html',
  styleUrl: './seat-layout.component.scss'
})
export class SeatLayoutComponent {
  @ViewChild('seatCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  // UI/config
  showTimes = ['11:05 AM', '02:40 PM', '06:15 PM', '09:50 PM'];
  activeShow = this.showTimes[0];






  // layout
  private dpi = 1;
  private padding = 24;
  private seat = { w: 26, h: 26, gapX: 10, gapY: 14, radius: 6 };
  private labelGapY = 20;
  private blockTitleGap = 18;

  legends: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];

  categories: Category[] = [
    { id: 'RECLINER', title: '₹700 RECLINER', price: 700, rows: ['Q', 'P'], cols: 18, topGap: 16 },
    { id: 'PRIME', title: '₹240 PRIME', price: 240, rows: ['N', 'M', 'L', 'K', 'J'], cols: 25, topGap: 28 },
    { id: 'LEGROOM', title: '₹288 XTRA LEGROOM', price: 288, rows: ['H'], cols: 25, topGap: 28 },

  ];

  seats: Seat[] = [];
  selectedSeats: string[] = [];
  maxSelect = 10;

  get totalPrice() {
    return this.seats
      .filter(s => s.status === 'selected')
      .reduce((sum, s) => sum + s.price, 0);
  }

  // ---- Drag/Pan state ----
  private offsetX = 0;
  private offsetY = 0;
  private lastX = 0;
  private lastY = 0;
  private isDragging = false;

  dragStart = {
    x: 0,
    y: 0
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.rebuildLayout();
    this.draw();

    const canvas = this.canvasRef.nativeElement;

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

  confirm() {
    alert(`Proceeding with: ${this.selectedSeats.join(', ')} (₹${this.totalPrice})`);
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
    canvas.style.cursor = 'grab'

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.buildSeats(cssW);
  }

  private buildSeats(viewWidth: number) {
    const seats: Seat[] = [];
    const left = this.padding;
    let y = this.padding;
    const centerX = (viewWidth) / 2;

    this.categories.forEach(cat => {
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
            categoryId: cat.id,
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

  // ----- Drawing 3-----
  private draw() {

    const canvas = this.canvasRef.nativeElement;

    const ctx = this.ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(this.offsetX, this.offsetY); // PAN OFFSET applied here


    let yTitleAnchor = 0;


    let legendWidth = 30;
    let x = 10;
    let y = 25;
    let h = this.canvasRef.nativeElement.height - 50;

    // Draw rounded rectangle background
    ctx.fillStyle = '#f5f5f5';
    this.roundRect(ctx, x, y, legendWidth, h, 10); // radius 30
    ctx.fill();
    for (const cat of this.categories) {
      const first = this.seats.find(s => s.categoryId === cat.id);
      if (first) {
        yTitleAnchor = first.y - this.blockTitleGap + 4;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#555';
        ctx.fillText(cat.title, canvas.width / this.dpi / 2 - this.offsetX, yTitleAnchor);
      }

      const catRows = [...new Set(this.seats.filter(s => s.categoryId === cat.id).map(s => s.row))];

      catRows.forEach((row) => {
        const firstInRow = this.seats.find(s => s.categoryId === cat.id && s.row === row)!;
        ctx.textAlign = 'left';
        ctx.fillStyle = 'black';
        ctx.font = '12px sans-serif';
        ctx.fillText(row, 20, firstInRow.y + firstInRow.h - 6);
        console.log(firstInRow);
      });


      for (const s of this.seats.filter(S => S.categoryId === cat.id)) {
        this.drawSeatRect(s);
      }




    }

    ctx.restore();
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
    const stroke = '#8f9aa3';
    const fill =
      s.status === 'booked' ? '#e5e7eb' :
        s.status === 'selected' ? '#22c55e' :
          '#ffffff';

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
    // console.log(label)
    ctx.fillText(label, x + w / 2, y + h / 2 + 3);
  }

  // ----- Interaction -----
  // onCanvasClick(evt: MouseEvent, noOfSeats: number = 2) {
  //   const rect = this.canvasRef.nativeElement.getBoundingClientRect();
  //   const x = evt.clientX - rect.left - this.offsetX;
  //   const y = evt.clientY - rect.top - this.offsetY;

  //   const hit = this.seats.find(
  //     s => x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h
  //   );

  //   if (!hit) return;
  //    // ---- RESET PREVIOUS SELECTION ----
  //   this.seats.forEach(s => {
  //     if (s.status === 'selected') {
  //       s.status = 'available';
  //     }
  //   });
  //   this.selectedSeats = [];
  //   if (hit.status === 'booked') return;

  //   // If already selected -> unselect
  //   if (hit.status === 'selected') {
  //     hit.status = 'available';
  //     this.selectedSeats = this.selectedSeats.filter(id => id !== hit.id);
  //     this.draw();
  //     return;
  //   }

  //   // ---- CONTIGUOUS SEAT SELECTION ----
  //   // Find all seats in the same row
  //   const rowSeats = this.seats
  //     .filter(s => s.row === hit.row)
  //     .sort((a, b) => a.col - b.col);

  //   // Find the index of the clicked seat
  //   const startIndex = rowSeats.findIndex(s => s.id === hit.id);

  //   // Get the block of `noOfSeats` seats starting from clicked one
  //   const block = rowSeats.slice(startIndex, startIndex + noOfSeats);

  //   // Check if block is valid & all available
  //   if (block.length === noOfSeats && block.every(s => s.status === 'available')) {
  //     block.forEach(s => {
  //       s.status = 'selected';
  //       if (!this.selectedSeats.includes(s.id)) {
  //         this.selectedSeats.push(s.id);
  //       }
  //     });
  //   } else {
  //     console.warn("Not enough available seats together.");
  //     return;
  //   }

  //   this.draw();
  // }
  onCanvasClick(evt: MouseEvent, noOfSeats: number = 2) {
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

    console.log(rowSeats)

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
    canvas.style.cursor = 'grab';
  }

  private drag(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    e.preventDefault();
    const pos = this.getEventPos(e);
    const dx = pos.x - this.lastX;
    const dy = pos.y - this.lastY;

    this.offsetX += dx;
    this.offsetY += dy;

    this.lastX = pos.x;
    this.lastY = pos.y;

    this.draw();
    const canvas = this.canvasRef.nativeElement;
    canvas.style.cursor = 'grabing';
  }

  private endDrag(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    this.isDragging = false;
    const canvas = this.canvasRef.nativeElement;
    canvas.style.cursor = 'cursor';
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

}
