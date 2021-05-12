import React, {useState} from 'react';
import {StoreContext} from './StoreContext';

const Provider = ({children}) => {
  const [user, setUser] = useState(null);
  const [currentPurchase, setCurrentPurchase] = useState({});

  return (
    <StoreContext.Provider
      value={{user, currentPurchase, setUser, setCurrentPurchase}}>
      {children}
    </StoreContext.Provider>
  );
};

export default Provider;
