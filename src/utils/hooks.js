
// inspired by https://github.com/rehooks/network-status
import { useState, useEffect } from 'react';

const useEffectiveConnectionType = () => {
  const navigatorConnection = navigator.connection;
  
  const getEffectiveConnectionType = () => {
    return navigatorConnection ? navigatorConnection.effectiveType : null;
  };

  const [effectiveConnectionType, setEffectiveConnectionType] = useState(getEffectiveConnectionType());

  const updateECTStatus = () => {
    setEffectiveConnectionType(getEffectiveConnectionType());
  };
  
  useEffect(() => {
    navigatorConnection && navigatorConnection.addEventListener('change', updateECTStatus);
    return () => {
      navigatorConnection && navigatorConnection.removeEventListener('change', updateECTStatus);
    };
  // eslint-disable-next-line
  }, []);

  return { effectiveConnectionType, updateECTStatus };
};

export { useEffectiveConnectionType };
