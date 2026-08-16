import React from 'react';
import ListingsPage from './pages/ListingsPage';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="App">
      {/* wraps everything so errors get caught */}
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ListingsPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;

//just shows the ListingsPage component.