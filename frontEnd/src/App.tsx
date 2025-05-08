import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuthStore } from './store/useAuthStore';
import NotificationModal from './components/NotificationModal';
import { useNotifications } from './context/NotificationContext';
// ... other imports

// Component to handle notifications
const NotificationHandler = () => {
  const { 
    currentNotification, 
    showNotificationModal, 
    setShowNotificationModal,
    clearCurrentNotification 
  } = useNotifications();

  return (
    <NotificationModal
      isOpen={showNotificationModal}
      notification={currentNotification}
      onClose={clearCurrentNotification}
    />
  );
};

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      {user && (
        <SocketProvider userId={user.id}>
          <NotificationProvider>
            {/* Notification Modal */}
            <NotificationHandler />
            
            {/* Your existing app content */}
            <Routes>
              {/* Your existing routes */}
            </Routes>
          </NotificationProvider>
        </SocketProvider>
      )}
    </Router>
  );
}

export default App; 