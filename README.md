# send-data-to-azure-iot-hub-nodejs

AION では、主にエッジコンピューティング環境からデータを収集・管理維持するための Data Stack / Data Hub として、Azure IoT Hub を、一つの重要な選択肢として選択しています。       
AION では、Azure IoT Hub にエッジ環境からデータを送信するときに、メッセージングアーキテクチャとして、エッジ側で RabbitMQ が利用されています。  
本マイクロサービスは、エッジで RabbitMQ のキューから受け取ったメッセージを、エッジから Azure IoT Hub に送信するためのマイクロサービスです。  
本マイクロサービスは、エッジ環境側にセットアップされるリソースです。


## 動作環境

* エッジコンピューティング環境（本マイクロサービスがデプロイされるエッジ端末）
* OS: Linux OS
* CPU: ARM/AMD/Intel
* RabbitMQ もしくは AION 導入済みのエッジ環境
* Kubernetes 導入済みのエッジ環境
* Nodejs Runtime

## Azure IoT Hub SDK の 参照ライブラリ（Node.js SDK）  

本レポジトリ内の package.json の下記に記載された箇所において、Azure IoT Hub SDK の ライブラリとして [azure-iot-sdk-node](https://github.com/Azure/azure-iot-sdk-node) を参照しています。    
azure-iot-sdk-node の バージョン については、[こちら](https://github.com/Azure/azure-iot-sdk-node/releases)を参照してください。  

```
  "dependencies": {
    "azure-iot-device": "^1.17.8",
    "azure-iot-device-amqp": "^1.13.8",
    "rabbitmq-client": "latonaio/rabbitmq-nodejs-client"
  }
```

## 初期設定

`send-data-to-azure-iot-hub-nodejs.yaml` 内の env を以下の通り書き換えてください。

(端末名・MAC アドレスは端末を一意に特定するために送信します)

* `TERMINAL_NAME`: 端末名
* `MAC_ADDRESS`: MAC アドレス
* `RABBITMQ_URL`: RabbitMQ の受信元 URL
* `QUEUE_ORIGIN`: メッセージを受信する RabbitMQ キュー
* `AZURE_IOT_CONNECTION_STRING`: Azure IoT Hub から取得した接続文字列


また、`src/main.ts` 内の `additionalData` に送受信するデータを定義してください。


## 導入方法

* `make docker-build` を実行します。
* `kubectl apply -f send-data-to-azure-iot-hub-nodejs.yaml` を実行します。

## I/O
#### Input
入力データのJSONフォーマットは、inputs/sample.json にある通り、次の様式です。  
```
{
    "imagePath": "/var/lib/aion/Data/azure-face-api-registrator-kube/1634173065679.jpg",
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
   "imagePath": "/var/lib/aion/Data/azure-face-api-registrator-kube/1634354006794.jpg",
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