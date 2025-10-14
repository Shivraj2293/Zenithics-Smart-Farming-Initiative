import React from 'react';
import Header from './components/Header';
import Founders from './components/Founders';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard'; // Import Dashboard
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <ToastContainer />
      <Header />
      <Founders />
      <Dashboard /> 
      <About />
      <Contact />
      <Footer />
    </>
  );
};

export default App;