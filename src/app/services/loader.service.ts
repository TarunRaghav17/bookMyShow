import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _requestCount = signal(0);
  readonly loading = computed(() => this._requestCount() > 0);

  showLoader() {
    this._requestCount.update(c => c + 1);
  }

  hideLoader() {
    this._requestCount.update(c => Math.max(0, c - 1));
  }
}
