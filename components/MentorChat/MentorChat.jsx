"use client"
import { useState, useRef, useEffect } from "react";
import { FiSend, FiSearch, FiPlus, FiMenu } from "react-icons/fi";
import axios from "axios";

const ChatBot = () => {
  const [allChats,setAllChats]=useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading,setIsLoading]=useState(false);
  const chatEndRef = useRef(null);
  useEffect(()=>{
    setIsLoading(true);
   fetchAllChats();
   setIsLoading(false);
  },[])

  const fetchAllChats=async()=>{
    try {
      const response= await axios.get("/api/mentor/chat",{withCredentials:true});
      console.log("response",response);
    } catch (error) {
      console.log("error in fetching all chats",error);
    }
  }

  const dummyTopics = [
    { id: 0, title: "Web Development Queries", lastMessage: new Date(2024, 0, 15) },
    { id: 1, title: "React Component Design", lastMessage: new Date(2024, 0, 14) },
    { id: 2, title: "Tailwind CSS Styling", lastMessage: new Date(2024, 0, 13) },
    { id: 3, title: "JavaScript Best Practices", lastMessage: new Date(2024, 0, 12) },
    { id: 4, title: "API Integration Help", lastMessage: new Date(2024, 0, 11) }
  ];

  const dummyMessages = [
    { id: 1, text: "How do I implement responsive design?", sender: "user", timestamp: new Date(2024, 0, 15, 10, 30) },
    { id: 2, text: "Responsive design can be implemented using media queries and flexible layouts. In Tailwind, you can use responsive prefixes like sm:, md:, lg: to apply styles at different breakpoints.", sender: "bot", timestamp: new Date(2024, 0, 15, 10, 31) },
    { id: 3, text: "Can you show me an example?", sender: "user", timestamp: new Date(2024, 0, 15, 10, 32) },
    { id: 4, text: "Here is a simple example using className=\"w-full md:w-1/2 lg:w-1/3\". This will make an element full width on mobile, half width on tablet, and one-third width on desktop.", sender: "bot", timestamp: new Date(2024, 0, 15, 10, 33) },
    { id: 5, text: "That's really helpful, thanks!", sender: "user", timestamp: new Date(2024, 0, 15, 10, 34) }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dummyMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900 ">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed md:relative md:translate-x-0 z-30 w-72 h-full transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-700`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 dark:text-white">
          <div className="flex items-center justify-between mb-4">
            <button onClick={()=>setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden"> close</button>
            <h2 className="text-xl font-semibold text-gray-800" >Chats</h2>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FiPlus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="relative ">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-130px)]">
          {dummyTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setActiveChat(topic.id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${activeChat === topic.id ? "bg-blue-50" : ""}`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900 truncate">{topic.title}</h3>
                {/* {topic.unread > 0 && (
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full">
                    {topic.unread}
                  </span>
                )} */}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {(topic.lastMessage, "MMM d, yyyy")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden ">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <FiMenu className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="ml-2 text-xl font-semibold text-gray-800">
              {dummyTopics[activeChat]?.title}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          {dummyMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-[#1f2937] text-white"} shadow-sm`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {(message.timestamp, "HH:mm")}
                </p>
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
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;