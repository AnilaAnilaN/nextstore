'use client';

import { useState, useEffect } from 'react';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/contact');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-medium text-gray-900 mb-6">Messages</h2>
      <div className="space-y-4">
        {messages.map((message: any) => (
          <div key={message._id} className="border border-gray-200 rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{message.firstName} {message.lastName}</h3>
              <span className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-600 mb-2">{message.email}</p>
            <p className="text-gray-800">{message.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}