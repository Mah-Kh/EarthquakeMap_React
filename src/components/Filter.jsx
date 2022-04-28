import { useEffect, useState, useRef, useContext } from "react";
import { DataContext } from "../context/DataContext";

const Filter = () => {
  const { defaultData, handleSelectedData, resetForm } =
    useContext(DataContext);

  // useRef to get value of form inputs to update selected data
  const startTimeRef = useRef();
  const endTimeRef = useRef();
  const minMagRef = useRef();
  const maxMagRef = useRef();
  const placeRef = useRef();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [minMag, setMinMag] = useState(0);
  const [maxMag, setMaxMag] = useState(0);

  // initialize default data to use as default values in form inputs
  useEffect(() => {
    if (defaultData) {
      setStartTime(defaultData.startTime);
      setEndTime(defaultData.endTime);
      setMinMag(defaultData.minMag);
      setMaxMag(defaultData.maxMag);
    }
  }, [defaultData]);

  const submitForm = () => {
    let selected = {
      startTime: startTimeRef.current.value,
      endTime: endTimeRef.current.value,
      minMag: minMagRef.current.value,
      maxMag: maxMagRef.current.value,
      place: placeRef.current.value,
    };
    // pass selected data from form to DataContext
    handleSelectedData(selected);
  };

  const reset = () => {
    setStartTime(defaultData.startTime);
    setEndTime(defaultData.endTime);
    setMinMag(defaultData.minMag);
    setMaxMag(defaultData.maxMag);
    placeRef.current.value = "All";
    resetForm();
  };

  return (
    <div className="form-container">
      <h4>Filter Earthquakes:</h4>
      {defaultData && (
        <form>
          <div className="time">
            <div>
              <label htmlFor="start-time">Start time</label>
              <input
                ref={startTimeRef}
                type="datetime-local"
                id="start-time"
                name="start-time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="end-time">End time</label>
              <input
                ref={endTimeRef}
                type="datetime-local"
                id="end-time"
                name="end-time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="mag">
            <div>
              <label htmlFor="min-mag">Min. Magnitude</label>
              <input
                ref={minMagRef}
                type="number"
                id="min-mag"
                name="min-mag"
                min={defaultData.minMag}
                max={defaultData.maxMag}
                value={minMag}
                onChange={(e) => {
                  setMinMag(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="max-mag">Max. Magnitude</label>
              <input
                ref={maxMagRef}
                type="number"
                id="max-mag"
                name="max-mag"
                min={defaultData.minMag}
                max={defaultData.maxMag}
                value={maxMag}
                onChange={(e) => {
                  setMaxMag(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="place">
            <div>
              <label htmlFor="selectedPlace">Place</label>
              <select ref={placeRef} id="selectedPlace">
                <option>All</option>
                {defaultData.countries.map((country, index) => {
                  return (
                    <option value={country} key={index}>
                      {country}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="btn-container">
            <input
              type="button"
              name="submit"
              id="submit"
              value="Submit"
              className="btn btn-primary"
              onClick={() => submitForm()}
            />
            <input
              type="button"
              name="reset"
              id="reset"
              value="Reset"
              className="btn btn-warning"
              onClick={() => reset()}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Filter;
