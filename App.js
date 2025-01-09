import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store, {persistor} from './src/store/store.js'
import { PersistGate } from 'redux-persist/integration/react'; 





const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator/>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;