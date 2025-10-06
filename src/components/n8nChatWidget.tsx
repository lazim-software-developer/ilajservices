// import React, { useEffect } from 'react';
// import '@n8n/chat/style.css';
// import { createChat } from '@n8n/chat';

// const ChatWidget: React.FC = () => {
//   useEffect(() => {
//     createChat({
//       webhookUrl: 'https://workflow.lazim.ae/webhook/4f29fb59-a11e-43ab-b07b-82fecd715de6/chat', // Replace with your n8n webhook URL
//       // Optional: Other configs (see below)
//       mode: 'window', // 'window' (default, with toggle button) or 'fullscreen'
//       loadPreviousSession: true,
//       initialMessages: ['Hi! How can I help?'],
//       enableStreaming: true, // For real-time responses (requires workflow setup)
//     });
//   }, []); // Empty dependency array: runs once on mount

//   return <div id="n8n-chat" style={{ width: '100%', height: '100%' }} />;
// };

// export default ChatWidget;

import React, { useEffect, useRef } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

interface ChatWidgetProps {
  webhookUrl: string;
  mode?: 'window' | 'fullscreen';
  initialMessages?: string[];
  enableStreaming?: boolean;
  allowFileUploads?: boolean;
  allowedFilesMimeTypes?: string;
  showWelcomeScreen?: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  webhookUrl,
  mode = 'window',
  initialMessages = ['Hi! Welcome to ILAJ Services. Ask about our pricing!'],
  enableStreaming = false,
  allowFileUploads = false,
  allowedFilesMimeTypes = '',
  showWelcomeScreen = false,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      createChat({
        webhookUrl,
        mode,
        initialMessages,
        enableStreaming,
        allowFileUploads,
        allowedFilesMimeTypes,
        showWelcomeScreen,
        target: '#n8n-chat', // Matches the div ID below
        loadPreviousSession: true,
        defaultLanguage: 'en',
        i18n: {
          en: {
            title: 'Chat with Safa',
            subtitle: 'Make your life easier with Safa. Book Services with Safa now!',
            getStarted: 'Start Chat',
            inputPlaceholder: 'E.g., How much is deep cleaning for a 2 BHK apartment?',
          },
        },
      });
    }

    // Cleanup (optional, if n8n/chat provides a destroy method in the future)
    return () => {
      // Add cleanup logic if needed (e.g., destroyChat if exposed)
    };
  }, [
    webhookUrl,
    mode,
    initialMessages,
    enableStreaming,
    allowFileUploads,
    allowedFilesMimeTypes,
    showWelcomeScreen,
  ]);

  return <div id="n8n-chat" ref={chatContainerRef} style={mode === 'fullscreen' ? { width: '100%', height: '100vh' } : {}} />;
};

export default ChatWidget;