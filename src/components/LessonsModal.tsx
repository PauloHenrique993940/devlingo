import { X, Check } from 'lucide-react';
import devlingoCharImg from '../assets/images/devlingo-char.png';

export type Lesson = {
  id: string | number;
  title: string;
  description: string;
  xp: number;
  completed?: boolean;
  questions?: LessonQuestion[];
};

export type LessonQuestion = {
  id: string | number;
  title: string;
  options: string[];
  correctAnswer: number;
};

export type Unit = {
  id: string | number;
  title: string;
  level: string;
  status: 'locked' | 'available' | 'completed';
  lessons: Lesson[];
};

type LessonsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
  onSelectLesson: (lessonId: Lesson['id']) => void;
};

export const LessonsModal = ({ isOpen, onClose, unit, onSelectLesson }: LessonsModalProps) => {
  if (!isOpen || !unit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-[#7c3aed] shadow-2xl">
        <header className="p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-purple-200 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-6 w-6 cursor-pointer" />
          </button>

          <div className="pr-8">
            <h2 className="text-2xl font-bold text-white">Escolha uma lição</h2>
            <p className="mt-1 text-sm font-medium text-purple-100 opacity-90">{unit.title}</p>
          </div>
        </header>

        <div className="mt-6 flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar">
          <div className="space-y-3 pb-12">
            {unit.lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-2xl p-4 text-left transition-all active:scale-[0.98] ${
                  lesson.completed 
                    ? 'bg-purple-700/50 border-2 border-green-400/50' 
                    : 'bg-purple-700 hover:bg-purple-800 border-2 border-transparent'
                }`}
              >
                <div className="flex-1 pr-4">
                  <p className="text-sm font-bold text-white">{lesson.title}</p>
                  <p className="mt-0.5 text-xs text-purple-100 opacity-80">{lesson.description}</p>
                  <div className="mt-2 inline-flex items-center rounded-full bg-yellow-400/20 px-2 py-0.5 text-[10px] font-bold text-yellow-300">
                    +{lesson.xp} XP
                  </div>
                </div>

                {lesson.completed && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500 shadow-sm">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="pointer-events-none relative h-16 w-full shrink-0">
          <img
            src={devlingoCharImg}
            alt="Devlingo Character"
            className="absolute -bottom-2 -right-2 z-10 w-24 drop-shadow-lg md:w-28"
          />
        </div>
      </div>
    </div>
  );
};

export default LessonsModal;