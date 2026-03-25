import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigation';
import store, { persistor } from './src/store';


persistor.subscribe(() => {
  if (persistor.getState().bootstrapped) {
    console.log('PersistGate: rehydration complete', store.getState());
  }
});

export default function App() {
  return (
    <Provider store={store}>
      {/* PersistGate delays rendering until persisted state is rehydrated */}
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
