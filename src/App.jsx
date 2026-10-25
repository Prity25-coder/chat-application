import "./App.css";

import { useEffect, useRef, useState } from "react";

const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];

const channels = ["Poland Office", "Introductions", "India Office"];

const emojis = [
  "😀",
  "😂",
  "😍",
  "🥰",
  "😊",
  "😉",
  "😎",
  "🤔",
  "😭",
  "😅",
  "👍",
  "👎",
  "❤️",
  "🔥",
  "👏",
  "🎉",
  "🙏",
  "💯",
  "👋",
  "🙌",
  "💖",
  "✨",
  "🚀",
  "😇",
];

const colors = [
  "bg-red-400",
  "bg-lime-300",
  "bg-blue-400",
  "bg-purple-400",
  "bg-orange-300",
];

const initialMessages = [
  {
    id: 1,
    username: "Alan",
    text: "Welcome to Team Chat. 👋🎉 Send a message now to start interacting with other users in the app. ⬇️",
    time: "12:16",
    likes: 0,
  },
  {
    id: 2,
    username: "Bob",
    text: "Hey everyone!",
    time: "17:28",
    likes: 0,
  },
  {
    id: 3,
    username: "Elin",
    text: "Oh hi, everyone! Great to be here. 😊",
    time: "17:30",
    likes: 0,
  },
];

function App() {
  const [activeChannel, setActiveChannel] = useState("Introductions");

  const [messagesByChannel, setMessagesByChannel] = useState({
    Introductions: initialMessages,
    "Poland Office": [],
    "India Office": [],
  });

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChannels, setShowChannels] = useState(false);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const emojiRef = useRef(null);

  const messages = messagesByChannel[activeChannel] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeChannel]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function sendMessage(event) {
    event.preventDefault();

    const text = message.trim();

    if (!text) return;

    const username = user_list[Math.floor(Math.random() * user_list.length)];

    const newMessage = {
      id: crypto.randomUUID(),
      username,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      likes: 0,
    };

    setMessagesByChannel((previous) => ({
      ...previous,
      [activeChannel]: [...(previous[activeChannel] || []), newMessage],
    }));

    setMessage("");
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }

  function likeMessage(id) {
    setMessagesByChannel((previous) => ({
      ...previous,
      [activeChannel]: previous[activeChannel].map((msg) =>
        msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg,
      ),
    }));
  }

  function addEmoji(emoji) {
    setMessage((previous) => previous + emoji);
    inputRef.current?.focus();
  }

  function selectChannel(channel) {
    setActiveChannel(channel);
    setShowChannels(false);
  }

  function getAvatarColor(username) {
    const index = user_list.indexOf(username);
    return colors[index < 0 ? 0 : index];
  }

  function getInitials(username) {
    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <>
      <div className="flex h-dvh min-h-[420px] w-full overflow-hidden bg-white font-sans text-[#45464a]">
      
        {/* Mobile sidebar backdrop */}
        {showChannels && (
          <button
            type="button"
            aria-label="Close conversations"
            onClick={() => setShowChannels(false)}
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-[280px] shrink-0 flex-col border-r border-gray-100 bg-white transition-transform md:relative md:w-[30%] md:max-w-[325px] md:translate-x-0 ${
            showChannels
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Profile */}
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e88b90] text-xl text-white">
              RR
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-[#b5e27e]" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold">
                Rolande Raimondi
              </h2>
              <p className="truncate text-sm text-gray-400">Research Nurse</p>
            </div>
          </div>

          {/* Conversations */}
          <div className="mt-12 flex items-center justify-between px-6 pb-4">
            <h3 className="text-base font-medium">Conversations</h3>
            <button
              type="button"
              onClick={() => {
                const name = window.prompt("Enter channel name");
                if (name?.trim()) {
                  const channel = name.trim();
                  setMessagesByChannel((prev) => ({
                    ...prev,
                    [channel]: prev[channel] || [],
                  }));
                  setActiveChannel(channel);
                }
              }}
              title="Create a conversation"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-400 text-xl leading-none text-gray-500 hover:bg-gray-100"
            >
              +
            </button>
          </div>

          <nav className="space-y-1" aria-label="Conversations">
            {channels
              .concat(
                Object.keys(messagesByChannel).filter(
                  (channel) => !channels.includes(channel),
                ),
              )
              .map((channel) => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => selectChannel(channel)}
                  className={`flex w-full items-center gap-5 px-5 py-3 text-left transition ${
                    activeChannel === channel
                      ? "bg-[#6199ed] text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm ${
                      activeChannel === channel
                        ? "bg-[#578bdb]"
                        : "bg-[#edf0f4]"
                    }`}
                  >
                    #
                  </span>
                  <span className="truncate text-sm">{channel}</span>
                </button>
              ))}
          </nav>
        </aside>

        {/* Chat area */}
        <section className="flex min-w-0 flex-1 flex-col bg-[#edf2f6]">
          {/* Channel header */}
          <header className="mx-5 flex min-h-[78px] shrink-0 items-center justify-between gap-3 border-b border-gray-300 px-2 md:mx-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setShowChannels(true)}
                aria-label="Open conversations"
                className="rounded-md p-2 hover:bg-white md:hidden"
              >
                ☰
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold">
                  {activeChannel}
                </h1>
                <p className="truncate text-sm text-gray-500">
                  This Channel Is For Company Wide Chatter
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-sm text-gray-500">
              <span>{messages.length} | 100</span>
              <span className="text-xl" aria-label="Members">
                ♙
              </span>
            </div>
          </header>

          {/* Messages */}
          <main
            className="flex-1 overflow-y-auto px-5 py-6 md:px-7"
            aria-label="Message thread"
            aria-live="polite"
          >
            <div className="flex min-h-full flex-col justify-end gap-6">
              {messages.map((msg) => (
                <article key={msg.id} className="flex items-start gap-3">
                  {/* Avatar */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs text-white ${getAvatarColor(
                      msg.username,
                    )}`}
                  >
                    {getInitials(msg.username)}
                  </div>

                  {/* Message */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="text-base font-semibold">
                        {msg.username}
                      </h2>
                      <time className="text-xs text-gray-500">{msg.time}</time>
                    </div>

                    <div className="inline-flex max-w-full items-end gap-3 rounded-e-2xl rounded-es-2xl rounded-ss-sm bg-white px-4 py-3 shadow-[0_1px_1px_rgba(0,0,0,0.02)]">
                      <p className="min-w-0 whitespace-pre-wrap break-words text-[15px] leading-[1.4]">
                        {msg.text}
                      </p>

                      {/* Like button */}
                      <button
                        type="button"
                        onClick={() => likeMessage(msg.id)}
                        aria-label={`Like message, ${msg.likes} likes`}
                        title="Like message"
                        className="flex shrink-0 items-center gap-1 rounded-full px-1.5 py-1 text-xs text-gray-400 transition hover:bg-rose-50 hover:text-rose-500"
                      >
                        <span className="text-base">♥</span>
                        <span>{msg.likes}</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              <div ref={bottomRef} />
            </div>
          </main>

          {/* Composer */}
          <footer className="shrink-0 px-4 pb-4 pt-2 md:px-4 md:pb-4">
            <form
              onSubmit={sendMessage}
              className="relative flex min-h-[45px] items-center rounded-full border border-[#8c929a] bg-transparent px-3 transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200 md:px-5"
            >
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type Message"
                maxLength={2000}
                aria-label="Type message"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 md:text-base"
              />

              {/* Emoji picker */}
              <div ref={emojiRef} className="relative ml-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((previous) => !previous)}
                  aria-label="Choose emoji"
                  aria-expanded={showEmojiPicker}
                  title="Add emoji"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-white hover:text-gray-800"
                >
                  ☺
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-12 right-0 z-10 w-[min(288px,80vw)] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        Choose an emoji
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(false)}
                        className="rounded px-2 text-gray-400 hover:bg-gray-100"
                        aria-label="Close emoji picker"
                      >
                        ×
                      </button>
                    </div>

                    <div className="grid grid-cols-6 gap-1">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => addEmoji(emoji)}
                          className="flex h-9 items-center justify-center rounded-lg text-xl hover:bg-blue-50"
                          aria-label={`Insert ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!message.trim()}
                aria-label="Send message"
                title="Send message"
                className="ml-1 hidden rounded-full bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:hidden sm:block"
              >
                Send
              </button>
            </form>

            <p className="mt-1 px-3 text-[11px] text-gray-400">
              Press Enter to send · Click ☺ to add emojis
            </p>
          </footer>
        </section>
      </div>
    </>
  );
}

export default App;
