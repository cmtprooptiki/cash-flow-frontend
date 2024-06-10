// import React, { useEffect, useState } from 'react';
// import moment from 'moment';
// import apiBaseUrl from '../apiConfig';
// import axios from 'axios';
// const EksodaInfoBox = (props)=>
// {
//     const item = props.item; 
//     const date = moment(props.item.estimate_payment_date).format("YYYY/MM/DD");
//     const [ypoxreoseis,setYpoxreoseis] = useState([])

//     useEffect(() => {
//         const fetchData = async () => {
//           try {
//             // Fetching ypoxreoseis data using item.ypoxreoseis_id
//             console.log(item)
//             const ypoxreoseisResponse = await axios.get(`${apiBaseUrl}/ypo/${item.ypoxreoseis_id}`);
//             // const ypoxreoseisData = await ypoxreoseisResponse.json();
//             setYpoxreoseis(ypoxreoseisResponse);
//           } catch (error) {
//             console.error("Error fetching data:", error);
//           }
//         };
    
//         fetchData();
//       }, [item]);
    
//       return (
//         <div>
//           <h1>Eksoda Info Box</h1>
//           {/* <p>Date: {date}</p> */}
//           <p>Provider: {ypoxreoseis.provider}</p>
//           <p>Amount: {item.ammount}</p>
//           <p>Actual Payment Date: {moment(item.actual_payment_date).format("YYYY/MM/DD")}</p>
//           <p>Estimate Payment Date: {date}</p>
//           <p>Status: {item.status}</p>
//         </div>
//       );

// }

// export default EksodaInfoBox;

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import apiBaseUrl from '../apiConfig';

const EksodaInfoBox = (props) => {
  const { item } = props;
  const date = moment(item.estimate_payment_date).format('YYYY/MM/DD');
  const [ypoxreoseis, setYpoxreoseis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching ypoxreoseis data using item.ypoxreoseis_id
        console.log(item.ammount)
        const ypoxreoseisResponse = await axios.get(`${apiBaseUrl}/ypo/${item.ypoxreoseis_id}`);
        setYpoxreoseis(ypoxreoseisResponse.data);
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [item]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!ypoxreoseis) {
    return <div>Loading...</div>;
  }

  return (
    <div className='box'>
      <center style={{fontSize:"30px",fontWeight:"bold"}}>Eksoda Info Box</center>
      <strong>Provider: </strong> {ypoxreoseis.provider}<br/>
      <strong>Amount: </strong> {item.ammount}€<br/>
      <strong>Actual Payment Date: </strong>{moment(item.actual_payment_date).format('YYYY/MM/DD')}<br/>
      <strong>Estimate Payment Date: </strong> {date}<br/>
      <strong>Status: </strong> {item.status}<br/>
    </div>
  );
}

export default EksodaInfoBox;