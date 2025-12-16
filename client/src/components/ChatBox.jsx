import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const ChatBox = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const socket = useRef();
  const scrollRef = useRef();

  // 1. Connect to Socket.io
  useEffect(() => {
    if (currentUser) {
      socket.current = io('https://linkerr-api.onrender.com'); // Connect to Backend
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // 2. Fetch Contacts (People to chat with)
  useEffect(() => {
    const fetchContacts = async () => {
      const res = await axios.get('https://linkerr-api.onrender.com/api/users');
      // Filter out yourself
      setContacts(res.data.filter(u => u._id !== currentUser._id));
    };
    fetchContacts();
  }, [currentUser]);

  // 3. Fetch Chat History when selecting a user
  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        const res = await axios.get(`https://linkerr-api.onrender.com/api/messages/${currentUser._id}/${selectedUser._id}`);
        setMessages(res.data);
      };
      fetchMessages();
    }
  }, [selectedUser, currentUser]);

  // 4. Listen for Incoming Messages
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        // Only add message if it's from the person we are currently looking at
        // In a real app, you'd show a notification badge otherwise
        setMessages((prev) => [...prev, { fromSelf: false, text: msg }]);
      });
    }
  }, []);

  // 5. Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Send to Socket (Real-time)
    socket.current.emit("send-msg", {
      to: selectedUser._id,
      from: currentUser._id,
      msg: newMessage,
    });

    // Save to Database
    await axios.post('https://linkerr-api.onrender.com/api/messages', {
      from: currentUser._id,
      to: selectedUser._id,
      message: newMessage,
    });

    // Update UI locally
    const msgs = [...messages];
    msgs.push({ fromSelf: true, text: newMessage });
    setMessages(msgs);
    setNewMessage('');
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-t-xl shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-3 flex justify-between items-center">
            <h3 className="font-bold text-sm">
              {selectedUser ? selectedUser.name : "Messaging"}
            </h3>
            <button onClick={() => { setIsOpen(false); setSelectedUser(null); }} className="text-slate-400 hover:text-white">✕</button>
          </div>

          {/* Contact List (Show if no user selected) */}
          {!selectedUser ? (
            <div className="flex-grow overflow-y-auto p-2">
              <p className="text-xs text-slate-400 mb-2 uppercase font-bold">Your Network</p>
              {contacts.map(contact => (
                <div 
                  key={contact._id} 
                  onClick={() => setSelectedUser(contact)}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                    {contact.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{contact.name}</p>
                    <p className="text-xs text-slate-500 truncate w-40">{contact.headline || "Professional"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Chat History (Show if user selected)
            <>
              <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50">
                <button onClick={() => setSelectedUser(null)} className="text-xs text-blue-600 hover:underline mb-2">← Back to contacts</button>
                
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    ref={scrollRef}
                    className={`flex ${msg.fromSelf || msg.sender === currentUser._id ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      msg.fromSelf || msg.sender === currentUser._id
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-2 bg-white border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  className="flex-grow text-sm border border-slate-200 rounded-full px-3 py-2 focus:outline-none focus:ring-2 ring-blue-500"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="bg-slate-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs">➤</button>
              </form>
            </>
          )}
        </div>
      )}

      {/* TOGGLE BUTTON (Floating Bubble) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        <span className="text-2xl">💬</span>
      </button>
    </div>
  );
};

export default ChatBox;