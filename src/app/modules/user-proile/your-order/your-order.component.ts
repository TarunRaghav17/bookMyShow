import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-your-order',
  standalone: false,
  templateUrl: './your-order.component.html',
  styleUrl: './your-order.component.scss'
})
export class YourOrderComponent {
  constructor(private service: CommonService) {

  }
  ngOnInit(): void {
    this.service._profileHeader.set(true)

  }

  ngOnDestroy() {
    this.service._profileHeader.set(false)
  }
}
