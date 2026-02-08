import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeymapViewerComponent } from './components/keymap-viewer/keymap-viewer.component';
import { KeyboardSvgComponent } from './components/keyboard-svg/keyboard-svg.component';
import { VialParserService } from './services/vial-parser.service';
import { LayoutService } from './services/layout.service';
import type { ParsedKeymap } from './models/keymap';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, KeymapViewerComponent, KeyboardSvgComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('キーマップビューア');
  protected readonly keymap = signal<ParsedKeymap | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly dragOver = signal(false);

  constructor(
    private vialParser: VialParserService,
    protected layoutService: LayoutService,
  ) {}

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.loadFile(file);
    input.value = '';
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.loadFile(file);
  }

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(true);
  }

  protected onDragLeave() {
    this.dragOver.set(false);
  }

  protected clearKeymap() {
    this.keymap.set(null);
    this.error.set(null);
  }

  protected print() {
    window.print();
  }

  private loadFile(file: File) {
    this.error.set(null);
    if (!file.name.toLowerCase().endsWith('.vil')) {
      this.error.set('.vil ファイルを選択してください。');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const keymap = this.vialParser.parseVialFile(text);
        this.keymap.set(keymap);
      } catch (e) {
        console.error('Parse error:', e);
        this.error.set('ファイルの解析に失敗しました。');
      }
    };
    reader.onerror = () => this.error.set('ファイルの読み込みに失敗しました。');
    reader.readAsText(file, 'UTF-8');
  }
}
