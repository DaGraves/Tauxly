import React, {useState} from 'react';
import {StoreContext, DEFAULT_STATE} from './StoreContext';

const Provider = ({children}) => {
  const [state, setState] = useState(DEFAULT_STATE);
  const setUser = newUser => setState({...state, user: newUser});

  return (
    <StoreContext.Provider value={{...state, setUser}}>
      {children}
    </StoreContext.Provider>
  );
};

export default Provider;
