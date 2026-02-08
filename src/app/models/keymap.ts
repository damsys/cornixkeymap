/** キー1つ分のデータ（表示ラベルはレイアウトに応じて表示時に算出） */
export interface KeyData {
  keycode: string;
  isEmpty: boolean;
}

/** 表示用にパースされたキー情報（KeycodeLabelsService で算出） */
export type KeyDataType = 'normal' | 'modifier' | 'layer' | 'macro' | 'tapdance' | 'special' | 'empty';

/** 1レイヤー = 行の配列、各行はキーの配列 */
export interface ParsedLayer {
  index: number;
  rows: KeyData[][];
}

/** エンコーダー1つ */
export interface EncoderEntry {
  layer: number;
  encoderIndex: number;
  counterClockwise: string;
  clockwise: string;
}

/** マクロ1つ */
export interface MacroEntry {
  index: number;
  actions: { type: string; keys: string[] }[];
  isEmpty: boolean;
}

/** タップダンス1つ */
export interface TapDanceEntry {
  index: number;
  tap: string;
  hold: string;
  doubleTap: string;
  tapHold: string;
  tappingTerm: number;
  isEmpty: boolean;
}

/** .vil パース結果 */
export interface ParsedKeymap {
  version: number;
  uid: string;
  layers: ParsedLayer[];
  encoders: EncoderEntry[];
  macros: MacroEntry[];
  tapDance: TapDanceEntry[];
  combos: { index: number; keys: string[]; output: string; isEmpty: boolean }[];
  settings: Record<string, number>;
}
