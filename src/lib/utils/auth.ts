/**
 * Auth utility functions
 */

export const updateUserData = (userData: any) => {
  try {
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Dispatch custom event to notify other components
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('userDataUpdated', {
        detail: userData
      });
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error updating user data:', error);
  }
};

