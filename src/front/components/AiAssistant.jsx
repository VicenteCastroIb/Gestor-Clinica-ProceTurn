import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const AiAssistant = ({ appointments = [], stats = {}, token, allAppointments = [] }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState({});
    const messagesEndRef = useRef(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    useEffect(() => {
        if (!isOpen || !token) return;
        const fetchAvailability = async () => {
            try {
                const resp = await fetch(`${BACKEND}/api/procedure-capacity/bulk`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ days_ahead: 14 })
                });
                if (resp.ok) {
                    const data = await resp.json();
                    const formatted = {};
                    for (const [date, slots] of Object.entries(data)) {
                        const grouped = {};
                        for (const slot of slots) {
                            const key = `${slot.procedure}|${slot.specialty}`;
                            if (!grouped[key]) grouped[key] = { procedure: slot.procedure, specialty: slot.specialty, procedure_id: slot.procedure_id, specialty_id: slot.specialty_id, slots: [] };
                            grouped[key].slots.push({ time: slot.time, available: slot.available });
                        }
                        formatted[date] = Object.values(grouped);
                    }
                    setAvailability(formatted);
                }
            } catch (err) { console.error("Error fetching availability:", err); }
        };
        fetchAvailability();
    }, [isOpen, token, refreshKey]);

    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    const buildContext = () => {
        const today = new Date();
        const delayed = appointments.filter(a => a.status === "delayed");
        const scheduled = appointments.filter(a => a.status === "scheduled");
        const confirmed = appointments.filter(a => a.status === "confirmed");
        const cancelled = appointments.filter(a => a.status === "cancelled");
        const postponed = appointments.filter(a => a.status === "postponed");

        const otherAppointments = allAppointments.filter(a => {
            const d = new Date(a.start_date_time);
            return !(d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear());
        });

        const futureText = otherAppointments.length > 0
            ? `\n\nTURNOS PROGRAMADOS RESTO DEL MES:\n${otherAppointments.map(a => 
                `- ${a.patient_name} (DNI: ${a.patient_dni || 'N/A'}) | ${a.procedure_name} | ${new Date(a.start_date_time).toLocaleDateString('es-CL')} ${new Date(a.start_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | Estado: ${a.status}`
            ).join('\n')}`
            : '';

        let availabilityText = "";
        const dates = Object.keys(availability).sort();
        if (dates.length > 0) {
            availabilityText = "\n\nDISPONIBILIDAD PRÓXIMOS DÍAS:\n";
            for (const date of dates) {
                const d = new Date(date + "T12:00:00");
                const dayName = dayNames[d.getDay()];
                availabilityText += `\n📅 ${dayName} ${date}:\n`;
                for (const proc of availability[date]) {
                    const slotsStr = proc.slots.map(s => `${s.time} (${s.available} lugar${s.available > 1 ? 'es' : ''})`).join(", ");
                    availabilityText += `  - [ID:${proc.procedure_id}] ${proc.procedure} (Esp ID:${proc.specialty_id} - ${proc.specialty}): ${slotsStr}\n`;
                }
            }
        }

        const uniquePatients = [];
        const seenIds = new Set();
        for (const a of allAppointments) {
            if (!seenIds.has(a.patient_id)) {
                seenIds.add(a.patient_id);
                uniquePatients.push({ id: a.patient_id, name: a.patient_name, dni: a.patient_dni });
            }
        }
        const patientsText = uniquePatients.length > 0
            ? `\n\nPACIENTES REGISTRADOS:\n${uniquePatients.map(p => `- ${p.name} (DNI: ${p.dni})`).join('\n')}`
            : '';

        return `Eres un asistente de gestión de turnos hospitalarios llamado "ProceTurn AI". 
Responde siempre en español, de forma breve y práctica (máximo 3-4 oraciones por punto).
Usa emojis moderadamente para hacer el texto más legible.
IMPORTANTE: Tú NO puedes agendar, crear, modificar ni cancelar turnos directamente. Solo puedes SUGERIR y RECOMENDAR. Nunca digas que has reservado o agendado algo. Siempre indica que el usuario debe confirmar la acción.
Cuando sugieras reprogramar un turno, SIEMPRE recomienda horarios específicos de la disponibilidad real que tienes abajo.

Cuando sugieras horarios específicos para reprogramar o agendar turnos, agrega una línea [AGENDAR:...] por CADA sugerencia concreta. Formato exacto:
[AGENDAR:{"date":"YYYY-MM-DD","start_time":"HH:MM:SS","end_time":"HH:MM:SS","procedure_id":1,"specialty_id":1,"procedure":"nombre","patient_name":"nombre del paciente"}]
Reglas:
- Agrega una línea por cada combinación paciente+horario que sugieras.
- Si sugieres 3 opciones para un paciente, agrega 3 líneas [AGENDAR:...].
- Si sugieres horarios para varios pacientes, agrega una línea por cada uno.
- Usa los IDs reales de procedimientos y especialidades.
- El end_time debe ser el tiempo de duración después del start_time.
- Solo incluye horarios que existan en la disponibilidad real.
- NO agregues estas líneas en resúmenes generales sin sugerencias concretas de agendamiento.

DATOS DE HOY (${today.toLocaleDateString('es-CL')}):
- Total turnos activos: ${stats.total || 0}
- Confirmados: ${stats.confirmed || 0}
- Programados (sin confirmar): ${stats.scheduled || 0}
- Demorados: ${stats.delayed || 0}
- Cancelados: ${stats.cancelled || 0}

${delayed.length > 0 ? `TURNOS DEMORADOS:\n${delayed.map(a => `- ${a.patient_name} (DNI: ${a.patient_dni}) | ${a.procedure_name} | ${new Date(a.start_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`).join('\n')}` : ''}

${scheduled.length > 0 ? `TURNOS PENDIENTES DE CONFIRMAR:\n${scheduled.map(a => `- ${a.patient_name} (DNI: ${a.patient_dni}) | ${a.procedure_name} | ${new Date(a.start_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`).join('\n')}` : ''}

${confirmed.length > 0 ? `TURNOS CONFIRMADOS:\n${confirmed.map(a => `- ${a.patient_name} (DNI: ${a.patient_dni}) | ${a.procedure_name} | ${new Date(a.start_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`).join('\n')}` : ''}

${cancelled.length > 0 ? `TURNOS CANCELADOS HOY:\n${cancelled.map(a => `- ${a.patient_name} | ${a.procedure_name}`).join('\n')}` : ''}

${postponed.length > 0 ? `TURNOS POSPUESTOS:\n${postponed.map(a => `- ${a.patient_name} (DNI: ${a.patient_dni}) | ${a.procedure_name} | ${new Date(a.start_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`).join('\n')}` : ''}
${futureText}
${availabilityText}
${patientsText}

Basándote en estos datos, ayuda al usuario con sugerencias sobre gestión de turnos, horarios disponibles reales para reprogramar, y optimización de la agenda. Cuando recomiendes un horario, usa SOLO los horarios que aparecen en la disponibilidad real de arriba.`;
    };

const parseResponse = (text) => {
        const regex = /\[AGENDAR:(\{.*?\})\]/g;
        const actions = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            try {
                actions.push(JSON.parse(match[1]));
            } catch { /* skip invalid */ }
        }
        const cleanMessage = text.replace(/\[AGENDAR:\{.*?\}\]/g, '').trim();
        return { message: cleanMessage, actions };
    };

    const sendMessage = async (text) => {
        if (!text.trim()) return;
        const userMsg = { role: "user", content: text };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const geminiHistory = updatedMessages.slice(0, -1).map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
            }));

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: buildContext() }] },
                        contents: [
                            ...geminiHistory,
                            { role: "user", parts: [{ text }] }
                        ]
                    })
                }
            );

            const data = await response.json();
            const assistantText = data.candidates?.[0]?.content?.parts?.[0]?.text
                || "No pude generar una respuesta. Intenta de nuevo.";

            setMessages(prev => [...prev, { role: "assistant", content: assistantText }]);
        } catch (err) {
            console.error("Error AI:", err);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Error de conexión con el asistente. Verifica tu conexión e intenta nuevamente."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const quickPrompts = [
        { label: "Resumen del día", prompt: "Dame un resumen rápido de cómo va el día y qué debería priorizar ahora." },
        { label: "Turnos demorados", prompt: "Analiza los turnos demorados y sugiere qué hacer con cada uno. Recomienda horarios disponibles para reprogramarlos." },
        { label: "Optimizar agenda", prompt: "¿Cómo puedo optimizar la agenda de hoy para reducir tiempos muertos?" },
        { label: "Horarios disponibles", prompt: "¿Qué horarios disponibles hay en los próximos días para cada procedimiento?" }
    ];

    return (
        <>
            {!isOpen && (
                <button
                    className="position-fixed d-flex align-items-center gap-2 shadow-lg border-0 px-3 py-2"
                    style={{
                        bottom: "24px",
                        right: "24px",
                        zIndex: 1050,
                        backgroundColor: "#000",
                        color: "#fff",
                        borderRadius: "50px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        transition: "all 0.2s ease"
                    }}
                    onClick={() => setIsOpen(true)}
                >
                    <i className="bi bi-stars" style={{ fontSize: "1.1rem" }}></i>
                    Asistente IA
                </button>
            )}

            <div
                className="position-fixed top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
                style={{
                    width: isOpen ? "380px" : "0px",
                    zIndex: 1055,
                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                    borderLeft: isOpen ? "1px solid #e5e7eb" : "none"
                }}
            >
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ minHeight: "64px" }}>
                    <div className="d-flex align-items-center gap-2">
                        <div className="d-flex align-items-center justify-content-center"
                            style={{ width: 32, height: 32, borderRadius: "10px", backgroundColor: "#000" }}>
                            <i className="bi bi-stars text-white" style={{ fontSize: "0.9rem" }}></i>
                        </div>
                        <div>
                            <span className="fw-bold" style={{ fontSize: "0.9rem" }}>ProceTurn AI</span>
                            <div className="d-flex align-items-center gap-1">
                                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#2ecc71", display: "inline-block" }}></span>
                                <span className="text-muted" style={{ fontSize: "0.65rem" }}>
                                    {Object.keys(availability).length > 0 ? "Datos cargados" : "Cargando disponibilidad..."}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-light rounded-3 px-2" title="Limpiar chat y actualizar datos" onClick={() => {
                            setMessages([]);
                            setRefreshKey(prev => prev + 1);
                        }}>
                            <i className="bi bi-arrow-counterclockwise" style={{ fontSize: "0.8rem" }}></i>
                        </button>
                        <button className="btn btn-sm btn-light rounded-3 px-2" onClick={() => setIsOpen(false)}>
                            <i className="bi bi-x-lg" style={{ fontSize: "0.8rem" }}></i>
                        </button>
                    </div>
                </div>

                <div className="flex-grow-1 p-3" style={{ overflowY: "auto", backgroundColor: "#fafafa" }}>
                    {messages.length === 0 ? (
                        <div className="text-center py-4">
                            <div className="d-flex align-items-center justify-content-center mx-auto mb-3"
                                style={{ width: 48, height: 48, borderRadius: "14px", backgroundColor: "#f3f4f6" }}>
                                <i className="bi bi-stars" style={{ fontSize: "1.4rem", color: "#6b7280" }}></i>
                            </div>
                            <p className="fw-bold mb-1" style={{ fontSize: "0.9rem" }}>¿En qué puedo ayudarte?</p>
                            <p className="text-muted mb-4" style={{ fontSize: "0.75rem" }}>
                                Analizo tus turnos y disponibilidad real para darte sugerencias con horarios concretos.
                            </p>
                            <div className="d-flex flex-column gap-2">
                                {quickPrompts.map((qp, idx) => (
                                    <button
                                        key={idx}
                                        className="btn btn-light border text-start rounded-3 px-3 py-2 d-flex align-items-center gap-2"
                                        style={{ fontSize: "0.78rem", transition: "all 0.15s" }}
                                        onClick={() => sendMessage(qp.prompt)}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-arrow-right-circle text-muted"></i>
                                        {qp.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, idx) => {
                                const parsed = msg.role === "assistant" ? parseResponse(msg.content) : null;
                                return (
                                    <div key={idx} className={`mb-3 d-flex ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}>
                                        <div style={{ maxWidth: "90%" }}>
                                            <div
                                                className="px-3 py-2 rounded-4"
                                                style={{
                                                    backgroundColor: msg.role === "user" ? "#000" : "#fff",
                                                    color: msg.role === "user" ? "#fff" : "#1a1a1a",
                                                    fontSize: "0.8rem",
                                                    lineHeight: "1.5",
                                                    border: msg.role === "assistant" ? "1px solid #e5e7eb" : "none",
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-word"
                                                }}
                                            >
                                                {parsed ? parsed.message : msg.content}
                                            </div>
                                            {parsed?.actions?.length > 0 && (
                                                <div className="d-flex flex-column gap-1 mt-2">
                                                    {parsed.actions.map((action, i) => (
                                                        <button
                                                            key={i}
                                                            className="btn btn-sm btn-success rounded-3 w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                                                            style={{ fontSize: "0.7rem" }}
                                                            onClick={() => {
                                                                const params = new URLSearchParams();
                                                                if (action.date) params.set("date", action.date);
                                                                if (action.procedure_id) params.set("procedure_id", action.procedure_id);
                                                                if (action.specialty_id) params.set("specialty_id", action.specialty_id);
                                                                const patient = allAppointments.find(a =>
                                                                    a.patient_name?.toLowerCase().includes(action.patient_name?.toLowerCase())
                                                                );
                                                                if (patient?.patient_dni) params.set("dni", patient.patient_dni);
                                                                navigate(`/new-appointment?${params.toString()}`);
                                                                setIsOpen(false);
                                                            }}
                                                        >
                                                            <i className="bi bi-calendar-plus"></i>
                                                            {action.patient_name} → {action.procedure} — {action.date} {action.start_time?.slice(0, 5)} hs
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {loading && (
                                <div className="d-flex justify-content-start mb-3">
                                    <div className="px-3 py-2 rounded-4 bg-white border" style={{ fontSize: "0.8rem" }}>
                                        <div className="d-flex gap-1 align-items-center">
                                            <div className="spinner-grow spinner-grow-sm text-muted" style={{ width: 8, height: 8 }}></div>
                                            <div className="spinner-grow spinner-grow-sm text-muted" style={{ width: 8, height: 8, animationDelay: "0.15s" }}></div>
                                            <div className="spinner-grow spinner-grow-sm text-muted" style={{ width: 8, height: 8, animationDelay: "0.3s" }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {messages.length > 0 && (
                    <div className="px-3 py-2 border-top d-flex gap-1 flex-wrap" style={{ backgroundColor: "#fafafa" }}>
                        {quickPrompts.slice(0, 2).map((qp, idx) => (
                            <button
                                key={idx}
                                className="btn btn-sm btn-light border rounded-pill px-2 py-1"
                                style={{ fontSize: "0.65rem" }}
                                onClick={() => sendMessage(qp.prompt)}
                                disabled={loading}
                            >
                                {qp.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="p-3 border-top bg-white">
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control form-control-sm border rounded-3"
                            placeholder="Escribe tu consulta..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage(input);
                                }
                            }}
                            disabled={loading}
                            style={{ fontSize: "0.8rem" }}
                        />
                        <button
                            className="btn btn-sm btn-dark rounded-3 px-3"
                            onClick={() => sendMessage(input)}
                            disabled={loading || !input.trim()}
                        >
                            <i className="bi bi-send-fill" style={{ fontSize: "0.8rem" }}></i>
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ backgroundColor: "rgba(0,0,0,0.15)", zIndex: 1054 }}
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default AiAssistant;