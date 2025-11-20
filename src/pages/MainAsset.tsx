import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../layouts/Mainlayout';
import Dashboard from '../components/dashboard/Dashboard';
import AssetList from '../components/assetIssue/AssetIssue';
import EmployeeManagement from '../components/employeeMangement/EmployeeMangement';
import AssetDetails from '../components/AssetsDetails/AssetsDetails';
import AssetForm from '../components/assets/Assets';
import QuotationPage from '../components/quotation/QuatationPage';

import Home from '../components/quotation/Home';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/assetsList" element={<AssetList/>} />
          <Route path="/employeeManagement" element={<EmployeeManagement/>} />
          <Route path="/quotation" element={<QuotationPage/>} />
          <Route path ="/home" element={<Home/>} />
          <Route path="/assetsDetails" element={<AssetDetails/>} />
          <Route path="/assetsForm" element={<AssetForm/>} />
        
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;