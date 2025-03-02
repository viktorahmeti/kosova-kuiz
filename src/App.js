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
  const [zoomLevel, setZoomLevel] = useState(1);

  function answerCurrentQuestion(id){
    if (ended || gameFlow.slice(0, currentQuestionIndex).includes(id))
      return;

    if (id === gameFlow[currentQuestionIndex]){
      correctAnswerAnimation();

      setScore(score => score + 1);
      setCurrentQuestionIndex(q => q + 1);
      setLives(3);
    }
    else{
      wrongAnswerAnimation();
      setLives(prev => prev - 1);
    }
  }

  useEffect(() => {
    if (currentQuestionIndex > 0){
      let el = document.getElementById('komunat').querySelectorAll('path')[gameFlow[currentQuestionIndex - 1]];
      el.classList.add('active');
    }

    if (currentQuestionIndex === gameFlow.length){
      document.querySelector('svg').classList.add('green');
    }

    if (lives === 0){
      document.getElementById('komunat').querySelectorAll('path')[gameFlow[currentQuestionIndex]].classList.add('red');
      document.querySelector('svg').classList.add('red');
    }
  }, [lives, currentQuestionIndex]);

  function initGame(){
    if (!ended){
      return;
    }

    Array.from(document.getElementById('komunat').querySelectorAll('path')).forEach((k, i) => {
      k.classList.remove('active');
      k.classList.remove('red');
    });
    document.querySelector('svg').classList.remove('red');
    document.querySelector('svg').classList.remove('green');
    setLives(3);
    setScore(0);
    setGameFlow(initGameFlow(gameFlow[currentQuestionIndex]));
    setCurrentQuestionIndex(0);
  }

  function wrongAnswerAnimation(){
    
  }

  function correctAnswerAnimation(){
    
  }

  function initGameFlow(lastIndex){
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

    if (lastIndex !== undefined){
      let i = indices.indexOf(lastIndex);

      let temp = indices[0];
      indices[0] = lastIndex;
      indices[i] = temp;
    }

    return indices;
  }

  function zoomIn(){
    if (zoomLevel < 3){
      setZoomLevel(prev => prev + 1);
    }
  }

  function zoomOut(){
    if (zoomLevel > 1){
      setZoomLevel(prev => prev - 1)
    }
  }

  useEffect(() => {
    document.querySelector('svg').style.scale = zoomLevel;
  }, [zoomLevel]);

  useEffect(() => {
    let komunatContainer = document.getElementById('komunat');

    Array.from(komunatContainer.querySelectorAll('path')).forEach((k, i) => {
      k.onclick = () => answerCurrentQuestion(i);

      k.onmouseenter = k.ontouchstart = () => {
        k.classList.add('hover');
      }

      k.onmouseleave = k.ontouchend = () => {
        k.classList.remove('hover');
      }
    });

    document.getElementById('zoom-in').addEventListener('click', zoomIn)
    document.getElementById('zoom-out').addEventListener('click', zoomOut)

    return () => {
      Array.from(komunatContainer.querySelectorAll('path')).forEach((k, i) => {
        k.onclick = null;
        k.onmouseenter = k.ontouchstart = k.onmouseleave = k.ontouchend = null;
      });

      document.getElementById('zoom-in').removeEventListener('click', zoomIn)
      document.getElementById('zoom-out').removeEventListener('click', zoomOut)
    }
  });

  return (
      <div onClick={initGame} ref={cardRef} className={`select-none flex items-center justify-center min-h-32 min-w-full lg:min-w-[50vw] lg:max-w-[50vw] rounded-md text-white relative bg-blue-400 transition-colors ${ended? 'cursor-pointer' : 'cursor-auto'} ${ended? currentQuestionIndex === gameFlow.length? 'bg-green-400' : 'bg-red-400' : ''}`}>
        <div className='text-3xl font-light'>{ended? `Qëlluat ${score} nga ${gameFlow.length} komuna` : komunat[gameFlow[currentQuestionIndex]]}</div>
        {!ended && <div className={`absolute top-2 right-2 font-light text-lg select-none`}>{score}/{gameFlow.length}</div>}
        {!ended && <div className='absolute top-2 left-2 font-light text-2xl tracking-widest select-none animate-pulse-scale'>{Array.from({length: lives}).fill('💛')}</div>}
      </div>
  );
}

export default App;
