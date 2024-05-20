import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import moment from 'moment';
const InfoBox = (props) => {
    const item = props.item; 
    const date = moment(props.item.estimate_payment_date).format("YYYY/MM/DD");
    //const dateString = date.toLocaleDateString();

    return(
        <div className='box'>
                <center style={{fontSize:"30px",fontWeight:"bold"}}> <strong> {props.item.title} details</strong></center>
              
                <strong> ονομα εργου:</strong>{props.item.erga.name}<br/>
                <strong> Συνολικο ποσο:</strong>{props.item.ammount_total} €<br/>
                <strong> Εκτιμωμενη ημερομηνια πληρωμης:</strong>{date}<br/> 
                <strong> Ποσοστο:</strong>{props.item.percentage} <br/>
                <strong> Αρχικο ποσο:</strong>{props.item.ammount} € <br/>
                <strong> Ποσο VAT:</strong>{props.item.ammount_vat} € <br/>
          </div>
    )
    
  };
  
  export default InfoBox;