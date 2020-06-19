import React from 'react';

const DEFAULT_STATE = {
  user: null,
  currentPurchase: {},
};

const StoreContext = React.createContext(DEFAULT_STATE);

export {StoreContext, DEFAULT_STATE};
