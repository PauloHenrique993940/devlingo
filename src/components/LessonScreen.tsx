import { useMemo, useState } from 'react';
import { X, Heart } from 'lucide-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import type { Lesson, LessonQuestion } from './LessonsModal';
import { SuccessPopUp } from './SuccessPopUp';
import { ErrorPopUp } from './ErrorPopUp';
import { completeLesson } from '../services/lessonsService';
import { useAuth } from '../contexts/AuthContext';

export const LessonScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const lesson = useRouterState({
    select: (state) => (state.location.state as { lesson?: Lesson } | undefined)?.lesson,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [hearts, setHearts] = useState(3);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const questions: LessonQuestion[] = lesson?.questions ?? [];
  const question = questions[currentIndex];

  const progress = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round(((currentIndex + 1) / questions.length) * 100);
  }, [currentIndex, questions.length]);

  const handleSkip = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
      return;
    }

    navigate({ to: '/home', replace: true });
  };

  const handleVerify = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === question.correctAnswer;
    setFeedback(isCorrect ? 'success' : 'error');

    // Atualiza contadores
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
      const newHearts = hearts - 1;
      setHearts(newHearts);

      // Se chegou a 0, redireciona para resultado após mostrar o popup
      if (newHearts === 0) {
        setTimeout(() => {
          navigate({
            to: '/result',
            search: {
              correctAnswers: correctAnswers,
              incorrectAnswers: incorrectAnswers + 1,
              lessonId: lesson?.id.toString() ?? '',
            },
            replace: true,
          });
        }, 2000);
      }
    }
  };

  const handleContinue = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
      return;
    }

    // Última questão respondida
    const finalCorrectAnswers = correctAnswers + (feedback === 'success' ? 1 : 0);
    const finalIncorrectAnswers = incorrectAnswers;

    // Se todas as respostas foram corretas, vai para tela de sucesso
    if (finalIncorrectAnswers === 0 && user?.id && lesson?.id) {
      // Salva lição como completada no banco
      await completeLesson({
        userId: user.id,
        lessonId: lesson.id.toString(),
        xpEarned: lesson.xp ?? 0,
      });

      navigate({
        to: '/success',
        search: {
          totalXp: lesson?.xp ?? 0,
        },
        replace: true,
      });
    } else {
      // Se teve erros, vai para tela de resultado
      navigate({
        to: '/result',
        search: {
          correctAnswers: finalCorrectAnswers,
          incorrectAnswers: finalIncorrectAnswers,
          lessonId: lesson?.id.toString() ?? '',
        },
        replace: true,
      });
    }
  };

  if (!lesson || questions.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Lição indisponível</h1>
          <p className="mt-2 text-gray-500">Volte para a tela inicial e selecione uma lição.</p>
          <button
            onClick={() => navigate({ to: '/home', replace: true })}
            className="mt-6 rounded-xl bg-green-500 px-6 py-3 text-sm font-bold uppercase text-white"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <header className="flex items-center gap-3 p-4 md:gap-4 md:p-6">
          <button
            onClick={() => navigate({ to: '/home', replace: true })}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Fechar"
          >
            <X className="h-6 w-6 cursor-pointer" />
          </button>

          <div className="h-3 flex-1 rounded-full bg-gray-200 md:h-4">
            <div
              className="h-3 rounded-full bg-green-500 transition-all duration-300 md:h-4"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`h-5 w-5 md:h-6 md:w-6 ${
                  i < hearts ? 'fill-red-500 text-red-500' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </header>

        <main className="flex-1 px-6 py-4 md:py-6">
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">{question.title}</h1>

          <div className="mt-6 space-y-3 md:mt-8 md:space-y-4">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              return (
                <button
                  key={option}
                  onClick={() => setSelectedOption(index)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'border-blue-400 bg-blue-50 shadow-[0_4px_0_0_rgb(96,165,250)] translate-y-[-2px]'
                      : 'border-gray-200 bg-white hover:bg-gray-50 shadow-[0_4px_0_0_rgb(229,231,235)]'
                  }`}
                >
                  <span className={`text-sm font-black md:text-base ${isSelected ? 'text-blue-600' : 'text-slate-700'}`}>
                    {option}
                  </span>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 text-xs font-black transition-colors ${
                    isSelected 
                      ? 'border-blue-400 bg-blue-100 text-blue-600' 
                      : 'border-gray-200 text-slate-400'
                  }`}>
                    {index + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </main>

        <footer className="mt-auto border-t-2 border-gray-100 p-4 md:p-6 lg:px-0">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
            <button
              onClick={handleSkip}
              className="btn-secondary-3d flex-1 md:flex-none md:px-12"
            >
              Pular
            </button>
            <button
              onClick={handleVerify}
              disabled={selectedOption === null}
              className={`${
                selectedOption === null ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' : 'btn-success-3d'
              } flex-[2] md:flex-none md:px-16`}
            >
              Verificar
            </button>
          </div>
        </footer>
      </div>

      {feedback === 'success' && <SuccessPopUp onContinue={handleContinue} />}
      {feedback === 'error' && <ErrorPopUp onContinue={handleContinue} />}
    </div>
  );
};

export default LessonScreen;