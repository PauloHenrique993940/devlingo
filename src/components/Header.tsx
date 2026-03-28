import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { IoDiamond, IoHeart } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const navigate = useNavigate();
  const { signOut, userProfile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: '/signin', replace: true });
  };

  return (
    <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-30">
      {/* Top Bar */}
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3 md:px-6">
        {/* Idioma */}
        <div className="flex h-10 w-12 items-center justify-center rounded-xl border-b-4 border-yellow-600 bg-yellow-400">
          <span className="text-sm font-black text-yellow-900">JS</span>
        </div>

        {/* Status e Ações */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Gemas */}
          <div className="flex items-center gap-2 group cursor-help" title="Seu XP Total">
            <IoDiamond className="h-6 w-6 text-cyan-400 drop-shadow-sm transition-transform group-hover:scale-110" />
            <span className="text-base font-black text-cyan-500">{userProfile?.total_xp ?? 0}</span>
          </div>

          {/* Vidas */}
          <div className="flex items-center gap-2 group" title="Vidas Infinitas">
            <IoHeart className="h-6 w-6 text-red-500 drop-shadow-sm transition-transform group-hover:scale-110" />
            <span className="text-base font-black text-red-500">∞</span>
          </div>

          {/* Sair */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 active:scale-95 cursor-pointer"
          >
            <span className="hidden text-sm font-bold sm:inline">SAIR</span>
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Unit Banner - Container */}
      <div className="mx-auto max-w-5xl px-4 md:px-6 py-4">
        <div className="rounded-2xl border-b-4 border-violet-800 bg-violet-600 p-6 md:p-8 shadow-lg shadow-violet-200">
          <p className="text-xs font-black uppercase tracking-wider text-violet-200 md:text-sm">Módulo 1</p>
          <h1 className="mt-1 text-2xl font-black text-white md:mt-2 md:text-3xl">Fundamentos de JavaScript</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
