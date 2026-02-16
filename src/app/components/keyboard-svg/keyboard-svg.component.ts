import { Component, input } from '@angular/core';
import { KEY_POSITIONS } from '../../constants/key-positions';
import { KeycodeLabelsService } from '../../services/keycode-labels.service';
import { LayoutService } from '../../services/layout.service';
import type { ParsedKeycode } from '../../services/keycode-labels.service';
import type { KeyDataType } from '../../models/keymap';
import type { ParsedLayer, KeyData } from '../../models/keymap';

const KEY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  normal: { bg: '#f3f4f6', border: '#d1d5db', text: '#1f2937' },
  modifier: { bg: '#4b5563', border: '#374151', text: '#ffffff' },
  layer: { bg: '#3b82f6', border: '#2563eb', text: '#ffffff' },
  macro: { bg: '#8b5cf6', border: '#7c3aed', text: '#ffffff' },
  tapdance: { bg: '#f59e0b', border: '#d97706', text: '#ffffff' },
  special: { bg: '#ec4899', border: '#db2777', text: '#ffffff' },
  empty: { bg: '#f3f4f6', border: '#d1d5db', text: '#9ca3af' },
};

const expectedCols = [
  // 左側
  [
    6,
    6,
    7,
    6,
  ],
  // 右側
  [
    6,
    7,
    6,
    6,
  ],
]

/**
 * 1レイヤー分のキーを、Cornix と同じ順序でフラット化する。
 * 左ブロック rows 0-3、右ブロック rows 0-3。右は列逆順。
 */
function flattenLayerRows(layer: ParsedLayer): (KeyData | null)[] {
  const rows = layer.rows;
  const leftRows = rows.slice(0, 4);
  const rightRows = rows.slice(4, 8);
  const out: (KeyData | null)[] = [];

  for (let r = 0; r < 4; r++) {
    const leftRow = leftRows[r];
    const rightRow = rightRows[r];
    const leftLen = expectedCols[0][r];
    const rightLen = expectedCols[1][r];
    for (let c = 0; c < leftLen; c++) {
      out.push(leftRow?.[c] ?? null);
    }
    for (let c = rightLen - 1; c >= 0; c--) {
      out.push(rightRow?.[c] ?? null);
    }
  }
  return out;
}

@Component({
  selector: 'app-keyboard-svg',
  standalone: true,
  templateUrl: './keyboard-svg.component.html',
  styleUrl: './keyboard-svg.component.scss',
})
export class KeyboardSvgComponent {
  layer = input.required<ParsedLayer>();
  compact = input<boolean>(false);

  readonly keyPositions = KEY_POSITIONS;
  readonly keyStyles = KEY_STYLES;

  constructor(
    private keycodeLabels: KeycodeLabelsService,
    private layoutService: LayoutService,
  ) {}

  getFlattenedKeys(): (KeyData | null)[] {
    return flattenLayerRows(this.layer());
  }

  /** 現在のレイアウトでキーコードをパース */
  getKeyParsed(key: KeyData): ParsedKeycode {
    return this.keycodeLabels.parseKeycode(key.keycode, this.layoutService.layout());
  }

  getStyle(type: KeyDataType) {
    return this.keyStyles[type] ?? this.keyStyles['normal'];
  }

  getKeyDisplay(parsed: ParsedKeycode): { main: string; sub?: string } {
    const label = parsed.label || '';
    const match = label.match(/^([^(]+)\((.+)\)$/);
    if (match) return { main: match[1], sub: `(${match[2]})` };
    return { main: label };
  }
}
