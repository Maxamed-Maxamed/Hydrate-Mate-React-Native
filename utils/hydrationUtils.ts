import { HydrationEntry } from '@/context/hydrationStore';

/**
 * Format amount based on units
 */
export const formatAmount = (amount: number, units: 'ml' | 'oz' = 'ml'): string => {
  if (units === 'oz') {
    const ozAmount = Math.round(amount * 0.033814);
    return `${ozAmount}oz`;
  }
  return `${amount}ml`;
};

/**
 * Convert oz to ml
 */
export const ozToMl = (oz: number): number => {
  return Math.round(oz * 29.5735);
};

/**
 * Convert ml to oz
 */
export const mlToOz = (ml: number): number => {
  return Math.round(ml * 0.033814);
};

/**
 * Get motivational message based on progress
 */
export const getMotivationalMessage = (progressPercentage: number): { emoji: string; title: string; subtitle: string } => {
  if (progressPercentage >= 100) {
    return {
      emoji: '🎉',
      title: 'Goal Achieved!',
      subtitle: 'Amazing! You\'ve reached your daily hydration goal!'
    };
  } else if (progressPercentage >= 75) {
    return {
      emoji: '🔥',
      title: 'Almost There!',
      subtitle: `Just ${100 - Math.round(progressPercentage)}% more to reach your goal!`
    };
  } else if (progressPercentage >= 50) {
    return {
      emoji: '💪',
      title: 'Great Progress!',
      subtitle: `You're halfway there! Keep up the good work!`
    };
  } else if (progressPercentage >= 25) {
    return {
      emoji: '🌟',
      title: 'Good Start!',
      subtitle: `You're ${Math.round(progressPercentage)}% towards your daily goal`
    };
  } else if (progressPercentage > 0) {
    return {
      emoji: '💧',
      title: 'Getting Started!',
      subtitle: 'Every drop counts. Keep going!'
    };
  } else {
    return {
      emoji: '🚰',
      title: 'Time to Hydrate!',
      subtitle: 'Start your hydration journey today!'
    };
  }
};

/**
 * Get greeting based on time of day
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good Morning! 🌅';
  } else if (hour < 17) {
    return 'Good Afternoon! ☀️';
  } else if (hour < 21) {
    return 'Good Evening! 🌆';
  } else {
    return 'Good Night! 🌙';
  }
};

/**
 * Get emoji for drink type
 */
export const getDrinkEmoji = (type: HydrationEntry['type']): string => {
  switch (type) {
    case 'Water':
      return '💧';
    case 'Tea':
      return '🍵';
    case 'Coffee':
      return '☕';
    case 'Juice':
      return '🧃';
    case 'Sports Drink':
      return '🥤';
    default:
      return '🥛';
  }
};

/**
 * Calculate hydration level description
 */
export const getHydrationLevel = (progressPercentage: number): { level: string; color: string } => {
  if (progressPercentage >= 100) {
    return { level: 'Excellent', color: '#28a745' };
  } else if (progressPercentage >= 75) {
    return { level: 'Good', color: '#007BFF' };
  } else if (progressPercentage >= 50) {
    return { level: 'Fair', color: '#ffc107' };
  } else if (progressPercentage >= 25) {
    return { level: 'Low', color: '#fd7e14' };
  } else {
    return { level: 'Critical', color: '#dc3545' };
  }
};

/**
 * Generate quick add suggestions based on time and current intake
 */
export const getQuickAddSuggestions = (currentIntake: number, dailyGoal: number): number[] => {
  const hour = new Date().getHours();
  
  // Morning suggestions (6-12)
  if (hour >= 6 && hour < 12) {
    return [250, 500, 750];
  }
  // Afternoon suggestions (12-18)
  else if (hour >= 12 && hour < 18) {
    return [200, 400, 600];
  }
  // Evening suggestions (18-22)
  else if (hour >= 18 && hour < 22) {
    return [150, 300, 450];
  }
  // Night suggestions (22-6)
  else {
    return [100, 200, 300];
  }
};

/**
 * Format time for display
 */
export const formatTime = (date: Date | string | undefined | null): string => {
  // Handle null/undefined cases
  if (!date) {
    return 'Invalid time';
  }
  
  let dateObj: Date;
  
  try {
    // Convert string to Date if needed
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      console.warn('formatTime received unexpected type:', typeof date, date);
      return 'Invalid time';
    }
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('formatTime received invalid date:', date);
      return 'Invalid time';
    }
    
    return dateObj.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  } catch (error) {
    console.error('Error in formatTime:', error, 'Input:', date);
    return 'Invalid time';
  }
};

/**
 * Check if it's a new day since last app use
 */
export const isNewDay = (lastUsedDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return lastUsedDate !== today;
};

/**
 * Calculate progress ring stroke dash array for animated progress
 */
export const calculateProgressStroke = (percentage: number, radius: number): { strokeDasharray: string; strokeDashoffset: number } => {
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return {
    strokeDasharray: strokeDasharray.toString(),
    strokeDashoffset,
  };
};
