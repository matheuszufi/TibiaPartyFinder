export const calculateRoomExpiration = (scheduledDate?: Date): Date => {
  if (scheduledDate) {
    // Para salas agendadas, a validade é até a data/hora agendada
    return scheduledDate;
  } else {
    // Para salas imediatas, validade de 1 hora
    const now = new Date();
    return new Date(now.getTime() + 60 * 60 * 1000); // 1 hora
  }
};

export const isRoomExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};

export const formatTimeRemaining = (expiresAt: Date): string => {
  const now = new Date();
  const timeLeft = expiresAt.getTime() - now.getTime();
  
  if (timeLeft <= 0) {
    return 'Expirada';
  }
  
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m restantes`;
  } else {
    return `${minutes}m restantes`;
  }
};

export const isScheduledRoom = (scheduledDate?: Date): boolean => {
  if (!scheduledDate) return false;
  
  const now = new Date();
  return scheduledDate > now;
};
