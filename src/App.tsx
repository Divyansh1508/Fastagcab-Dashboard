import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Dashboard from "./pages/Dashboard";
import Scheme from "./pages/Scheme";
import Product from "./pages/Product";
import Report from "./pages/Report";
import UserExecutive from "./pages/UserExecutive";
import NewsUpdate from "./pages/NewsUpdate";
import GiftPurchase from "./pages/GiftPurchase";
import CreateAppUser from "./pages/CreateAppUser";
import AddBanner from "./pages/AddBanner";
import GenerateRedeem from "./pages/GenerateRedeem";
import RedeemRequest from "./pages/RedeemRequest";
import Others from "./pages/Others";
import Settings from "./pages/Settings";
import FAQ from "./pages/FAQ";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Set up axios base URL
import axios from "axios";
import { API_CONFIG } from "./config/api";

// Configure axios with the API base URL from environment variables
axios.defaults.baseURL = API_CONFIG.baseURL;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes - Admin only */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/scheme"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <Scheme />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <Product />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <Report />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-executive"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <UserExecutive />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/news-update"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <NewsUpdate />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gift-purchase"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <GiftPurchase />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-app-user"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <CreateAppUser />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-banner"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <AddBanner />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/generate-redeem"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <GenerateRedeem />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/redeem-request"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <RedeemRequest />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/others"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <Others />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <FAQ />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms-conditions"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <TermsConditions />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <PrivacyPolicy />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
