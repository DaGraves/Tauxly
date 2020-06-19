import React, {useCallback, useState} from 'react';
import {StoreContext, DEFAULT_STATE} from './StoreContext';

const Provider = ({children}) => {
  const [state, setState] = useState(DEFAULT_STATE);
  const setUser = useCallback(
    newUser => {
      setState({...state, user: newUser});
    },
    [state],
  );
  const setCurrentPurchase = useCallback(
    newPurchase => setState({...state, currentPurchase: newPurchase}),
    [state],
  );

  return (
    <StoreContext.Provider value={{...state, setUser, setCurrentPurchase}}>
      {children}
    </StoreContext.Provider>
  );
};

export default Provider;
