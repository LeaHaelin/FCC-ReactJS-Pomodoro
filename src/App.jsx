import { useState, useEffect, useRef } from "react";
import start from "./assets/icons/play.svg";
import pause from "./assets/icons/pause.svg";
import reset from "./assets/icons/reset.svg";
import beep from "./assets/audio/beep.mp3";

import "./App.css";

function App() {
  const [breakTime, setBreakTime] = useState(5 * 60); // to control break time
  const [sessionTime, setSessionTime] = useState(25 * 60); // to control session time
  const [isActive, setIsActive] = useState(false); // to check if the pomodoro is active or paused
  const [modeSec, setModeSec] = useState(sessionTime); //to switch the modes
  const [isSession, setIsSession] = useState(true); // to check if it is session mode or break mode
  const beepSound = useRef(null);

  const activeHandler = () => {
    setIsActive(!isActive);
  };

  //display time number format to be 00:00
  const formatTime = (modeSec) => {
    const min = Math.floor(modeSec / 60);
    const remainSec = Math.floor(modeSec % 60);
    return `${min < 10 ? "0" : ""}${min}:${
      remainSec < 10 ? "0" : ""
    }${remainSec}`;
  };

  //switch sessionTime and breakTime
  useEffect(() => {
    if (isSession) {
      setModeSec(sessionTime);
    } else {
      setIsSession(false);
      setModeSec(breakTime);
    }
  }, [sessionTime, breakTime, isSession]);

  //the beep sound
  useEffect(() => {
    if (modeSec === 0) {
      if (beepSound) {
        beepSound.current.currentTime = 0;
        beepSound.current.play();
      } else {
        beepSound.current.pause();
      }
    }
  }, [modeSec]);

  //timer
  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setModeSec((prevSec) => {
          if (prevSec < 1) {
            clearInterval(interval);
            setIsSession(!isSession); // Toggle between session and break * (prevIsSession) => !prevIsSession
            return isSession ? sessionTime : breakTime;
          } else {
            return prevSec - 1;
          }
        });
      }, 1000);
    } else if (!isActive && modeSec !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, modeSec, isSession, breakTime, sessionTime]);

  const timeControler = (e) => {
    const className = e.target.className;
    if (className.includes("break_minus") && breakTime > 1 * 60) {
      setBreakTime(breakTime - 60);
    } else if (className.includes("break_plus") && breakTime < 60 * 60) {
      setBreakTime(breakTime + 60);
    } else if (className.includes("session_minus") && sessionTime > 1 * 60) {
      setSessionTime(sessionTime - 60);
    } else if (className.includes("session_plus") && sessionTime < 60 * 60) {
      setSessionTime(sessionTime + 60);
    }
  };

  const resetHandler = () => {
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    setModeSec(sessionTime);
    setIsActive(false);
    setIsSession(true);
    if (beepSound.current) {
      beepSound.current.pause();
      beepSound.current.currentTime = 0;
    }
  };

  return (
    <>
      <div className="pomodoro">
        <div className="display">
          <h2 className="display-label" id="timer-label">
            {isSession ? "Session" : "Break"} Time
          </h2>
          <p className="time-screen" id="time-left">
            {formatTime(modeSec)}
          </p>
          <audio id="beep" ref={beepSound} src={beep}></audio>
        </div>
        <div className="buttons">
          <button
            className="play-pause btn"
            id="start_stop"
            onClick={activeHandler}
          >
            <img
              src={isActive ? pause : start}
              alt="icon"
              width="24"
              height="24"
            />
          </button>
          <button className="reset btn" id="reset" onClick={resetHandler}>
            <img src={reset} alt="reset icon" width="24" height="24" />
          </button>
        </div>
        <div className="time-controler">
          <div className="break">
            <h3 className="label" id="break-label">
              Break Length
            </h3>
            <div className="break-set">
              <button
                className="minus break_minus"
                id="break-decrement"
                onClick={timeControler}
              >
                ﹣
              </button>
              <p className="minutes" id="break-length">
                {breakTime / 60}
              </p>
              <button
                className="plus break_plus"
                id="break-increment"
                onClick={timeControler}
              >
                +
              </button>
            </div>
          </div>
          <div className="session">
            <h3 className="label" id="session-label">
              Session Length
            </h3>
            <div className="session-set">
              <button
                className="minus session_minus"
                id="session-decrement"
                onClick={timeControler}
              >
                ﹣
              </button>
              <p className="minutes" id="session-length">
                {sessionTime / 60}
              </p>
              <button
                className="plus session_plus"
                id="session-increment"
                onClick={timeControler}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
