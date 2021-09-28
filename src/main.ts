import { clientFromConnectionString } from 'azure-iot-device-amqp';
import { Message } from 'azure-iot-device';

import { RabbitmqClient } from 'rabbitmq-client';


const main = async () => {
  const [mqClient, iotHubClient] = await Promise.all([
    // RabbitMQ
    (async () => {
      const url = process.env.RABBITMQ_URL;
      const queueFrom = process.env.QUEUE_FROM;
      return await RabbitmqClient.create(url, [queueFrom], []);
    })(),

    // Azure IoT Hub
    (async () => {
      const connectionString = process.env.AZURE_IOT_CONNECTION_STRING;
      const client = clientFromConnectionString(connectionString);
      await client.open();
      return client;
    })(),
  ]);

  const terminalName = process.env.TERMINAL_NAME;
  const macAddress = process.env.MAC_ADDRESS;

  for await (const mqMessage of mqClient.iterator()) {
    console.log('received:', mqMessage.data);
    const mqMessageData = mqMessage.data;

    const additionalData = {
      terminalName,
      macAddress,
      createdAt: new Date().toISOString(),

      // 送信するデータ: アプリごとに定義してください
      hoge: mqMessageData.hoge || null,
      fuga: mqMessageData.fuga || null,
    };

    const iotHubMessage = new Message(JSON.stringify({
      ...additionalData,
    }));
    await iotHubClient.sendEvent(iotHubMessage);
    console.log('sent', additionalData);
    mqMessage.success();
  }
};

if (require.main === module) {
  main();
}
