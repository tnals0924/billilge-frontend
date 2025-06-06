'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/mobile/layout';
import {
  userNotificationGet,
  readNotificationPost,
} from '@/services/notification';
import NotificationItem from '@/components/mobile/NotificationItem';
import Header from '@/components/mobile/Header';
import { elapsedTime } from '@/utils/elapsedTime';
import { NotificationProps } from '@/types/notificationType';

type UserNotificationType = NotificationProps;

export default function Notification() {
  const router = useRouter();

  const [notificationDetail, setNotificationDetail] = useState<
    UserNotificationType[]
  >([]);

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (!user) {
      alert('로그인 후 사용 가능합니다.');
      router.push('/mobile/sign-in');
    }
  }, [router]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await userNotificationGet();
      setNotificationDetail(data.messages);
    };

    fetchNotifications();
  }, []);

  // TODO : 로그인 여부 확인 후 로그인 안 했으면 로그인 화면으로 보내기

  const handleReadNotification = async (notificationId: number) => {
    await readNotificationPost(notificationId);
  };

  return (
    <MobileLayout>
      <Header title="알림" />
      {notificationDetail?.length === 0 ? (
        <div className="flex h-dvh items-center justify-center text-gray-secondary">
          현재 알림이 없습니다.
        </div>
      ) : (
        notificationDetail.map((item) => (
          <NotificationItem
            key={item.notificationId}
            message={item.message}
            link={item.link}
            isRead={item.isRead}
            status={item.status}
            createdAt={elapsedTime(item.createdAt)}
            handleNotification={() =>
              item.notificationId && handleReadNotification(item.notificationId)
            }
          />
        ))
      )}
    </MobileLayout>
  );
}
