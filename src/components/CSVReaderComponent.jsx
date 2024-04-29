// CSVReaderComponent.js
import React, { useState,useEffect } from 'react';
import CSVReader from 'react-csv-reader';
import axios from 'axios';
import '../custom.css';
import apiBaseUrl from '../apiConfig'; // Update the path accordingly

const CSVReaderComponent = () => {
  const handleFile = (data, fileInfo) => {
    // Send data to Node.js server

    // Show alert before sending data
    // Show confirmation dialog before sending data
    const userConfirmed = window.confirm('Είστε σίγουρος οτι θέλετε να ανεβάσετε τα δεδομένα;');

    if (userConfirmed) {
        console.log(data)
        axios.post(`${apiBaseUrl}/upload-csv`, { data })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }else{
    // User clicked "Cancel," do nothing or handle as needed
    console.log('Ο Χρήστης ακύρωσε την διαδικασία εισαγωγής.');
    }
  };


  return (
    <CSVReader onFileLoaded={handleFile}    cssClass="csv-reader-input" />
    // inputStyle={   background-color: '#00d1b2';border-color: 'transparent';color: '#fff';}
  );
};

export default CSVReaderComponent;
