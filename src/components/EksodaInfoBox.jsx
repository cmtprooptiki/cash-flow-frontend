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

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (value) => {
  if (value===null || value===""){
      return ""
  } 
  let date = new Date(value);
  // console.log("invalid date is: ",date)
  if (!isNaN(date)) {
      // console.log("show date ",date.toLocaleDateString('en-US', {
      //     day: '2-digit',
      //     month: '2-digit',
      //     year: 'numeric'
      // }))
      return date.toLocaleDateString('en-UK', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });
  } else {
      
      return "Invalid date";
  }
};

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
    <div className='surface-0 shadow-2 p-3 border-1 border-50 border-round'>
      <h5>Πληροφορίες Εκροής</h5>
      <strong>Προμηθευτής-έξοδο: </strong> {ypoxreoseis.provider}<br/>
      <strong>Ποσό: </strong> {formatCurrency(item.ammount)}<br/>
      <strong>Πραγματική ημερομηνία πληρωμής: </strong>{formatDate(item.actual_payment_date)}<br/>
      <strong>Εκτιμώμενη ημερομηνία πληρωμής: </strong> {formatDate(date)}<br/>
      <strong>Κατάσταση: </strong> {item.status}<br/>
    </div>
  );
}

export default EksodaInfoBox;