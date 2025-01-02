import React, { useEffect, useState } from 'react';
import moment from 'moment';
import apiBaseFrontUrl from '../apiFrontConfig';
const InfoBox = (props) => {
  const event = props.event;
  const item = props.item; 
  const date = moment(props.item.estimate_payment_date).format("YYYY/MM/DD");


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

  ///paradotea
  if(event.test==="paradotea")
    {

    return(
      <div className='surface-0 shadow-2 p-3 border-1 border-50 border-round'>
        <h5>Πληροφορίες Εισροής</h5>

       <strong>Τίτλος παραδοτέου: </strong>{props.item.title}<br/>
      
        <strong>Εργο: </strong>{props.item.erga.name}<br/>
        <strong> Ποσό (καθαρή αξία): </strong>{formatCurrency(props.item.ammount)}<br/>
        <strong> Ποσό ΦΠΑ: </strong>{formatCurrency(props.item.ammount_vat)}  <br/>
        <strong>Σύνολο: </strong>{formatCurrency(props.item.ammount_total)} <br/>
        <strong> Ποσοστό σύμβασης: </strong>{props.item.percentage} % <br/>
        <strong> Εκτιμωμενη ημερομηνια πληρωμης: </strong>{formatDate(date)}<br/> 
       
      </div>
    )
  }
  else if(event.test==="ekxorimena")
  {
    const bank_estimated_date = formatDate(props.item.Ekxorimena_Timologium.bank_estimated_date);
    const cust_estimated_date = formatDate(props.item.Ekxorimena_Timologium.cust_estimated_date);
    console.log(props.item, "ekxorimenaaacasfsds")
    return(
      <div className='surface-0 shadow-2 p-3 border-1 border-50 border-round'>
        <h5>Πληροφορίες Εισροής</h5>

        <strong> Κωδικός Τιμολογίου: </strong><a href={`${apiBaseFrontUrl}/timologia/profile/${props.item.paradotea.timologia_id}`}>{props.item.timologia.invoice_number}</a><br/>

        <strong> Όνομα Έργου: </strong>{props.item.paradotea.erga.name}<br/>
        <strong> Εκχώρηση (€): </strong>{formatCurrency(props.item.Ekxorimena_Timologium.bank_ammount)}<br/>
        <strong> Ημερομηνία πληρωμής από τράπεζα (εκτίμηση): </strong>{bank_estimated_date}<br/> 
        <strong> Υπόλοιπο από πελάτη (€): </strong>{formatCurrency(props.item.Ekxorimena_Timologium.customer_ammount)} <br/>
        <strong> Ημερομηνία πληρωμής από πελάτη (εκτίμηση): </strong>{cust_estimated_date}  <br/>
      </div>
    )
  }
  else if(event.test==="ekxorimena_customer")
  {
    const bank_estimated_date = formatDate(props.item.Ekxorimena_Timologium.bank_estimated_date);
    const cust_estimated_date = formatDate(props.item.Ekxorimena_Timologium.cust_estimated_date);
    return(
      <div className='surface-0 shadow-2 p-3 border-1 border-50 border-round'>
      <h5>Πληροφορίες Εισροής</h5>

      <strong> Κωδικός Τιμολογίου: </strong><a href={`${apiBaseFrontUrl}/timologia/profile/${props.item.paradotea.timologia_id}`}>{props.item.timologia.invoice_number}</a><br/>

      <strong> Όνομα Έργου: </strong>{props.item.paradotea.erga.name}<br/>
      <strong> Εκχώρηση (€): </strong>{formatCurrency(props.item.Ekxorimena_Timologium.bank_ammount)}<br/>
      <strong> Ημερομηνία πληρωμής από τράπεζα (εκτίμηση): </strong>{bank_estimated_date}<br/> 
      <strong> Υπόλοιπο από πελάτη (€): </strong>{formatCurrency(props.item.Ekxorimena_Timologium.customer_ammount)} <br/>
      <strong> Ημερομηνία πληρωμής από πελάτη (εκτίμηση): </strong>{cust_estimated_date}  <br/>
    </div>
    )
  }
  else if(event.test==="timologia")
  {
    const invoiceDate = formatDate(props.item.invoice_date);
    const actual_payment_date = formatDate(props.item.actual_payment_date);
    return(
      <div className='surface-0 shadow-2 p-3 border-1 border-50 border-round'>
      <h5>Πληροφορίες Εισροής</h5>

        <strong>Αρ. τιμολογίου: </strong><a href={`${apiBaseFrontUrl}/timologia/profile/${props.item.id}`}>
      {props.item.invoice_number}
    </a><br/>
        <strong> Ημερομηνία έκδοσης τιμολογίου:</strong>{invoiceDate}<br/>
        <strong> Ημερομηνία πληρωμής τιμολογίου /(εκτίμηση):</strong>{actual_payment_date}<br/>
        <strong> Ποσό τιμολογίου  (καθαρή αξία):</strong>{formatCurrency(props.item.ammount_no_tax)}<br/>
        <strong> Ποσό ΦΠΑ: </strong>{formatCurrency(props.item.ammount_tax_incl)}<br/>
        <strong> Πληρωτέο: </strong>{formatCurrency(props.item.ammount_of_income_tax_incl)}<br/>
        <strong> Κατάσταση τιμολογίου: </strong>{props.item.status_paid}<br/>
        <strong> Σχόλια:</strong>{props.item.comments}<br/>


      </div>
    )
  }
  else if(event.test==="daneia"){
    const payment_date=formatDate(props.item.payment_date)

    return(
      <div className='surface-0 shadow-2 p-3 border-1 border-50 border-round'>
        <h5>Πληροφορίες Εισροής</h5>

      
        <strong> Περιγραφή δανείου: </strong>{props.item.name}<br/>
        <strong> Ποσό Δανείου: </strong>{formatCurrency(props.item.ammount)} <br/>
        <strong> Ημερομηνία πληρωμής (εκτίμηση): </strong>{payment_date}<br/> 
      </div>
    )
  }
    
};
  
export default InfoBox;