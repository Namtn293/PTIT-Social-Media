import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import userInfoApi from '../api/UserInfoApi';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, token }) => {
    const [onlineUsernames, setOnlineUsernames] = useState([]);
    const stompClientRef = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!token) {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
            setConnected(false);
            setOnlineUsernames([]);
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                console.log("Đã kết nối Websocket toàn cục");
                setConnected(true);

                // Subscribe to online users list
                client.subscribe("/topic/online-users", (message) => {
                    const onlineNames = JSON.parse(message.body);
                    setOnlineUsernames(onlineNames);
                });

                // Fetch initial online users list
                userInfoApi.getOnlineUsers()
                    .then(res => {
                        if (res?.data?.data) {
                            setOnlineUsernames(res.data.data);
                        }
                    })
                    .catch(err => console.log("Lỗi load danh sách online " + err));
            },
            onDisconnect: () => {
                console.log("Ngắt kết nối Websocket toàn cục");
                setConnected(false);
            },
            onStompError: (frame) => {
                console.error("Lỗi STOMP: " + frame.headers['message']);
            }
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (client) {
                client.deactivate();
            }
            setConnected(false);
        };
    }, [token]);

    return (
        <WebSocketContext.Provider value={{ stompClient: stompClientRef.current, connected, onlineUsernames, setOnlineUsernames }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
