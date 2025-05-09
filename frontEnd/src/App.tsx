import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { useAuthStore } from './store/useAuthStore';
// ... other imports

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      {user && (
        <SocketProvider userId={user.id}>
          {/* Your existing app content */}
          <Routes>
            {/* Your existing routes */}
          </Routes>
        </SocketProvider>
      )}
    </Router>
  );
}

export default App; 