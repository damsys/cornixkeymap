import { Injectable } from '@angular/core';
import type { KeyDataType, TapDanceEntry } from '../models/keymap';

export interface ParsedKeycode {
  label: string;
  sublabel?: string;
  secondaryLabel?: string;
  type: KeyDataType;
}

const MODIFIER_KEYS = [
  'KC_LCTRL', 'KC_LSHIFT', 'KC_LALT', 'KC_LGUI',
  'KC_RCTRL', 'KC_RSHIFT', 'KC_RALT', 'KC_RGUI',
  'KC_LCTL', 'KC_LSFT', 'KC_RCTL', 'KC_RSFT',
];

const MOD_LABELS: Record<string, string> = {
  LSFT: 'LShift', RSFT: 'RShift', LCTL: 'LCtrl', RCTL: 'RCtrl',
  LALT: 'LAlt', RALT: 'RAlt', LGUI: 'LGui', RGUI: 'RGui',
  C: 'Ctrl', A: 'Alt', S: 'Shift', G: 'Gui',
  LCMD: 'LCmd', RCMD: 'RCmd', LWIN: 'LWin', RWIN: 'RWin',
  LOPT: 'LOpt', ROPT: 'ROpt',
  LCA: 'LC+LA', RCA: 'RC+RA', LCG: 'LC+LG', RCG: 'RC+RG',
  LSA: 'LS+LA', RSA: 'RS+RA', LSG: 'LS+LG', RSG: 'RS+RG',
  LAG: 'LA+LG', RAG: 'RA+RG', LCAG: 'LC+LA+LG', RCAG: 'RC+RA+RG',
  MEH: 'C+A+S', HYPR: 'C+A+S+G', SGUI: 'S+G', SCMD: 'S+G', SWIN: 'S+G',
  ALL: 'Hyper', C_S: 'C+S', C_A: 'C+A', C_G: 'C+G', S_A: 'S+A', S_G: 'S+G', A_G: 'A+G',
  C_S_A: 'C+S+A', C_S_G: 'C+S+G', C_A_G: 'C+A+G', S_A_G: 'S+A+G', C_S_A_G: 'C+S+A+G',
};

const US_SHIFTED: Record<string, string> = {
  KC_1: '!', KC_2: '@', KC_3: '#', KC_4: '$', KC_5: '%',
  KC_6: '^', KC_7: '&', KC_8: '*', KC_9: '(', KC_0: ')',
  KC_MINUS: '_', KC_EQUAL: '+', KC_LBRACKET: '{', KC_RBRACKET: '}',
  KC_BSLASH: '|', KC_SCOLON: ':', KC_QUOTE: '"', KC_GRAVE: '~',
  KC_COMMA: '<', KC_DOT: '>', KC_SLASH: '?',
};

/** JIS 配列: Shift 押下時の表示 */
const JIS_SHIFTED: Record<string, string> = {
  KC_1: '!', KC_2: '"', KC_3: '#', KC_4: '$', KC_5: '%',
  KC_6: '&', KC_7: "'", KC_8: '(', KC_9: ')', KC_0: '0',
  KC_MINUS: '=', KC_EQUAL: '~', KC_LBRACKET: '`', KC_RBRACKET: '{',
  KC_BSLASH: '}', KC_SCOLON: '+', KC_QUOTE: '*',
  KC_COMMA: '<', KC_DOT: '>', KC_SLASH: '?',
};

/** JIS 配列用キーラベル上書き（US と異なる部分のみ） */
const JIS_KEYCODE_OVERRIDES: Record<string, { label: string; sublabel?: string }> = {
  KC_1: { label: '1', sublabel: '!' }, KC_2: { label: '2', sublabel: '"' },
  KC_3: { label: '3', sublabel: '#' }, KC_4: { label: '4', sublabel: '$' },
  KC_5: { label: '5', sublabel: '%' }, KC_6: { label: '6', sublabel: '&' },
  KC_7: { label: '7', sublabel: "'" }, KC_8: { label: '8', sublabel: '(' },
  KC_9: { label: '9', sublabel: ')' }, KC_0: { label: '0' },
  KC_MINUS: { label: '-', sublabel: '=' }, KC_EQUAL: { label: '^', sublabel: '~' },
  KC_LBRACKET: { label: '@', sublabel: '`' }, KC_RBRACKET: { label: '[', sublabel: '{' },
  KC_BSLASH: { label: ']', sublabel: '}' }, KC_NONUS_HASH: { label: ']', sublabel: '}' },
  KC_SCOLON: { label: ';', sublabel: '+' }, KC_QUOTE: { label: ':', sublabel: '*' },
  KC_GRAVE: { label: '半角' },
  KC_INT1: { label: '\\', sublabel: '_' }, KC_INT2: { label: 'ひら' },
  KC_INT3: { label: '\\', sublabel: '|' }, KC_INT4: { label: '変換' }, KC_INT5: { label: '無変換' },
  KC_LANG1: { label: 'かな' }, KC_LANG2: { label: '英数' },
  KC_RO: { label: '\\', sublabel: '_' }, KC_KANA: { label: 'ひら' },
  KC_JYEN: { label: '¥', sublabel: '|' }, KC_HENK: { label: '変換' }, KC_MHEN: { label: '無変換' },
};

/** QMK/Vial キーコード → 表示ラベル（US配列） */
const KEYCODE_MAP: Record<string, { label: string; sublabel?: string }> = {
  KC_A: { label: 'A' }, KC_B: { label: 'B' }, KC_C: { label: 'C' }, KC_D: { label: 'D' },
  KC_E: { label: 'E' }, KC_F: { label: 'F' }, KC_G: { label: 'G' }, KC_H: { label: 'H' },
  KC_I: { label: 'I' }, KC_J: { label: 'J' }, KC_K: { label: 'K' }, KC_L: { label: 'L' },
  KC_M: { label: 'M' }, KC_N: { label: 'N' }, KC_O: { label: 'O' }, KC_P: { label: 'P' },
  KC_Q: { label: 'Q' }, KC_R: { label: 'R' }, KC_S: { label: 'S' }, KC_T: { label: 'T' },
  KC_U: { label: 'U' }, KC_V: { label: 'V' }, KC_W: { label: 'W' }, KC_X: { label: 'X' },
  KC_Y: { label: 'Y' }, KC_Z: { label: 'Z' },
  KC_1: { label: '1', sublabel: '!' }, KC_2: { label: '2', sublabel: '@' },
  KC_3: { label: '3', sublabel: '#' }, KC_4: { label: '4', sublabel: '$' },
  KC_5: { label: '5', sublabel: '%' }, KC_6: { label: '6', sublabel: '^' },
  KC_7: { label: '7', sublabel: '&' }, KC_8: { label: '8', sublabel: '*' },
  KC_9: { label: '9', sublabel: '(' }, KC_0: { label: '0', sublabel: ')' },
  KC_F1: { label: 'F1' }, KC_F2: { label: 'F2' }, KC_F3: { label: 'F3' }, KC_F4: { label: 'F4' },
  KC_F5: { label: 'F5' }, KC_F6: { label: 'F6' }, KC_F7: { label: 'F7' }, KC_F8: { label: 'F8' },
  KC_F9: { label: 'F9' }, KC_F10: { label: 'F10' }, KC_F11: { label: 'F11' }, KC_F12: { label: 'F12' },
  KC_LCTRL: { label: 'LCtrl' }, KC_LSHIFT: { label: 'LShift' }, KC_LALT: { label: 'LAlt' }, KC_LGUI: { label: 'LGui' },
  KC_RCTRL: { label: 'RCtrl' }, KC_RSHIFT: { label: 'RShift' }, KC_RALT: { label: 'RAlt' }, KC_RGUI: { label: 'RGui' },
  KC_LCTL: { label: 'LCtrl' }, KC_LSFT: { label: 'LShift' }, KC_RCTL: { label: 'RCtrl' }, KC_RSFT: { label: 'RShift' },
  KC_ENTER: { label: 'Enter' }, KC_ESCAPE: { label: 'Esc' }, KC_BSPACE: { label: 'Bksp' }, KC_BSPC: { label: 'Bksp' },
  KC_TAB: { label: 'Tab' }, KC_SPACE: { label: 'Space' },
  KC_MINUS: { label: '-', sublabel: '_' }, KC_EQUAL: { label: '=', sublabel: '+' },
  KC_LBRACKET: { label: '[', sublabel: '{' }, KC_RBRACKET: { label: ']', sublabel: '}' },
  KC_BSLASH: { label: '\\', sublabel: '|' }, KC_NONUS_HASH: { label: '#', sublabel: '~' }, KC_NUHS: { label: '#', sublabel: '~' },
  KC_SCOLON: { label: ';', sublabel: ':' }, KC_QUOTE: { label: "'", sublabel: '"' }, KC_GRAVE: { label: '`', sublabel: '~' },
  KC_COMMA: { label: ',', sublabel: '<' }, KC_DOT: { label: '.', sublabel: '>' }, KC_SLASH: { label: '/', sublabel: '?' },
  KC_CAPS: { label: 'Caps' }, KC_PSCR: { label: 'PrtSc' }, KC_SLCK: { label: 'ScrLk' }, KC_PAUSE: { label: 'Pause' },
  KC_INS: { label: 'Ins' }, KC_HOME: { label: 'Home' }, KC_PGUP: { label: 'PgUp' },
  KC_DEL: { label: 'Del' }, KC_END: { label: 'End' }, KC_PGDN: { label: 'PgDn' },
  KC_RIGHT: { label: '→' }, KC_RGHT: { label: '→' }, KC_LEFT: { label: '←' }, KC_DOWN: { label: '↓' }, KC_UP: { label: '↑' },
  KC_NLCK: { label: 'NumLk' },
  KC_KP_SLASH: { label: '/' }, KC_KP_ASTERISK: { label: '*' }, KC_KP_MINUS: { label: '-' }, KC_KP_PLUS: { label: '+' },
  KC_KP_ENTER: { label: 'Enter' }, KC_KP_1: { label: '1' }, KC_KP_2: { label: '2' }, KC_KP_3: { label: '3' },
  KC_KP_4: { label: '4' }, KC_KP_5: { label: '5' }, KC_KP_6: { label: '6' },
  KC_KP_7: { label: '7' }, KC_KP_8: { label: '8' }, KC_KP_9: { label: '9' }, KC_KP_0: { label: '0' }, KC_KP_DOT: { label: '.' },
  KC_KP_EQUAL: { label: '=' }, KC_PEQL: { label: '=' },
  KC_MUTE: { label: 'Mute' }, KC_VOLU: { label: 'Vol+' }, KC_VOLD: { label: 'Vol-' },
  KC_WH_U: { label: 'WhlUp' }, KC_WH_D: { label: 'WhlDn' }, KC_WH_L: { label: 'WhlL' }, KC_WH_R: { label: 'WhlR' },
  KC_NO: { label: '' }, KC_TRNS: { label: '▽' }, KC_TRANSPARENT: { label: '▽' }, XXXXXXX: { label: '' }, _______: { label: '▽' },
  KC_ENT: { label: 'Enter' }, KC_ESC: { label: 'Esc' }, KC_SPC: { label: 'Space' },
  KC_MINS: { label: '-', sublabel: '_' }, KC_EQL: { label: '=', sublabel: '+' },
  KC_LBRC: { label: '[', sublabel: '{' }, KC_RBRC: { label: ']', sublabel: '}' }, KC_BSLS: { label: '\\', sublabel: '|' },
  KC_SCLN: { label: ';', sublabel: ':' }, KC_QUOT: { label: "'", sublabel: '"' }, KC_GRV: { label: '`', sublabel: '~' },
  KC_COMM: { label: ',', sublabel: '<' }, KC_SLSH: { label: '/', sublabel: '?' },
  KC_JYEN: { label: '¥', sublabel: '|' }, KC_LANG1: { label: 'LANG1' }, KC_LANG2: { label: 'LANG2' },
  KC_BTN1: { label: 'Mouse1' }, KC_BTN2: { label: 'Mouse2' }, KC_BTN3: { label: 'Mouse3' },
  QK_BOOT: { label: 'Boot' }, EE_CLR: { label: 'EE_CLR' },
};

@Injectable({ providedIn: 'root' })
export class KeycodeLabelsService {
  /**
   * キーコード文字列をパースして表示用の label / sublabel / type を返す
   */
  parseKeycode(code: string | number, layout: 'us' | 'jis' = 'jis', tapDances: TapDanceEntry[] = []): ParsedKeycode {
    const map = layout === 'jis' ? { ...KEYCODE_MAP, ...JIS_KEYCODE_OVERRIDES } : KEYCODE_MAP;
    const shifted = layout === 'jis' ? JIS_SHIFTED : US_SHIFTED;

    if (code === -1 || code === 'KC_NO' || code === 'XXXXXXX') {
      return { label: '', type: 'empty' };
    }
    if (typeof code === 'number') {
      return { label: `0x${code.toString(16).toUpperCase()}`, type: 'normal' };
    }
    if (code === 'KC_TRNS' || code === 'KC_TRANSPARENT' || code === '_______') {
      return { label: '▽', type: 'normal' };
    }

    let m: RegExpMatchArray | null;
    m = code.match(/^MO\((\d+)\)$/);
    if (m) return { label: m[1], sublabel: 'MO', type: 'layer' };
    m = code.match(/^TG\((\d+)\)$/);
    if (m) return { label: m[1], sublabel: 'TG', type: 'layer' };
    m = code.match(/^TO\((\d+)\)$/);
    if (m) return { label: m[1], sublabel: 'TO', type: 'layer' };
    m = code.match(/^TT\((\d+)\)$/);
    if (m) return { label: m[1], sublabel: 'TT', type: 'layer' };
    m = code.match(/^OSL\((\d+)\)$/);
    if (m) return { label: m[1], sublabel: 'OSL', type: 'layer' };
    m = code.match(/^DF\((\d+)\)$/);
    if (m) return { label: m[1], sublabel: 'DF', type: 'layer' };

    m = code.match(/^LT(\d+)\((.+)\)$/);
    if (m) {
      const inner = this.parseKeycode(m[2], layout);
      return { label: inner.label, sublabel: `LT${m[1]}`, type: 'layer' };
    }

    m = code.match(/^TD\((\d+)\)$/) || code.match(/^TD(\d+)$/);
    if (m) {
      return this.getTapDanceLabel(m[1], layout, tapDances);
    }

    m = code.match(/^M\((\d+)\)$/) || code.match(/^M(\d+)$/);
    if (m) return { label: m[1], sublabel: 'M', type: 'macro' };

    m = code.match(/^USER(\d+)$/);
    if (m) {
      const n = parseInt(m[1], 10);
      const special: Record<number, string> = {
        0: 'BT0', 1: 'BT1', 2: 'BT2', 3: 'NextBT', 4: 'PrevBT',
        5: 'ClearBT', 6: 'SwitchOut', 7: 'ClearPeer',
      };
      const label = n in special ? special[n] : `User${m[1]}`;
      return { label, type: 'special' };
    }

    m = code.match(/^([A-Z_]+)_T\((.+)\)$/);
    if (m) {
      const mod = MOD_LABELS[m[1]] || m[1];
      const inner = this.parseKeycode(m[2], layout);
      if (inner.sublabel) {
        return { label: mod, sublabel: inner.sublabel, secondaryLabel: inner.label, type: 'modifier' };
      }
      return { label: mod, sublabel: inner.label, type: 'modifier' };
    }

    m = code.match(/^([A-Z_]+)\((.+)\)$/);
    if (m) {
      const modLabel = MOD_LABELS[m[1]];
      if (modLabel && (m[1] === 'LSFT' || m[1] === 'RSFT' || m[1] === 'S') && shifted[m[2] as keyof typeof shifted]) {
        return { label: shifted[m[2] as keyof typeof shifted], type: 'normal' };
      }
      const inner = this.parseKeycode(m[2], layout);
      if (inner.sublabel) {
        return { label: modLabel || m[1], sublabel: inner.sublabel, secondaryLabel: inner.label, type: 'modifier' };
      }
      return { label: modLabel || m[1], sublabel: inner.label, type: 'modifier' };
    }

    if (MODIFIER_KEYS.includes(code)) {
      const entry = map[code as keyof typeof map];
      return { label: entry?.label ?? code, type: 'modifier' };
    }

    const entry = map[code as keyof typeof map];
    if (entry) {
      return { label: entry.label, sublabel: entry.sublabel, type: 'normal' };
    }
    return { label: code.replace(/^KC_/, ''), type: 'normal' };
  }

  getKeycodeLabel(code: string | number, layout: 'us' | 'jis' = 'jis', tapDances: TapDanceEntry[] = []): string {
    const p = this.parseKeycode(code, layout, tapDances);
    if (p.sublabel && (p.type === 'layer' || p.type === 'tapdance' || p.type === 'macro')) {
      return `${p.label}(${p.sublabel})`;
    }
    return p.label;
  }

  getTapDanceLabel(code: string, layout: 'us' | 'jis' = 'jis', tapDances: TapDanceEntry[]): ParsedKeycode {
    const codeIndex = Number(code);
    const tapDance = tapDances.find(td => td.index === codeIndex);
    const defaultCode: ParsedKeycode = { label: code, sublabel: 'TD', type: 'tapdance' };

    if (!tapDance || !this.isOnlyTapAndDoubleTap(tapDance)) {
      return defaultCode;
    }

    // Tap と Double Tap だけが設定されている場合、特別な表示を行う。
    // Tap と Hold が同一値の場合は Hold は設定されていないとみなす。
    const map = layout === 'jis' ? { ...KEYCODE_MAP, ...JIS_KEYCODE_OVERRIDES } : KEYCODE_MAP;
    const tapKeyCode = this.parseKeycode(tapDance.tap, layout, tapDances);
    const doubleTapKeyCode = this.parseKeycode(tapDance.doubleTap, layout, tapDances);

    if (tapKeyCode.type !== "normal" || doubleTapKeyCode.type !== "normal") {
      // ややこしいキーコードはサポートしない。
      return defaultCode;
    }

    return { label: `${tapKeyCode.label} ${doubleTapKeyCode.label}`, sublabel: `TD${code}`, type: 'tapdance' };
  }

  isOnlyTapAndDoubleTap(tapDance: TapDanceEntry): boolean {
    if (tapDance.tap === 'KC_NO' || tapDance.doubleTap === 'KC_NO') {
      // tap / doubleTap が設定されていること。
      return false;
    }
    if (tapDance.tap === tapDance.doubleTap) {
      // tap / doubleTap が同一値の場合は対象外。
      return false;
    }
    if (tapDance.hold !== 'KC_NO' && tapDance.hold !== tapDance.tap) {
      // Hold が設定されている場合は対象外。
      // Tap と同じ値の場合は「設定されていない」とみなす。
      return false;
    }
    if (tapDance.tapHold !== 'KC_NO' && tapDance.tapHold !== tapDance.tap) {
      // Tap+Hold が設定されている場合は対象外。
      // Tap と同じ値の場合は「設定されていない」とみなす。
      return false;
    }
    return true;
  }
}
