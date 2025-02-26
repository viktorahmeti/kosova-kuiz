import { useEffect, useState, useMemo, useRef } from 'react';
import './App.css';

function App() {
  const komunat = useMemo(() => ['Prizreni', 'Dragashi', 'Suhareka', 'Rahoveci', 'Mamusha', 'Shtërpca', 'Ferizaji', 'Hani i Elezit', 'Kaçaniku', 'Vitia', 'Kllokoti', 'Parteshi', 'Gjilani', 'Novobërda', 'Ranillugu', 'Kamenica', 'Prishtina', 'Shtimja', 'Lipjani', 'Graçanica', 'Fushë Kosova', 'Obiliqi', 'Drenasi', 'Skënderaji', 'Vushtrria', 'Mitrovica', 'Zubin Potoku', 'Zveçani', 'Mitrovica e Veriut', 'Podujeva', 'Leposaviqi', 'Istogu', 'Peja', 'Klina', 'Deçani', 'Juniku', 'Gjakova', 'Malisheva'], []);
  const [gameFlow, setGameFlow] = useState(initGameFlow());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const ended = useMemo(() => lives === 0 || currentQuestionIndex === gameFlow.length, [lives, currentQuestionIndex, gameFlow]);
  const cardRef = useRef(null);

  function answerCurrentQuestion(id){
    if (ended)
      return;

    let el = document.getElementById('komunat').querySelectorAll('path')[id];

    if (id === gameFlow[currentQuestionIndex]){
      correctAnswerAnimation();

      setScore(score => score + 1);
      setCurrentQuestionIndex(q => q + 1);
      setLives(3);

      el.classList.add('active');
    }
    else{
      wrongAnswerAnimation();
      setLives(prev => prev - 1);
    }
  }

  function initGame(){
    Array.from(document.getElementById('komunat').querySelectorAll('path')).forEach((k, i) => {
      k.classList.remove('active');
    });
    setLives(3);
    setScore(0);
    setCurrentQuestionIndex(0);
    setGameFlow(initGameFlow());
  }

  function wrongAnswerAnimation(){
    cardRef.current.classList.add('bg-red-500');
    setTimeout(() => {
      cardRef.current.classList.remove('bg-red-500');
    }, 400);
  }

  function correctAnswerAnimation(){
    cardRef.current.classList.add('bg-green-400');
    setTimeout(() => {
      cardRef.current.classList.remove('bg-green-400');
    }, 400);
  }

  function initGameFlow(){
    let indices = [];
    const ignoreIndices = [];

    for (let i = 0; i < komunat.length; i++){
      if (ignoreIndices.includes(i))
        continue;
      indices.push(i);
    }

    for (let round = 0; round < 100; round++){
      let i = Math.floor(Math.random() * indices.length);
      let j = Math.floor(Math.random() * indices.length);

      let temp = indices[i];
      indices[i] = indices[j];
      indices[j] = temp;
    }

    return indices;
  }

  useEffect(() => {
    let komunatContainer = document.getElementById('komunat');

    Array.from(komunatContainer.querySelectorAll('path')).forEach((k, i) => {
      k.onclick = () => answerCurrentQuestion(i);
    });

    return () => {
      Array.from(komunatContainer.querySelectorAll('path')).forEach((k, i) => {
        k.onclick = null;
      });
    }
  });

  return (
      <div ref={cardRef} className='flex items-center justify-center h-full lg:max-h-48 rounded-md text-white relative bg-blue-400 transition-colors'>
        <div className='text-3xl font-light'>{ended? <button onClick={initGame}>Qëlluat {score} nga {gameFlow.length} komuna</button> : komunat[gameFlow[currentQuestionIndex]]}</div>
        {!ended && <div className={`absolute top-2 right-2 font-light text-lg select-none`}>{score}/{gameFlow.length}</div>}
        {!ended && <div className='absolute top-2 left-2 font-light text-2xl tracking-widest select-none'>{Array.from({length: lives}).fill('💛').join('')}</div>}
      </div>
  );
}

export default App;
