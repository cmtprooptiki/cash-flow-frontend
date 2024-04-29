import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';



    
export const getColorClass2 = (value, metricname) => {
    // Define color cases based on metricname
    switch (metricname) {
      case 'PM10':
        return{
          label: value < 50 ?'Χαμηλή': 'Υψηλή',
          className: value < 50 ? 'green-text' : 'red-text' 
      };
      case 'PM2.5':
        return{
          label: value < 20 ?'Χαμηλή': 'Υψηλή',
          className: value < 20 ? 'green-text' : 'red-text' 
      };
      case 'SO2':
        return{
          label: value < 125 ?'Χαμηλή': 'Υψηλή',
          className: value < 50 ? 'green-text' : 'red-text' 
      };
      case 'CO':
        return{
          label: value < 10 ?'Χαμηλή': 'Υψηλή',
          className: value < 10 ? 'green-text' : 'red-text' 
      };
      case 'NO2':
        return{
          label: value < 40 ?'Χαμηλή': 'Υψηλή',
          className: value < 40 ? 'green-text' : 'red-text' 
      };
  
      case 'TSP':
        return {
          label:value < 50 ? 'Χαμηλή' : value >= 50 && value <= 80 ? 'Μέτρια' : 'Υψηλή',
          className: value < 50 ? 'green-text' : value >= 50 && value <= 80 ? 'yellow-text' : 'red-text'
      };
      case 'TEQ PCDD/Fs':
        return {
          label:value < 42 ? 'Χαμηλή' : value >= 42 && value <= 150 ? 'Μέτρια' : 'Υψηλή',
          className: value < 42 ? 'green-text' : value >= 42 && value <= 150 ? 'yellow-text' : 'red-text'
      };
      case 'TEQ PCBS':
        return {
          label:value < 10 ? 'Χαμηλή' : value >= 10 && value <= 40 ? 'Μέτρια' : 'Υψηλή',
          className: value < 10 ? 'green-text' : value >= 10 && value <= 40 ? 'yellow-text' : 'red-text'
      };
      case 'ind PCBs':
        return {
          label:value < 60 ? 'Χαμηλή' : value >= 60 && value <= 180 ? 'Μέτρια' : 'Υψηλή',
          className: value < 60 ? 'green-text' : value >= 60 && value <= 180 ? 'yellow-text' : 'red-text'
      };
      case 'NO':
        return {
          label:value < 10 ? 'Χαμηλή' : value >= 10 && value <= 50 ? 'Μέτρια' : 'Υψηλή',
          className: value < 10 ? 'green-text' : value >= 10 && value <= 50 ? 'yellow-text' : 'red-text'
      };
      case 'OC/EC':
        return {
          label:value < 50 ? 'Χαμηλή' : value >= 50 && value <= 80 ? 'Μέτρια' : 'Υψηλή',
          className: value < 50 ? 'green-text' : value >= 50 && value <= 80 ? 'yellow-text' : 'red-text'
      };
      // Add more cases as needed
      default:
        return { label: 'Άγνωστο', className: 'black-text' }; // Default label and class name
    }
  };


export  const getLimitAnnotation =(metricname)=>{
    switch (metricname) {
      case 'PM10':
        return{
          max: 50 
          
      };
      case 'PM2.5':
        return{
          max:20
      };
      case 'SO2':
        return{
          max: 125
      };
      case 'CO':
        return{
          max:10
      };
      case 'NO2':
        return{
          max:40 
      };
      case 'TSP':
        return {
          min:50,
          
          max:80 
      };
      case 'TEQ PCDD/Fs':
        return {
          min:42,
          max:150 
      };
      case 'TEQ PCBS':
        return {
          min:10,
          max:40 
      };
      case 'ind PCBs':
        return {
          min:60,
          max:180 
      };
      case 'NO':
        return {
          min:10,
          max:50 
      };
      case 'OC/EC':
        return {
          min:5/0.5,
          max:20/2 
      };
      // Add more cases as needed
      default:
        return { max:0}; // Default label and class name
    }
  };

export const circleColorArray= (metricname)=>{
  
  switch (metricname) {
    case 'PM10':
      return{
        colorArray:[[0, 'rgba(0,255,0,0)'],
        [10, 'rgb(0,255,0)'],
        [20, 'rgb(0,255,0)'],
        [30, 'rgb(0,255,0)'],
        [40, 'rgb(0,255,0)'],
        [49, 'rgb(255,0,0)'],
        [50, 'rgb(255,0,0)']
      ] 
        
    };
    case 'PM2.5':
      return{
        colorArray:[[0, 'rgba(0,255,0,0)'],
        [1, 'rgb(0,255,0)'],
        [19, 'rgb(0,255,0)'],
        [20, 'rgb(255,0,0)']
      ] 
        
    };
    case 'SO2':
      return{
        colorArray:[[0, 'rgba(0,255,0,0)'],
        [10, 'rgb(0,255,0)'],
        [20, 'rgb(0,255,0)'],
        [30, 'rgb(0,255,0)'],
        [40, 'rgb(0,255,0)'],
        [50, 'rgb(0,255,0)'],
        [60, 'rgb(0,255,0)'],
        [70, 'rgb(0,255,0)'],
        [80, 'rgb(0,255,0)'],
        [90, 'rgb(0,255,0)'],
        [124, 'rgb(0,255,0)'],
        [125, 'rgb(255,0,0)']
      ] 
       
    };
    case 'CO':
      return{
        colorArray:[[0, 'rgba(0,255,0,0)'],
        [1, 'rgb(0,255,0)'],
        [9, 'rgb(0,255,0)'],
        [10, 'rgb(255,0,0)']
      ] 
        
    };
    case 'NO2':
      return{
        colorArray:[[0, 'rgba(0,255,0,0)'],
        [1, 'rgb(0,255,0)'],
        [10, 'rgb(0,255,0)'],
        [20, 'rgb(0,255,0)'],
        [30, 'rgb(0,255,0)'],
        [39, 'rgb(0,255,0)'],
        [40, 'rgb(255,0,0)']
      ]
        
    };
    case 'TSP':
      return {
        colorArray:[[0, 'rgba(0,255,0,0)'],
        [10, 'rgb(0,255,0)'],
        [20, 'rgb(0,255,0)'],
        [30, 'rgb(0,255,0)'],
        [40, 'rgb(0,255,0)'],
        [50, 'rgb(0,255,0)'],
        [59, 'rgb(255,255,0)'],
        [60, 'rgb(255,255,0)'],
        [70, 'rgb(255,255,0)'],
        [79, 'rgb(255,255,0)'],
        [80, 'rgb(255,0,0)']
      ] 
    };
    case 'TEQ PCDD/Fs':
      return {
        colorArray:[[0, 'rgba(0,255,0,0)'],
        [10, 'rgb(0,255,0)'],
        [20, 'rgb(0,255,0)'],
        [30, 'rgb(0,255,0)'],
        [41, 'rgb(0,255,0)'],
        [42, 'rgb(255,255,0)'],
        [50, 'rgb(255,255,0)'],
        [60, 'rgb(255,255,0)'],
        [70, 'rgb(255,255,0)'],
        [100, 'rgb(255,255,0)'],
        [149, 'rgb(255,255,0)'],
        [150, 'rgb(255,0,0)']
      ]
        
    };
    case 'TEQ PCBS':
      return {
        colorArray:[[0, 'rgba(0,255,0,0)'],
        [9, 'rgb(0,255,0)'],
        [10, 'rgb(255,255,0)'],
        [20, 'rgb(255,255,0)'],
        [30, 'rgb(255,255,0)'],
        [39, 'rgb(255,255,0)'],
        [40, 'rgb(255,0,0)'],
      ]
    };
    case 'ind PCBs':
      return {
        colorArray:[[0, 'rgba(0,255,0,0)'],
        [10, 'rgb(0,255,0)'],
        [59, 'rgb(0,255,0)'],
        [60, 'rgb(255,255,0)'],
        [70, 'rgb(255,255,0)'],
        [80, 'rgb(255,255,0)'],
        [179, 'rgb(255,255,0)'],
        [180, 'rgb(255,0,0)'],
        ]
    };
    case 'NO':
      return {
        colorArray:[[0, 'rgba(0,255,0,0)'],
        [9, 'rgb(0,255,0)'],
        [10, 'rgb(255,255,0)'],
        [20, 'rgb(255,255,0)'],
        [30, 'rgb(255,255,0)'],
        [49, 'rgb(255,255,0)'],
        [50, 'rgb(255,0,0)']
        ]
       
    };
    case 'OC/EC':
      return {
        colorArray:[[0, 'rgba(0,255,0,0)'],
        [9, 'rgb(0,255,0)'],
        [10, 'rgb(255,255,0)'],
        [11, 'rgb(255,0,0)']
      ]
        // min:5/0.5,
        // max:20/2 
    };
    // Add more cases as needed
    default:
      return {colorArray:[[0, 'rgba(0,255,0,0)']] }; // Default label and class name
  }
};

export const getbarcolor =(value,limits)=>{
  if(value>=limits.max){
    return 'danger';
  }else if(value>=limits.min && value<=limits.max){
    return 'warning';
  }
  else{
    return 'success';
  }
}

export const showcol =(value,limits,unit)=>{
 
  if(value>=limits){
    console.log('hello');
    let val=value-limits;
    return ( 
      <p style={{color:'red', textAlign:'center'}}>Υπέρβαση ανωτάτου ορίου κατά {val} {unit}</p>
    );
  }
  
}