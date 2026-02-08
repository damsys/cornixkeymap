import { Injectable, signal } from '@angular/core';

export type KeymapLayout = 'us' | 'jis';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  /** キー配列: JIS をデフォルトとする */
  readonly layout = signal<KeymapLayout>('jis');

  setLayout(value: KeymapLayout): void {
    this.layout.set(value);
  }
}
