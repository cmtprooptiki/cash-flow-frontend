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
  if (!isNaN(date)) {
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
        console.log("The Item: ", item)
        setYpoxreoseis(item.provider);
        console.log(ypoxreoseis);
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
    {console.log("ypoxreoseis structure: ",ypoxreoseis)}
    return <div>Loading...</div>;
    
  }

  return (
    <div className='surface-0 shadow-2 p-3 border-1 border-50 border-round'>
      <h5>Πληροφορίες Εκροής</h5>
      <strong>Προμηθευτής-έξοδο: </strong> {ypoxreoseis}<br/>
      
      <strong>Ποσό: </strong> {formatCurrency(item.ammount)}<br/>
      <strong>Πραγματική ημερομηνία πληρωμής: </strong>{formatDate(item.actual_payment_date)}<br/>
      <strong>Εκτιμώμενη ημερομηνία πληρωμής: </strong> {formatDate(date)}<br/>
      <strong>Κατάσταση: </strong> {item.status}<br/>
    </div>
  );
}

export default EksodaInfoBox;