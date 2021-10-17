# send-data-to-azure-iot-hub

## 概要

AION では、主にエッジコンピューティング環境からデータを収集・管理維持するための Data Stack / Data Hub として、Azure IoT Hub を推奨しています。    
Azure IoT Hub にエッジ環境からデータを送信するときに、メッセージングアーキテクチャとして、AION では、エッジ側で RabbitMQ が利用されています。  
本マイクロサービスは、エッジで RabbitMQ のキューから受け取ったメッセージを、エッジから Azure IoT Hub に送信するためのマイクロサービスです。  
本マイクロサービスは、エッジ環境側にセットアップされるリソースです。


## 動作環境

* エッジコンピューティング環境（本マイクロサービスがデプロイされるエッジ端末）
* OS: Linux OS
* CPU: ARM/AMD/Intel
* RabbitMQ もしくは AION 導入済みのエッジ環境
* Kubernetes 導入済みのエッジ環境

## 初期設定

`send-data-to-azure-iot-hub.yaml` 内の env を以下の通り書き換えてください。

(端末名・MAC アドレスは端末を一意に特定するために送信します)

* `TERMINAL_NAME`: 端末名
* `MAC_ADDRESS`: MAC アドレス
* `RABBITMQ_URL`: RabbitMQ の受信元 URL
* `QUEUE_FROM`: メッセージを受信する RabbitMQ キュー
* `AZURE_IOT_CONNECTION_STRING`: Azure IoT Hub から取得した接続文字列


また、`src/main.ts` 内の `additionalData` に送受信するデータを定義してください。


## 導入方法

* `make docker-build` を実行します。
* `kubectl apply -f send-data-to-azure-iot-hub.yaml` を実行します。

## I/O
#### Input
入力データのJSONフォーマットは、inputs/sample.json にある通り、次の様式です。  
```
{
    "imagePath": "/var/lib/aion/Data/direct-next-service_1/1634173065679.jpg",
    "faceId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "responseData": {
        "candidates": []
    }
}
```

#### Output
出力データのサンプル(Azure IoT Hub に送られるデータの書式参考）は、outputs/sample.json にある通り、次の様式です。  
```
{
   "terminalName": "xxxxx",
   "macAddress": "xx:xx:xx:xx:xx:xx",
   "createdAt": "2021-10-16T03:13:27.539Z",
   "imagePath": "/var/lib/aion/Data/direct-next-service_1/1634354006794.jpg",
   "faceId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "responseData": {
       "candidates": []
   }
}
```
  
Azure IoT Hub に送るべき実際のデータ定義は、src/main.ts 内にある通り、アプリケーション毎に定義してください。  
```
      hoge: mqMessageData.hoge || null,
      fuga: mqMessageData.fuga || null,
```