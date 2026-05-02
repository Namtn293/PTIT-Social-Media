import { useState, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { notification } from 'antd';

export function useNotification() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Chỉ kết nối WebSocket khi đã đăng nhập
        if (!token) return;

        const client = new Client({
            // SockJS kết nối tới endpoint /ws trong WebSocketConfig.java
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

            // Gửi JWT trong header khi CONNECT → backend xác thực và set principal
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },

            // Tự kết nối lại sau 5 giây nếu mất kết nối
            reconnectDelay: 5000,

            onConnect: () => {
                console.log('[WebSocket] Kết nối thành công');

                // Subscribe vào địa chỉ riêng của user đang đăng nhập
                // Spring tự route đến đúng user dựa theo principal (username từ JWT)
                client.subscribe('/user/queue/notifications', (message) => {
                    const data = JSON.parse(message.body);

                    // Thêm thông báo mới vào đầu danh sách
                    setNotifications(prev => [{ ...data, isRead: false }, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    // Hiện popup góc trên phải — duration: 0 không tự đóng vì thông báo quan trọng
                    notification.warning({
                        message: 'Thông báo từ hệ thống',
                        description: data.content,
                        placement: 'topRight',
                        duration: 0,
                    });
                });
            },

            onStompError: (frame) => {
                console.error('[WebSocket] Lỗi STOMP:', frame);
            },
        });

        client.activate();

        // Ngắt kết nối khi component unmount (đăng xuất, đóng tab...)
        return () => client.deactivate();

    }, []); // Chỉ chạy 1 lần khi app load

    // Đánh dấu tất cả đã đọc khi user mở popup thông báo
    const markAllRead = useCallback(() => {
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);

    return { notifications, unreadCount, markAllRead };
}
