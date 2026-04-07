import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';
import MoneyArchiveDashboard from './MoneyArchiveDashboard';

function App() {
  return (
    <TDSMobileAITProvider>
      <MoneyArchiveDashboard />
    </TDSMobileAITProvider>
  );
}

export default App;
import React from 'react';
import MoneyArchiveDashboard from './MoneyArchiveDashboard';

function App() {
  return (
    <div className="App">
      <MoneyArchiveDashboard />
    </div>
  );
}

export default App;
