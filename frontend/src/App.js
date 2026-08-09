import React from 'react';
import ListingsPage from './pages/ListingsPage';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PropertyDetailPage from './pages/PropertyDetailPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListingsPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

//just shows the ListingsPage component. 