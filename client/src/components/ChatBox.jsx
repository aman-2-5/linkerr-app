import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const ChatBox = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  
  // Track unread status (true/false) instead of count
  const [notifications, setNotifications] = useState({});
  
  const socket = useRef();
  const scrollRef = useRef();

  // 1. Connect to Socket.io
  useEffect(() => {
    if (currentUser) {
      socket.current = io('https://linkerr-api.onrender.com'); 
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // 2. Fetch Contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get('https://linkerr-api.onrender.com/api/users');
        setContacts(res.data.filter(u => u._id !== currentUser._id));
      } catch (err) {
        console.error("Error fetching contacts", err);
      }
    };
    if (currentUser) fetchContacts();
  }, [currentUser]);

  // 3. Fetch Chat History
  useEffect(() => {
    if (selectedUser) {
      // Clear notification for this user immediately
      setNotifications(prev => {
        const newNotifs = { ...prev };
        delete newNotifs[selectedUser._id];
        return newNotifs;
      });

      const fetchMessages = async () => {
        try {
          const res = await axios.get(`https://linkerr-api.onrender.com/api/messages/${currentUser._id}/${selectedUser._id}`);
          setMessages(res.data);
        } catch (err) {
          console.error("Error fetching messages", err);
        }
      };
      fetchMessages();
    }
  }, [selectedUser, currentUser]);

  // 4. Listen for Incoming Messages
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        // CASE A: Chat is open with this person
        if (selectedUser && data.from === selectedUser._id) {
          setMessages((prev) => [...prev, { fromSelf: false, text: data.msg }]);
        } 
        // CASE B: Chat is closed or with someone else -> Mark as "Has New Message"
        else {
          setNotifications(prev => ({
            ...prev,
            [data.from]: true // Just mark as true, don't count
          }));
          
          // Move sender to top
          setContacts(prev => {
             const sender = prev.find(u => u._id === data.from);
             if (!sender) return prev;
             const others = prev.filter(u => u._id !== data.from);
             return [sender, ...others];
          });
        }
      });
    }
  }, [selectedUser]);

  // 5. Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgData = {
      to: selectedUser._id,
      from: currentUser._id,
      msg: newMessage,
    };

    const msgs = [...messages];
    msgs.push({ fromSelf: true, text: newMessage });
    setMessages(msgs);
    setNewMessage(''); 

    socket.current.emit("send-msg", msgData);

    try {
      await axios.post('https://linkerr-api.onrender.com/api/messages', {
        from: currentUser._id,
        to: selectedUser._id,
        message: msgData.msg,
      });
    } catch (err) {
      console.error("Failed to save message to DB");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-t-xl shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden">
          
          {/* HEADER */}
          <div className="bg-slate-900 text-white p-3 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
               {/* 🔙 Back Button */}
               {selectedUser && (
                 <button 
                   onClick={() => setSelectedUser(null)} 
                   className="text-slate-300 hover:text-white transition p-1 rounded-full hover:bg-slate-800"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                   </svg>
                 </button>
               )}
               <h3 className="font-bold text-sm truncate max-w-[150px]">
                 {selectedUser ? selectedUser.name : "Messages"}
               </h3>
            </div>
            
            <button onClick={() => { setIsOpen(false); setSelectedUser(null); }} className="text-slate-400 hover:text-white font-bold">✕</button>
          </div>

          {/* CONTACT LIST */}
          {!selectedUser ? (
            <div className="flex-grow overflow-y-auto p-2">
              <p className="text-xs text-slate-400 mb-2 uppercase font-bold">Your Network</p>
              {contacts.map(contact => (
                <div 
                  key={contact._id} 
                  onClick={() => setSelectedUser(contact)}
                  className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition relative"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        {contact.name?.[0]}
                      </div>
                      
                      {/* 🔴 RED DOT ON AVATAR (Clean Look) */}
                      {notifications[contact._id] && (
                        <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    
                    <div>
                      <p className={`text-sm ${notifications[contact._id] ? "font-bold text-slate-900" : "text-slate-700"}`}>
                        {contact.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate w-32">{contact.headline || "Professional"}</p>
                    </div>
                  </div>
                  
                  {/* 🔴 RED DOT ON RIGHT SIDE (Optional extra visibility) */}
                  {notifications[contact._id] && (
                    <div className="bg-red-500 w-2 h-2 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // CHAT AREA
            <>
              <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      msg.fromSelf
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>

              {/* INPUT */}
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

      {/* FLOATING BUTTON (With Dot) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        <span className="text-2xl">💬</span>
        {Object.keys(notifications).length > 0 && (
           <span className="absolute top-0 right-0 bg-red-500 w-4 h-4 rounded-full border-2 border-white"></span>
        )}
      </button>
    </div>
  );
};

export default ChatBox;