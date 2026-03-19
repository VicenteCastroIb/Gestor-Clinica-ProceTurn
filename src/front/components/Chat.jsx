import { useState, useEffect } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { useNavigate } from 'react-router-dom';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import '../styles/chat.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Sidebar,
    Search,
    ConversationList,
    Conversation,
    Avatar,
    ConversationHeader
} from '@chatscope/chat-ui-kit-react';

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function Chat() {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();
    const token = store.token;
    const [patients, setPatients] = useState([]);
    const [activePatientId, setActivePatientId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const activePatient = patients.find(p => p.id === activePatientId);

    // Load patients on mount
    useEffect(() => {
        fetch(`${BACKEND}/api/patients`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => setPatients(data))
            .catch(err => console.error("Error cargando pacientes:", err));
    }, [token]);

    // Load messages when active patient changes
    useEffect(() => {
        if (!activePatientId) return;
        setLoading(true);
        fetch(`${BACKEND}/api/messages/${activePatientId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => setMessages(data))
            .catch(err => console.error("Error cargando mensajes:", err))
            .finally(() => setLoading(false));
    }, [activePatientId]);

    useEffect(() => {
        if (!activePatientId) return;
        const interval = setInterval(() => {
            fetch(`${BACKEND}/api/messages/${activePatientId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(r => r.json())
                .then(data => setMessages(data))
                .catch(err => console.error("Error cargando mensajes:", err));
        }, 2000);
        return () => clearInterval(interval);
    }, [activePatientId]);

    const handleSend = async (text) => {
        if (!text.trim()) return;
        const response = await fetch(`${BACKEND}/api/messages/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ patient_id: activePatientId, body: text })
        });
        if (response.ok) {
            const newMsg = await response.json();
            setMessages(prev => [...prev, newMsg]);
        }
    };


    return (
        <div className="bg-light min-vh-100 p-4">
            <div className="mb-4">
                <h4 className="fw-bold mb-0">Mensajes</h4>
                <p className="text-muted small mb-0">Conversaciones recientes con pacientes</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
                <div style={{ height: "100%", position: "relative" }}>
                    <MainContainer>
                        {/* Left panel: Patient list */}
                        <Sidebar position="left" scrollable={false}>
                            <Search placeholder="Buscar chats..." />
                            <ConversationList>
                                {patients.map(p => (
                                    <Conversation
                                        key={p.id}
                                        name={p.full_name}
                                        lastSenderName={p.full_name}
                                        info={p.phone || "Sin teléfono"}
                                        active={p.id === activePatientId}
                                        unreadCnt={p.unread_count || 0}
                                        onClick={() => setActivePatientId(p.id)}
                                    >
                                        <Avatar
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name)}&background=3a9e6e&color=fff`}
                                            name={p.full_name}
                                        />
                                    </Conversation>
                                ))}
                            </ConversationList>
                        </Sidebar>

                        {/* Right panel: Messages */}
                        {activePatient ? (
                            <ChatContainer>
                                <ConversationHeader>
                                    <ConversationHeader.Back />
                                    <Avatar
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activePatient.full_name)}&background=3a9e6e&color=fff`}
                                        name={activePatient.full_name}
                                    />
                                    <ConversationHeader.Content
                                        userName={activePatient.full_name}
                                        info={activePatient.phone || "Sin teléfono"}
                                        onClick={() => navigate(`/patient/${activePatient.id}`)}
                                        style={{ cursor: "pointer" }}
                                    />
                                </ConversationHeader>

                                <MessageList loading={loading} typingIndicator={false}>
                                    {messages.map((m, idx) => (
                                        <Message
                                            key={idx}
                                            model={{
                                                message: m.body,
                                                sender: m.sender_name,
                                                direction: m.direction,
                                                position: "single"
                                            }}
                                        >
                                            {m.direction === "incoming" && (
                                                <Avatar
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activePatient.full_name)}&background=3a9e6e&color=fff`}
                                                    name={activePatient.full_name}
                                                />
                                            )}
                                        </Message>
                                    ))}
                                </MessageList>

                                <MessageInput
                                    placeholder="Escribe un mensaje aquí..."
                                    onSend={handleSend}
                                    attachButton={false}
                                />
                            </ChatContainer>
                        ) : (
                            <ChatContainer>
                                <MessageList>
                                    <MessageList.Content style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#999", fontSize: "1.2em" }}>
                                        Seleccioná una conversación para comenzar.
                                    </MessageList.Content>
                                </MessageList>
                            </ChatContainer>
                        )}
                    </MainContainer>
                </div>
            </div>
        </div>
    );
};
