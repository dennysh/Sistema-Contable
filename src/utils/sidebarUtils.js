// Utility function to update sidebar counts
export const updateSidebarCounts = () => {
  if (window.updateSidebarCounts) {
    window.updateSidebarCounts();
  }
};

// Helper function to wrap success handlers
export const withSidebarUpdate = (originalHandler) => {
  return (...args) => {
    const result = originalHandler(...args);
    updateSidebarCounts();
    return result;
  };
};
