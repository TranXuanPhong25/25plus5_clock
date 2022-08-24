import styles from "./App.module.scss"
import { FaArrowDown, FaArrowUp, FaPlay, FaPause, FaRedo } from 'react-icons/fa'
import { useLayoutEffect, useRef, useState } from "react";
function App() {
  function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }
  const [intended, setIntended] = useState(300)
  const [restart, setReStart] = useState(300)
  const [played, setPlay] = useState(false)
  const [playedTime, setPlayedTime] = useState(intended)
  const [shouldRestart, setShouldStart] = useState(false)
  //config time
  function reset(value) {
    if (value >= 3600) {
      return 3600
    }
    if (value <= 0) {
      return 0
    }
    return value
  }
  function handleClick(isRestart, value) {
    if (isRestart) {
      setReStart(reset(restart + value))
      setPlay(false)
    } else {
      setPlay(false)

      setIntended(reset(intended + value))
      setPlayedTime(reset(intended + value))
    }
  }

  //counter
  const loop = useRef()
  function intend() {
    if (played) {
      const id = setInterval(() => {
        setPlayedTime(playedTime - 1)

      }, 1000);
      loop.current = id
    } else {
      // setShouldStart(true)
      clearInterval(loop.current)
    }
    if (playedTime === 0) {
      // alert("beep")
      setShouldStart(true)
      setPlay(false)
      console.log(intended)
      clearInterval(loop.current)
    }
  }
  const rerun = useRef()
  useLayoutEffect(() => {
    intend()
    if (shouldRestart) {
      const timout = setTimeout(() => {

        setPlayedTime(restart)
        intend()
        setPlay(true)
      }, 1000)
      rerun.current = timout
    }
    return () => {
      clearTimeout(rerun.current)
      clearInterval(loop.current)
    }
  })

  return (
    <div className={styles.App}>
      <h2>Simple but confused alarm</h2>
      <div className={styles.box}>
        <div className={styles.configure}>
          <div>
            <p>restart time</p>
            <div>
              <FaArrowDown onClick={() => handleClick(true, -60)} />
              <p>{Math.floor(restart / 60)}</p>
              <FaArrowUp onClick={() => handleClick(true, 60)} />
            </div>
          </div>
          <div>
            <p>intended time</p>
            <div>
              <FaArrowDown onClick={() => handleClick(false, -60)} />
              <p>{Math.floor(intended / 60)}</p>
              <FaArrowUp onClick={() => handleClick(false, 60)} />
            </div>
          </div>
        </div>
        <div className={styles.alarm}>
          <p>
            {fmtMSS(playedTime)}
          </p>
          <div className={styles.control}>
            {played ? <FaPause onClick={() => setPlay(!played)} /> : <FaPlay onClick={() => setPlay(!played)} />}
            <FaRedo onClick={() => {
              setPlay(false)
              setPlayedTime(intended)
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
