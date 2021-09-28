# send-data-to-azure-iot-hub

## 概要

指定した RabbitMQ のキューから受け取ったメッセージを Azure IoT Hub に送信するためのマイクロサービスです。


## 動作環境

* RabbitMQ 導入済みの環境


## 初期設定

`send-data-to-azure-iot-hub.yaml` 内の env を以下の通り書き換えてください。

(端末名・MAC アドレスは端末を一位に特定するために送信します)

* `TERMINAL_NAME`: 端末名
* `MAC_ADDRESS`: MAC アドレス
* `RABBITMQ_URL`: RabbitMQ の受信元 URL
* `QUEUE_FROM`: メッセージを受信する RabbitMQ キュー
* `AZURE_IOT_CONNECTION_STRING`: Azure IoT Hub から取得した接続文字列


また、`src/main.ts` 内の `additionalData` に送受信するデータを定義してください。


## 導入方法

* `make docker-build` を実行します。
* `kubectl apply -f send-data-to-azure-iot-hub.yaml` を実行します。
