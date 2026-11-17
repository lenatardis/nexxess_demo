import React, {useEffect, useRef, useState} from "react";
import styles from './DemoChat.module.scss';
import closeIcon from "../../../assets/icons/closeWhite.svg";
import messageIcon from "../../../assets/icons/massageIcon.svg";
import {getAccessToken} from "../../../api/localStorage";
import {getDemoChat, sendDemoChat} from "../../../api/pagesApi";

// How long the "consultant" seems to be typing before the canned reply is shown.
const REPLY_DELAY_MS = 1200;

const time = (iso) => new Date(iso).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});

// Demo only: stands in for the Bitrix24 live chat widget of the original. The chat buttons of the
// right box click `.b24-widget-button-openline_livechat` and Logout clicks
// `.bx-livechat-control-btn-close` – the stub keeps those two class names, so they work unchanged.
const DemoChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(null);
    const [text, setText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const listRef = useRef(null);
    const replyTimer = useRef(null);

    useEffect(() => {
        if (isOpen && messages === null) {
            getAccessToken()
                .then((token) => getDemoChat(token))
                .then((response) => setMessages(response?.results || []));
        }
    }, [isOpen, messages]);

    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages, isTyping, isOpen]);

    useEffect(() => () => clearTimeout(replyTimer.current), []);

    const onSend = (e) => {
        e.preventDefault();
        const value = text.trim();
        if (!value || isTyping) return;
        setText('');
        getAccessToken()
            .then((token) => sendDemoChat(token, value))
            .then((response) => {
                const [sent, reply] = response?.results || [];
                if (!sent) return;
                setMessages((prev) => [...(prev || []), sent]);
                setIsTyping(true);
                replyTimer.current = setTimeout(() => {
                    setMessages((prev) => [...(prev || []), reply]);
                    setIsTyping(false);
                }, REPLY_DELAY_MS);
            });
    };

    return (
        <>
            <button type="button" className={`b24-widget-button-openline_livechat ${styles.trigger}`}
                    onClick={() => setIsOpen(true)} aria-hidden="true" tabIndex={-1}/>
            {isOpen && (
                <div className={styles.chat} role="dialog" aria-label="Chat with your consultant">
                    <div className={styles.chat__header}>
                        <div>
                            <p className={styles.chat__title}>Chat with your consultant</p>
                            <p className={styles.chat__note}>Demo chat – the answers are automatic</p>
                        </div>
                        <button type="button" className={`bx-livechat-control-btn bx-livechat-control-btn-close ${styles.chat__close}`}
                                onClick={() => setIsOpen(false)}>
                            <img src={closeIcon} alt="Close"/>
                        </button>
                    </div>
                    <div className={styles.chat__messages} ref={listRef}>
                        {messages && messages.length === 0 && !isTyping && (
                            <p className={styles.chat__empty}>Write your question – your consultant will answer here.</p>
                        )}
                        {messages && messages.map((message) => (
                            <div key={message.id}
                                 className={message.from === 'client' ? styles.messageOwn : styles.message}>
                                <p>{message.text}</p>
                                <span>{time(message.created_date)}</span>
                            </div>
                        ))}
                        {isTyping && <div className={styles.typing}><i/><i/><i/></div>}
                    </div>
                    <form className={styles.chat__form} onSubmit={onSend}>
                        <input type="text" value={text} maxLength={1000} placeholder="Type a message"
                               onChange={(e) => setText(e.target.value)} autoFocus/>
                        <button type="submit" title="Send">
                            <img src={messageIcon} alt="Send"/>
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}

export default DemoChat;
