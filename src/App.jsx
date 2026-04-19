import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApplicationProvider } from './context/ApplicationContext';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Applications from './pages/Applications/Applications';
import AddApplication from './pages/AddApplication/AddApplication';
import EditApplication from './pages/EditApplication/EditApplication';
import Analytics from './pages/Analytics/Analytics';
import Bookmarks from './pages/Bookmarks/Bookmarks';

export default function App() {
  return (
    <ApplicationProvider>
      <BrowserRouter>
        <div className="layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/applications/new" element={<AddApplication />} />
              <Route path="/applications/:id" element={<EditApplication />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </main>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          theme="dark"
          style={{ fontSize: 13 }}
        />
      </BrowserRouter>
    </ApplicationProvider>
  );
}
