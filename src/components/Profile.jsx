import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css-components/profile.css'

const Profile = () => {
  const token = localStorage.getItem('token');
  const [userStats, setUserStats] = useState({});
  const [lastLog, setLastLog] = useState(null);
  const [lastLoggedExercise, setLastLoggedExercise] = useState(null);
  const [lastLoggedMeal, setLastLoggedMeal] = useState(null);

  const fullName = userStats.fullName;
  const firstName = fullName?.split(' ')[0];
  const heightInInches = userStats.height;
  const height = `${Math.floor(heightInInches/12)}' ${heightInInches%12}"`;
  const weight = userStats.weight;
  const age = userStats.age;
  const gender = userStats.gender;

  let lastExerciseRepsPerSet= '';
  let lastExerciseSetsCompleted = '';
  let lastWeightUsed = '';
  let lastExerciseDurationMinutes = '';
  let lastLogYear = '';
  let lastLogMonth = '';
  let lastLogDay = '';

  if(lastLog) {
    lastExerciseRepsPerSet = lastLog.reps_per_set;
    lastExerciseSetsCompleted = lastLog.sets_completed;
    lastWeightUsed = lastLog.weight_used;
    lastExerciseDurationMinutes = lastLog.duration_minutes;

    const lastLogDate = lastLog.date;
    const dateArr = lastLogDate?.split('-');

    if(dateArr) {
      lastLogYear = dateArr[0];
      lastLogMonth = dateArr[1];
      lastLogDay = dateArr[2].slice(0,2);
    }
  }
  
  useEffect(() => {
    const getStats = async() => {
      const response = await fetch('https://full-strength-academy.onrender.com/api/auth/me', {
        headers: {
          "Authorization": `${token}`
        }
      });
      const retrievedStats = await response.json();
      setUserStats(retrievedStats);
    }
    getStats();
  }, []);

  useEffect(() => {
    const getLastLogInfo = async() => {
      const logResponse = await fetch('https://full-strength-academy.onrender.com/api/auth/me/logs', {
        headers: {
          "Authorization": `${token}`
        }
      });
      const allLogs = await logResponse.json();
      const mostRecentLogRefNum = allLogs.length-1;
      const mostRecentLog = allLogs[mostRecentLogRefNum];
      setLastLog(mostRecentLog);

      const exerciseResponse = await fetch(`https://full-strength-academy.onrender.com/api/exercises/id/${mostRecentLog.exercise_id}`);
      const lastExercise = await exerciseResponse.json();
      setLastLoggedExercise(lastExercise[0].name);

      const mealResponse = await fetch(`https://full-strength-academy.onrender.com/api/meals/id/${mostRecentLog.meal_id}`);
      const lastMeal = await mealResponse.json();
      setLastLoggedMeal(lastMeal[0].name);
    }
    getLastLogInfo();
  }, []);
  
  
  return (
    <div className='container-profile'> {
      token && lastLog ?
        <>
          <h2>Let's crush the day, {firstName}!</h2>
          <div className='profile-and-log-container'>
            <section className='profile-live-details'>
              <h3>{fullName}</h3>
              <p><strong>Height:</strong> {height}</p>
              <p><strong>Weight:</strong> {weight} lbs</p>
              <p><strong>Age:</strong> {age}</p>
              <p><strong>Gender:</strong> {gender}</p>
            </section>
              <hr />
              <br />
            <section className='profile-live-details'>
              <h3>Last Log Entry: {lastLogMonth}/{lastLogDay}/{lastLogYear}</h3>
              <p><strong>Meal:</strong> {lastLoggedMeal}</p>
              <p><strong>Exercise:</strong> {lastLoggedExercise}</p>
              <p><strong>Reps Per Set:</strong> {lastExerciseRepsPerSet}</p>
              <p><strong>Sets:</strong> {lastExerciseSetsCompleted}</p>
              <p><strong>Duration:</strong> {lastExerciseDurationMinutes} minutes</p>
              <p><strong>Weight Used:</strong> {lastWeightUsed}</p>
            </section>
          </div>
          <section className='button-container'>
            <button>
              <Link to='/editprofile'>Edit My Info</Link>
            </button>
            <button>
              <Link className={"link-styles"} to='/logs'>Create a New Log</Link>
            </button>
            <button>
              <Link className={"link-styles"} to='/add-meal'>Add New Recipe</Link>
            </button>
            
          </section>
  
        </> : null }

      { token && !lastLog ? 
        <>
          <header>
            <h2>Let's Get Better Today, {firstName}!</h2>
          </header>
    
          <section className='profile-details'>
            <h3>{fullName}</h3>
            <p>Height: {height}</p>
            <p>Weight: {weight} lbs</p>
            <p>Age: {age}</p>
            <p>Gender: {gender}</p>
            <button>
              <Link className={"link-styles"} to='/editprofile'>Edit My Info</Link>
            </button>
            <button>
              <Link className={"link-styles"} to='/logs'>Create Your First Log</Link>
            </button>
            <button>
              <Link className={"link-styles"} to='/add-meal'>Share a New Recipe with the Community</Link>
            </button>
          </section>
        </> : null }

      { !token ? <><section><h2>Please <Link to='/login'>login</Link> to view this page</h2></section></> : null } 
    </div> 
  ) 
}


export default Profile