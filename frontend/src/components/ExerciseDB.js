import React, { useState } from "react";
import axios from "axios";
import "./ExerciseDB.css";

const ExercisePage = () => {
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMuscleChange = (e) => {
    setSelectedMuscle(e.target.value);
  };

  const handleSearch = async () => {
    if (!selectedMuscle) return;

    setLoading(true);
    setError(null);

    const options = {
      method: "GET",
      url: `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(selectedMuscle)}`,
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY || "01d1f11b81msh5671f3cade53b1cp1b67d1jsndb51befa7618",
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setExercises(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch exercises. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <h2>Search For A Perfect Exercise</h2>
      <div className="select-container">
        <select value={selectedMuscle} onChange={handleMuscleChange}>
          <option value="">Select A Muscle Group</option>
          <option value="back">Back</option>
          <option value="cardio">Cardio</option>
          <option value="chest">Chest</option>
          <option value="lower arms">Lower Arms</option>
          <option value="lower legs">Lower Legs</option>
          <option value="neck">Neck</option>
          <option value="shoulders">Shoulders</option>
          <option value="upper arms">Upper Arms</option>
          <option value="upper legs">Upper Legs</option>
          <option value="waist">Waist</option>
        </select>
        <button 
          onClick={handleSearch} 
          className="mx-3"
          disabled={loading || !selectedMuscle}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ color: 'red', margin: '1rem 0' }}>
          {error}
        </div>
      )}

      {currentExercises.length > 0 ? (
        <div className="exercise-container">
          {currentExercises.map((exercise) => (
            <div key={exercise.id} className="exercise-card">
              <h3>{capitalizeFirstLetter(exercise.name)}</h3>
              <div className="gif-container">
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="exercise-gif"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h3>
          {loading 
            ? 'Loading exercises...' 
            : 'Exercises and demonstrations will be displayed here.'}
        </h3>
      )}

      {exercises.length > exercisesPerPage && (
        <div className="pagination">
          {Array.from({
            length: Math.ceil(exercises.length / exercisesPerPage),
          }).map((_, index) => (
            <button 
              key={index} 
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExercisePage;
