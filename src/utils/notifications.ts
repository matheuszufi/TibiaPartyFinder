// Utility para notificações simples de sala completa
export const notifyRoomComplete = (roomTitle: string) => {
  // Console log para debug
  console.log(`🎉 Party Completa: ${roomTitle}`);
  
  // Notificação visual com alert (simples e confiável)
  setTimeout(() => {
    alert(`🎉 Party Completa!\n\nA party "${roomTitle}" está completa e pronta para iniciar!\n\nTodos os membros foram notificados.`);
  }, 500);

  // Notificação do browser
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification('Party Completa! 🎉', {
        body: `A party "${roomTitle}" está completa e pronta para iniciar!`,
        icon: '/favicon.ico',
        tag: 'room-complete'
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Party Completa! 🎉', {
            body: `A party "${roomTitle}" está completa e pronta para iniciar!`,
            icon: '/favicon.ico',
            tag: 'room-complete'
          });
        }
      });
    }
  }

  // Som de notificação usando Web Audio API
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playSuccessSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configurar o som
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Envelope do som
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };
    
    playSuccessSound();
    
  } catch (error) {
    console.log('Som não disponível:', error);
  }
};
