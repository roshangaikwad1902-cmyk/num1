import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getChatbotResponse } from '@/lib/chatbot';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: i18n.language === 'mr' ? 'नमस्कार! मी तुम्हाला कशी मदत करू शकतो?' : 'Welcome to SmartKrishi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    // Simulate processing delay
    setTimeout(() => {
      const botResponse = getChatbotResponse(input, i18n.language);
      const assistantMessage: Message = { role: 'assistant', content: botResponse };
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);

    setInput('');
  };

  const quickReplies = [
    { mr: 'पाणी', hi: 'पानी', en: 'irrigation' },
    { mr: 'खत', hi: 'खाद', en: 'fertilizer' },
    { mr: 'रोग', hi: 'रोग', en: 'disease' },
    { mr: 'हवामान', hi: 'मौसम', en: 'weather' },
    { mr: 'बाजार', hi: 'बाजार', en: 'market' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t('nav.chat')}</h1>
          <p className="text-sm text-muted-foreground">Ask me about irrigation, fertilizers, diseases, weather, or market prices</p>
        </div>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Farm Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t space-y-3">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInput(reply[i18n.language as keyof typeof reply] || reply.en);
                  }}
                >
                  {reply[i18n.language as keyof typeof reply] || reply.en}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder={t('common.typeMessage') || 'Type your message...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
