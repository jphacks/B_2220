# 🌒🌓🌔 あんしん夜道 🌖🌗🌘
### 『夜道　× Tech』の新しい試み！
　     　〜怖い夜道に、少しの安心を〜

https://b-2220.onrender.com

![あんしん夜道(short)](https://user-images.githubusercontent.com/24710953/197318711-27ec4021-92cd-48f9-906c-990f1a873a30.gif)


### Browsers support

|[<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>Android Chrome |[<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>Chrome |[<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>ios Chrome　| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://gotbahn.github.io/browsers-support-badges/)</br>iOS Safari |
| --------- | --------- | --------- | --------- | --------- |
| 最新版　| 最新版 | ❌ | ❌ | ❌ |

<br>

## 使い方(デモ動画)
[![IMAGE ALT TEXT HERE](https://user-images.githubusercontent.com/24710953/197316618-c7c44cbb-c640-45c1-9958-4582c970fe55.png)](https://youtu.be/qfS-SFLeszY)


## ▶️ 製品概要
### ● 背景(製品開発のきっかけ、課題等）
![b2220 - Frame 1](https://user-images.githubusercontent.com/24710953/196140697-24db1d42-18b5-4725-a255-21739ab2974e.jpg)

<br>
「女性は夜道を避けるべきである」。そのような声はよく聞くが実際に避けることはできるのだろうか。今現在の日本では、男性も女性も仕事や学校などで暗くなってからの帰宅は当たり前になってきている。

そのような現状で、女性は夜道でも身の安全を守れるように、電話をしているフリをしながら歩いている人が多くいる。私の友人もその1人だ。


![b2220 - Frame 2](https://user-images.githubusercontent.com/24710953/196140815-1b378ade-398b-4183-878c-a31173b7915d.jpg)


そんな友人は電話をしているフリをすることに不便を感じている。毎日一人芝居をするには限界があるのだ。

そんなときに思いついたのが、「あんしん夜道」。

### 📱大人でも持てるキッズケータイ📱

をコンセプトにしたアプリケーションである。

<br>

![b2220 - Frame 5](https://user-images.githubusercontent.com/24710953/196141110-ec2a38af-9946-42c1-a5e3-b6b2e05d93d0.jpg)

### ● 製品説明（具体的な製品の説明）
「あんしん夜道」は、”不安な夜道に、少しの安心を”をコンセプトとした、暗く危ない夜道で電話をしているフリができるアプリケーションである。名前・電話番号・位置情報を入力し、発信ボタンを押すと自動的に成人男性に近い声色の自動音声が流れてきて、いかにも第三者と会話をしているように演出することができる。

![b2220 - Frame 3](https://user-images.githubusercontent.com/24710953/196142334-44a044fd-41d9-49d3-ae9f-1daca912eb0b.jpg)


さらにユーザーからの応答が途絶えると、セコム等のセキュリティ機関に通報がいくようにしてある。上京した子供や遠出をする予定の”大切な人”にこのアプリケーションを持たせるだけで「あんしん」を届けることができる。


### ● 特長
1. ワンタップでコール
2. AIによる自動音声でリアルな会話を演出
3. もしもの時は自動で通報

### ● 解決出来ること
このアプリケーションを通し、毎日の通勤・通学で夜道を歩くすべての人に”あんしん”を届けることができる。さらにこのアプリケーションは、遠くにいる人同士で受け取った人の安心、届けた人の安心を買うことができる。

### ● 今後の展望
* 夜道に対する恐怖や不安を感じる人どうしのコミュニケーションツールとして発展
* AIによるより精密な判定により、本当に危険が及んだときに正確な場所・状況の通報
### ● 注力したこと（こだわり等）
* 計64名の女性へのヒアリング
  * ユーザーのニーズに沿ったプロダクト開発
* 音声認識機能の実装
  * AIに応答しない場合の識別が自動でできる 
* 緊急連絡機能の実装
  * 入力した電話番号に緊急連絡がいく
  * 同時にSMSでのユーザーの位置情報が共有される

## ▶️ 開発技術

![b2220 (1)](https://user-images.githubusercontent.com/24710953/196142534-d51b9723-9114-468e-8a93-c60e2a1713c0.jpg)

### ● 活用した技術
#### API・データ
* Twilion API
* Google Map API
* Web speech API

#### フレームワーク・ライブラリ・モジュール
* Vue.js
* Twilio

### ● 独自技術
#### ハッカソンで開発した独自機能・技術
* フェイク電話機能
* 音声認識機能によるAIへの応答有無の判断
* 応答がない場合、アプリ使用者の位置情報付きの緊急連絡（電話・SMS）の送信

### ● 機能

| 機能 | 説明 |
| --------- | --------- |
| ①フェイク通話機能 | ・ワンタップでユーザーのスマートフォンに電話がかかってくる機能。<br>・不審者・ナンパなどに遭遇し不安を感じた際のフェイク電話を可能にする。|
| ②防犯ブザー機能 | ・ワンタップで大音量で助けを呼ぶアラートが鳴る機能。<br>・フェイク電話をしながら不審者との接触があった場合や痴漢被害にあった際に、　緊急事態をすぐさま周囲に知らせることを可能にする。 |
| ③緊急通報機能 | ・フェイク電話中の使用者の応答の有無を判別し、応答がない場合は緊急連絡先に自動で通報される機能。<br>・通報時はユーザーが事前に登録した連絡先にコールがかかると同時に、SMSで使用者の危険と位置情報が知らされる仕様。<br>・位置情報はユーザーのスマートフォンの移動情報が1分毎に自動で取得され、その度に新たな位置情報がSMSで送信され、ユーザーの進んでいる経路が可視化される |
| ④録音機能 | ・フェイク電話の内容をアプリケーション内で一時的に録音し、緊急通報が行われた場合にのみデータベース上に保存する機能。<br>・会話や周りの音声を録音することで、その後の状況確認や証拠などに役立てることができる。<br>・録音データがあることで使用者への状況確認などを大幅に減らすことができることから再度思い出す<br>・人に説明するという負担を軽減する。 |

# 使い方
<サーバーサイド>
` npm run serve` で起動 `ctl-c` で終了
