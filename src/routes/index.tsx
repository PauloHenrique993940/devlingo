import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const handleLoadingFinish = () => {
    // Redireciona imediatamente após o fade-out do LoadingScreen
    if (isAuthenticated) {
      navigate({ to: '/home', replace: true });
    } else {
      navigate({ to: '/signin', replace: true });
    }
  };

  // O LoadingScreen gerencia seu próprio timing (min 2s) e espera isReady ser true
  return (
    <div className="min-h-screen bg-[#8a2be2]">
      <LoadingScreen isReady={!loading} onFinish={handleLoadingFinish} />
    </div>
  );
}
