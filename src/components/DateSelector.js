import React, { useState } from 'react'; 
import axios from 'axios'; // Importing axios for making HTTP requests
import './DateSelector.css'; 
const DateSelector = () => {

  const [selectedDate, setSelectedDate] = useState(""); 
  const [data, setData] = useState(null); //raw data from server
  const [Monthlydata, setMonthlydata] = useState(null); //for storing monthly data
  const [Roomdata, setRoomdata] = useState(null); // for storing room-specific data

  //fetching data from server based on selected date
  const GetDataByDate = async (date) => {
    try {
      setSelectedDate(date); 
      const response = await axios.get(`http://localhost:8000/data/${date}`); 
      handleResponseData(response); 
    } catch (error) {
      console.error('Error fetching data:', error); 
    }
  }

  // handels response data from server
  function handleResponseData(response) {
    if (response.data && response.data.length >= 2) { 
      const monthlyData = response.data[0]; // Extract monthly data
      const roomData = response.data[1]; // Extract room-specific data
      
      setData(response.data); //(for potential future use)
      setMonthlydata(monthlyData); 
      setRoomdata(roomData); 
    } else {
      console.error('Unexpected response format from server'); 
    }
  }
  
  return (
    <div className="container">
      <div className="date-picker">
        <label htmlFor="#date">Select a Date:</label>
        <input
          className="date-input"
          type="date"
          id="#date"
          name="date"
          onChange={(date) => {
            GetDataByDate(date.target.value); //will fetch data when date is changes
          }}
        />
      </div>
      {selectedDate && (
        <div className="results">
          <label>Showing results for the date: {selectedDate}</label>
          {typeof data === 'string' ? ( 
            <h1 className="no-data-text">There is no data for the requested date</h1>
          ) : data && typeof data !== 'string' && (
            <>
              <div className="staff-info">
                <h3 className="staff-amount">{`Amount of staff: ${Monthlydata.staffPerSelectedDay}`}</h3> {}
                <br />
                <br />
                <h3 className="staff-avg">{`Avg Amount of staff: ${Math.round(Monthlydata.averageStaffPerDay)}`}</h3> {}
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Room ID</th>
                      <th>Daily Usage Percentage</th>
                      <th>Average Monthly Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Roomdata && 
                      Object.keys(Roomdata).map((room) => ( 
                        <tr key={room}>
                          <td className='room_id'>{room}</td> {}
                          <td>{Roomdata[room].dailyUtilization.toFixed(2)}%</td> {}
                          <td>{Roomdata[room].monthlyAvgUtilization.toFixed(2)}%</td> {}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DateSelector;
