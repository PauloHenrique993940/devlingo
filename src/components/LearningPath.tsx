import grayStarImg from '../assets/images/gray-star.png';
import greenStarImg from '../assets/images/green-star.png';
import devlingoCharImg from '../assets/images/devlingo-char.png';
import type { Unit } from './LessonsModal';

type LearningPathProps = {
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
};

const getOffsetPixels = (index: number): number => {
  const offsets = [0, -40, -60, -40, -20];
  return offsets[index % offsets.length];
};

const getStarImage = (status: Unit['status']): string => {
  if (status === 'completed') {
    return greenStarImg;
  }
  return grayStarImg;
};

export const LearningPath = ({ units, onSelectUnit }: LearningPathProps) => {
  return (
    <div className="flex flex-col items-center gap-6 py-12 px-4 overflow-x-hidden max-w-lg mx-auto">
      {units.map((unit, index) => {
        const offset = getOffsetPixels(index);
        const isLocked = unit.status === 'locked';
        const isCompleted = unit.status === 'completed';

        return (
          <div
            key={unit.id}
            className="relative flex flex-col items-center"
            style={{ 
              transform: `translateX(${offset}px)`,
            }}
          >
            {/* Botão da Estrela */}
            <button
              disabled={isLocked}
              onClick={() => onSelectUnit(unit)}
              className={`group relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center transition-all active:scale-95 disabled:grayscale disabled:opacity-50 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Efeito de Sombra/Profundidade da Estrela */}
              <div className={`absolute bottom-0 h-16 w-16 md:h-20 md:w-20 rounded-full blur-md opacity-20 ${isCompleted ? 'bg-green-600' : 'bg-gray-400'}`} />
              
              <img
                src={getStarImage(unit.status)}
                alt={`Unit ${unit.id}`}
                className="relative z-10 h-full w-full object-contain drop-shadow-md transition-transform group-hover:scale-110"
              />
              
              {/* Tooltip de XP ou Status */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 rounded-lg bg-slate-800 px-3 py-1 text-[10px] font-bold text-white transition-all group-hover:scale-100 whitespace-nowrap z-20">
                {isLocked ? 'BLOQUEADO' : isCompleted ? 'CONCLUÍDO' : 'PRÓXIMO'}
              </div>
            </button>

            {/* Personagem flutuando ao lado */}
            {index === 2 && (
              <div className="absolute -right-20 md:-right-28 top-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Balão de Fala (Opcional) */}
                  <div className="absolute -top-12 -left-4 rounded-xl bg-white p-2 text-[10px] font-bold shadow-md whitespace-nowrap border-2 border-gray-100 animate-bounce">
                    Vamos lá! 🚀
                  </div>
                  <img
                    src={devlingoCharImg}
                    alt="Devlingo Character"
                    className="h-16 w-16 md:h-20 md:w-20 drop-shadow-xl"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
