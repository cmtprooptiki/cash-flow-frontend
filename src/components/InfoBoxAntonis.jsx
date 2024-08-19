import React, { useEffect, useState } from 'react';
import moment from 'moment';
const InfoBox = (props) => {
    const event = props.event;
    const item = props.item; 
    const date = moment(props.item.estimate_payment_date).format("YYYY/MM/DD");
    ///paradotea
    if(event.test==="paradotea")
      {

    return(
        <div className='box'>
                <center style={{fontSize:"30px",fontWeight:"bold"}}> <strong>Παραδοτέο {props.item.title} details</strong></center>
              
                <strong> ονομα εργου:</strong>{props.item.erga.name}<br/>
                <strong> Συνολικο ποσο:</strong>{props.item.ammount_total} €<br/>
                <strong> Εκτιμωμενη ημερομηνια πληρωμης:</strong>{date}<br/> 
                <strong> Ποσοστο:</strong>{props.item.percentage} <br/>
                <strong> Αρχικο ποσο:</strong>{props.item.ammount} € <br/>
                <strong> Ποσο VAT:</strong>{props.item.ammount_vat} € <br/>
          </div>
    )
  }
  else if(event.test==="ekxorimena")
  {
      const bank_date = moment(props.item.Ekxorimena_Timologium.bank_date).format("YYYY/MM/DD");
      const cust_date = moment(props.item.Ekxorimena_Timologium.cust_date).format("YYYY/MM/DD");
      return(
        <div className='box'>
                <center style={{fontSize:"30px",fontWeight:"bold"}}> <strong> Εκχωρημένο Τιμολογιο details</strong></center>

                <strong> Τίτλος Παραδοτέου:</strong>{props.item.paradotea.title}<br/>

                <strong> Όνομα Έργου:</strong>{props.item.paradotea.erga.name}<br/>
                <strong> Συνολικό Ποσό Τράπεζας:</strong>{props.item.Ekxorimena_Timologium.bank_ammount} €<br/>
                <strong> Ημερομηνία Πληρωμής Τράπεζας:</strong>{bank_date}<br/> 
                <strong> Συνολικό Ποσό Πελάτη:</strong>{props.item.Ekxorimena_Timologium.customer_ammount} €<br/>
                <strong> Ημερομηνία Πληρωμής Πελάτη:</strong>{cust_date}  <br/>
          </div>
    )
  }
  else if(event.test==="ekxorimena_customer")
    {
        const bank_date = moment(props.item.Ekxorimena_Timologium.bank_date).format("YYYY/MM/DD");
        const cust_date = moment(props.item.Ekxorimena_Timologium.cust_date).format("YYYY/MM/DD");
        return(
          <div className='box'>
                  <center style={{fontSize:"30px",fontWeight:"bold"}}> <strong> Εκχωρημένο Τιμολογιο details</strong></center>
  
                  <strong> Τίτλος Παραδοτέου:</strong>{props.item.paradotea.title}<br/>
  
                  <strong> Όνομα Έργου:</strong>{props.item.paradotea.erga.name}<br/>
                  <strong> Συνολικό Ποσό Τράπεζας:</strong>{props.item.Ekxorimena_Timologium.bank_ammount} €<br/>
                  <strong> Ημερομηνία Πληρωμής Τράπεζας:</strong>{bank_date}<br/> 
                  <strong> Συνολικό Ποσό Πελάτη:</strong>{props.item.Ekxorimena_Timologium.customer_ammount} €<br/>
                  <strong> Ημερομηνία Πληρωμής Πελάτη:</strong>{cust_date}  <br/>
            </div>
      )
    }
    else if(event.test==="timologia")
        {
            const invoiceDate = moment(props.item.invoiceDate).format("YYYY/MM/DD");
            const actual_payment_date = moment(props.item.actual_payment_date).format("YYYY/MM/DD");
            return(
              <div className='box'>
                    <center style={{fontSize:"30px",fontWeight:"bold"}}> <strong>Τιμολογιο details</strong></center>
    
                    <strong> Κωδικος Τιμολογιου:</strong>{props.item.invoice_number}<br/>
                    <strong> invoice_date:</strong>{invoiceDate}<br/>
                    <strong> actual_payment_date:</strong>{actual_payment_date}<br/>
                    <strong> ammount:</strong>{props.item.ammount_no_tax}<br/>
                    <strong> tax :</strong>{props.item.ammount_tax_incl}<br/>
                    <strong> ammount with tax:</strong>{props.item.ammount_of_income_tax_incl}<br/>
                    <strong> status paid:</strong>{props.item.status_paid}<br/>
                    <strong> comments:</strong>{props.item.comments}<br/>


                </div>
          )
        }
    
  };
  
  export default InfoBox;