# キーマップビューア (Keymap Viewer)

CornixHub と同様に、Vial の **.vil** キーマップ定義ファイルをアップロードすると、キーマップを SVG で表示する Web アプリです。  
処理はすべてブラウザ上で完結し、サーバーは不要です。

## 機能

- **.vil ファイル**のドラッグ＆ドロップまたはファイル選択で読み込み
- **レイヤー切り替え**で各レイヤーのキー配置を表示
- **キーコード**を MO / TO / TD / 修飾キーなどに応じてラベル表示（日本語表記は一部）
- **エンコーダー**・**マクロ**・**タップダンス**の一覧表示
- Cornix 用の **分割キーボードレイアウト**（48 キー）で SVG 描画

## 技術スタック

- Angular 21（standalone components）
- キー位置は `key-positions.ts` で定義（Cornix レイアウト）
- キーコード → ラベルは `KeycodeLabelsService` で変換
- `.vil` は JSON として `VialParserService` でパース

## 開発サーバー

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
