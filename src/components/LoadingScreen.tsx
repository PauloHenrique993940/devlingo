import { useEffect, useState } from 'react';
import loaderImage from '../assets/images/devlingo-loader.png';

type LoadingScreenProps = {
  onFinish?: () => void;
  isReady?: boolean;
};

export const LoadingScreen = ({ onFinish, isReady = true }: LoadingScreenProps) => {
  const [isFading, setIsFading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hasMinTimePassed, setHasMinTimePassed] = useState(false);

  useEffect(() => {
    // Garante que a tela de loading apareça por pelo menos 2 segundos
    const timer = window.setTimeout(() => {
      setHasMinTimePassed(true);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Só inicia o desaparecimento quando o tempo mínimo passou E os dados estão prontos
    if (hasMinTimePassed && isReady) {
      setIsFading(true);
      const hideTimer = window.setTimeout(() => {
        setIsVisible(false);
        onFinish?.();
      }, 700); // Mesma duração do transition-opacity duration-700

      return () => window.clearTimeout(hideTimer);
    }
  }, [hasMinTimePassed, isReady, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#9d4edd] to-[#8a2be2] text-white transition-opacity duration-700 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Carregando"
    >
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={loaderImage}
            alt="Devlingo Owl"
            className="w-40 h-40 sm:w-48 sm:h-48 object-contain animate-float drop-shadow-2xl"
          />
        </div>
        
        <h1 className="mt-8 text-4xl sm:text-5xl font-black tracking-tight font-sans drop-shadow-lg animate-pulse">
          Devlingo
        </h1>
        
        <div className="mt-12 flex flex-col items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s] shadow-sm"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s] shadow-sm"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-sm"></div>
          </div>
          <p className="mt-4 text-purple-100 font-medium tracking-wide text-sm uppercase opacity-80">
            Acelerando seu aprendizado...
          </p>
        </div>
      </div>
    </div>
  );
};
