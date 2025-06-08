import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import MyResumes from "./components/MyResumes";
import MyTemplates from "./components/MyTemplates";
import Templates from "./components/Templates";
import Landing from "./components/Landing";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UserVerify from "./components/UserVerify";
import { PageNotFound } from "./components/Boilerplate";
import ResumeCreation from "./components/ResumeCreation";
import AssetSelect from "./components/AssetSelect";
import { ToastContainer, toast } from "react-toastify";
import Assets from "./components/Assets";
import Services from "./components/Services";
import Subscriptions from "./components/Subscriptions";
import TemplateSelect from "./components/TemplateSelect";
import AboutUs from "./components/AboutUs";
import MyAssets from "./components/MyAssets";
import DeleteAccount from "./components/Delete";
import CPassword from "./components/CPassword";
import CEmail from "./components/CEmail";
import { AuthProvider } from "./components/AuthContext";
import Protected from "./components/Protected";
function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Landing />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/userverify" element={<UserVerify />} />
            <Route element={<Protected />}>
              <Route path="/templates" element={<Templates />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/myresumes" element={<MyResumes />} />
              <Route path="/mytemplates" element={<MyTemplates />} />
              <Route path="/myassets" element={<MyAssets />} />
              <Route path="/creation" element={<ResumeCreation />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/services" element={<Services />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/astselect" element={<AssetSelect />} />
              <Route path="/tempselect" element={<TemplateSelect />} />
              <Route path="/delete" element={<DeleteAccount />} />
              <Route path="/cpass" element={<CPassword />} />
              <Route path="/cemail" element={<CEmail />} />
            </Route>
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={1000}
            hideProgressBar={true}
            closeOnClick={true}
          />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
export default App;
