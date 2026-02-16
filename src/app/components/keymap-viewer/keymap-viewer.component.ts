import { Component, input, signal } from '@angular/core';
import { KeyboardSvgComponent } from '../keyboard-svg/keyboard-svg.component';
import { KeycodeLabelsService } from '../../services/keycode-labels.service';
import { LayoutService } from '../../services/layout.service';
import type { ParsedKeymap } from '../../models/keymap';

@Component({
  selector: 'app-keymap-viewer',
  standalone: true,
  imports: [KeyboardSvgComponent],
  templateUrl: './keymap-viewer.component.html',
  styleUrl: './keymap-viewer.component.scss',
})
export class KeymapViewerComponent {
  keymap = input.required<ParsedKeymap>();

  activeLayerIndex = signal(0);

  constructor(
    public keycodeLabels: KeycodeLabelsService,
    public layoutService: LayoutService,
  ) {}

  get layers() {
    return this.keymap().layers;
  }

  get activeLayer() {
    return this.layers[this.activeLayerIndex()];
  }

  setLayer(i: number) {
    this.activeLayerIndex.set(i);
  }

  getKeycodeLabel(keycode: string): string {
    return this.keycodeLabels.getKeycodeLabel(keycode, this.layoutService.layout(), this.tapDances);
  }

  get hasEncoders() {
    return this.keymap().encoders.length > 0;
  }

  encodersForActiveLayer() {
    return this.keymap().encoders.filter(e => e.layer === this.activeLayerIndex());
  }

  get macros() {
    return this.keymap().macros.filter(m => !m.isEmpty);
  }

  get tapDances() {
    return this.keymap().tapDance.filter(t => !t.isEmpty);
  }
}
