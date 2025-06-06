import { MessagePayload, onMessage } from 'firebase/messaging';
import { handleFCMToken, messaging } from '@/lib/firebase';

export const requestNotificationPermission = async () => {
  const { permission } = Notification;

  if (permission === 'granted') {
    await handleFCMToken();
  } else if (permission === 'default') {
    await Notification.requestPermission().then((newPermission) => {
      if (newPermission === 'granted') {
        alert('푸시 알림이 허용되었습니다.');
      }
    });
  }
};

const onForegroundMessage = async () => {
  const messagingInstance = await messaging();

  if (messagingInstance != null) {
    onMessage(messagingInstance, (payload: MessagePayload) => {
      if (
        Notification.permission === 'granted' &&
        document.visibilityState === 'visible'
      ) {
        const notification = new Notification(payload.data?.title as string, {
          body: payload.data?.body,
          icon: '/icons/manifest/icon-192x192.png',
        });

        console.log(`${notification.title}: ${notification.body}`);
      }
    });
  }
};

onForegroundMessage();
