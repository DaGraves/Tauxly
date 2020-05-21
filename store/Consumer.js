import React from 'react';
import {StoreContext} from './StoreContext';

const Consumer = ({children}) => {
  return <StoreContext.Consumer>{() => children}</StoreContext.Consumer>;
};

export default Consumer;
