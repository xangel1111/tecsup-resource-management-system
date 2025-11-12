import { useState, useEffect, useRef } from 'react';
import './Asistente.css'; 
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa'; 
import aiApi from '../../api/aiApi'; 

const Asistente = () => {
  const [messages, setMessages] = useState([]); 
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- getAiResponse HA SIDO ELIMINADA ---
  // (La lógica ahora está en handleSendMessage)

  const handleSendMessage = async (e) => {
      e.preventDefault();
      const prompt = inputMessage.trim();
      if (prompt === '') return;

      // 1. Añade el mensaje del usuario al chat
      const newMessage = { sender: 'user', text: prompt };
      
      const conversationHistory = [...messages, newMessage].map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant', 
        content: msg.text
      }));

      const historyToSend = conversationHistory.filter(
        msg => msg.content !== "¡Hola! Soy tu Asistente IA. Cuéntame sobre tu proyecto de redes y te recomendaré las herramientas que necesitas."
      );

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage('');
      setIsLoading(true);

      try {
        // 2. Envía el historial completo en el body
        const response = await aiApi.sendMessage({ history: historyToSend });

        // 3. ¡AQUÍ ESTÁ LA CORRECCIÓN!
        // Extrae el texto de la propiedad 'reply'
        const aiResponseText = response.reply; 

        // 4. Añade la respuesta de la IA (ahora sí es un string)
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'ai', text: aiResponseText },
        ]);

      } catch (error) {
        console.error("Error al contactar la IA:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'ai', text: 'Lo siento, no pude procesar tu solicitud en este momento.' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mensaje de bienvenida inicial
  useEffect(() => {
    setMessages([{ sender: 'ai', text: "¡Hola! Soy tu Asistente IA. Cuéntame sobre tu proyecto de redes y te recomendaré las herramientas que necesitas." }]);
  }, []);

  return (
    <div className="ai-assistant-chat">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
             <div className="message-icon">
               {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
             </div>
             <div className="message-bubble">
               {/* Esta línea ahora funcionará porque msg.text es un string */}
               {msg.text.split('\n').map((line, i) => (
                 <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
               ))}
             </div>
           </div>
        ))}

        {/* Indicador de "Escribiendo..." */}
        {isLoading && (
          <div className="chat-message ai">
            <div className="message-icon">
              <FaRobot />
            </div>
            <div className="message-bubble typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Describe tu proyecto de redes..."
          className="chat-input"
          disabled={isLoading} 
        />
        <button type="submit" className="send-button" disabled={isLoading}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default Asistente;