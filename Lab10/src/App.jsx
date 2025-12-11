import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import boy from './assets/boy.png'
import adult from './assets/adult.png'
import './App.css'
import LikeButton from './likeButton.jsx'

function App() {
  // useState crea una variable de estado (count) y una función para actualizarla (setCount)
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>
          Has hecho clic {count} veces
        </button>
        <LikeButton />
        <p>
          Edita <code>src/App.jsx</code> y guarda para probar HMR
        </p>
      </div>
      <p className="read-the-docs">
        Haz clic en los logos de Vite y React para aprender más
      </p>
      <div>
        <img src={boy} alt="Boy" />
        <img src={adult} alt="Adult" />
      </div>
    </>
  )
}

export default App