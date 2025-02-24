import { useState, useRef, useEffect } from "react";
import { FiSend, FiSearch, FiPlus, FiMenu } from "react-icons/fi";
import axios from "axios";
import {format}  from 'date-fns';

const ChatBot = () => {
  const [allChats, setAllChats] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);  // Update to null for no initial active chat
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    fetchAllChats();
    setIsLoading(false);
  }, []);

  const fetchAllChats = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/mentor/chat/allchats", { withCredentials: true });
      console.log("response", response);
      setAllChats(response.data.allChats);
    } catch (error) {
      console.log("Error fetching all chats", error);
    }finally{
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await axios.post("/api/mentor/chat", { withCredentials: true });
      fetchAllChats();
      console.log("response", response.data);
    } catch (error) {
      console.log("Error creating new chat", error);
    }
  };

  const handleChatSelection = (chatId) => {
    const selectedChat = allChats.find((chat) => chat._id === chatId);
    setActiveChat(selectedChat);
    setMessages(selectedChat?.messages || []);
  };

  console.log("is this id of the selected chat now: ", activeChat);


  const UpdateCurrentChat = async () => {
    try {
      const response = await axios.post("/api/mentor/chat/allchats/currentChat", { chatId: activeChat._id });
      console.log("Updated chat:", response.data);

      // Ensure updated messages are set
      if (response.data && response.data.updatedChatMessages) {
        setMessages(response.data.updatedChatMessages.messages);
      }
    } catch (error) {
      console.log("Error updating current chat", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return; 

    try {
      const response = await axios.post("/api/mentor", { message: newMessage, chatId: activeChat._id });
      console.log(response.data);

      // Optimistically update messages (immediate UI update)
      setMessages((prevMessages) => [...prevMessages, { content: newMessage, senderId: "user", receiverId: "gemini" }]);

      setNewMessage("");

      // Fetch the latest chat messages after sending
      await UpdateCurrentChat();
    } catch (error) {
      console.log("Error in sending message", error);
    }
  };


  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if(isLoading){
    return(
      <div className="min-h-screen w-full flex flex-col justify-center items-center ">
     <LoadingSkeleton/>
        </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed md:relative md:translate-x-0 z-30 w-72 h-full transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-700`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 dark:text-white">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
              Close
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
            <button onClick={createNewChat} className="p-2 hover:bg-gray-100 rounded-full">
              <FiPlus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-130px)]">
          {allChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleChatSelection(chat._id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${activeChat?._id === chat._id ? "bg-blue-50" : ""}`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">{chat.name}</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content.slice(0, 30) : "No messages yet"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              <FiMenu className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="ml-2 text-xl font-semibold dark:text-white text-gray-800">{activeChat ? activeChat.name : "Select a chat"}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((message, index) => (
  <div key={index} className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"} mb-4`}>
    <div
      className={`max-w-[70%] p-3 rounded-lg ${
        message.receiverId === "gemini" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"
      } shadow-sm`}
    >
      <p className="text-sm">{message.content}</p>

      {/* Properly format the timestamp
<p className="text-xs mt-1 opacity-70">
  {message.createdAt ? format(new Date(message.createdAt * 1000), "dd MMM yyyy, hh:mm a") : "Invalid date"}
</p> */}

    </div>
  </div>
))}
          <div ref={chatEndRef} />
        </div>


        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
