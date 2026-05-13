import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    api
      .get('/notifications')
      .then((response) => {
        const unread = response.data.notifications.filter((n) => !n.isRead).length;
        setCount(unread);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="relative rounded-lg border border-cyan-300/20 px-3 py-1 text-sm text-cyan-100">
      Alerts
      {count > 0 ? (
        <span className="absolute -top-2 -right-2 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </div>
  );
}
