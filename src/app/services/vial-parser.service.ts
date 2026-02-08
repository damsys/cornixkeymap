import { Injectable } from '@angular/core';
import type { ParsedKeymap, KeyData, ParsedLayer, EncoderEntry, MacroEntry, TapDanceEntry } from '../models/keymap';

interface RawVialJson {
  version: number;
  uid: number;
  layout: (string | number)[][][];
  encoder_layout?: (string | number)[][][];
  macro: (string | number)[][][];
  tap_dance: (string | number)[][];
  combo: (string | number)[][];
  settings?: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class VialParserService {

  parseVialFile(jsonText: string): ParsedKeymap {
    const r: RawVialJson = JSON.parse(jsonText);
    const layers: ParsedLayer[] = r.layout.map((rows, layerIndex) => ({
      index: layerIndex,
      rows: rows.map(row =>
        row.map(cell => this.cellToKeyData(cell))
      ),
    }));

    const encoders: EncoderEntry[] = [];
    if (r.encoder_layout) {
      r.encoder_layout.forEach((layerEnc, li) => {
        layerEnc.forEach((enc, ei) => {
          if (Array.isArray(enc) && enc.length >= 2) {
            encoders.push({
              layer: li,
              encoderIndex: ei,
              counterClockwise: String(enc[0]),
              clockwise: String(enc[1]),
            });
          }
        });
      });
    }

    const macros: MacroEntry[] = (r.macro || []).map((mac, i) => {
      const actions = mac
        .filter((a): a is (string | number)[] => Array.isArray(a) && a.length >= 2)
        .map(a => ({ type: String(a[0]), keys: a.slice(1).map(k => String(k)) }));
      return { index: i, actions, isEmpty: actions.length === 0 };
    });

    const tapDance: TapDanceEntry[] = (r.tap_dance || []).map((td, i) => {
      const [tap, hold, doubleTap, tapHold, tappingTerm] = td;
      const isEmpty =
        (tap === 'KC_NO' || !tap) &&
        (hold === 'KC_NO' || !hold) &&
        (doubleTap === 'KC_NO' || !doubleTap) &&
        (tapHold === 'KC_NO' || !tapHold);
      return {
        index: i,
        tap: typeof tap === 'string' ? tap : '',
        hold: typeof hold === 'string' ? hold : '',
        doubleTap: typeof doubleTap === 'string' ? doubleTap : '',
        tapHold: typeof tapHold === 'string' ? tapHold : '',
        tappingTerm: typeof tappingTerm === 'number' ? tappingTerm : 200,
        isEmpty,
      };
    });

    const combos = (r.combo || []).map((c, i) => {
      const keys = c.slice(0, -1).filter((k): k is string => k !== 'KC_NO' && typeof k === 'string');
      const output = c.length > 0 && c[c.length - 1] !== 'KC_NO' ? String(c[c.length - 1]) : '';
      return { index: i, keys, output, isEmpty: keys.length === 0 || !output };
    });

    return {
      version: r.version,
      uid: String(r.uid),
      layers,
      encoders,
      macros,
      tapDance,
      combos,
      settings: r.settings ?? {},
    };
  }

  private cellToKeyData(cell: string | number): KeyData {
    const isEmpty = cell === -1 || cell === 'KC_NO' || cell === 'XXXXXXX';
    return {
      keycode: typeof cell === 'number' ? String(cell) : cell,
      isEmpty,
    };
  }
}
