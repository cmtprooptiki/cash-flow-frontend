// components/CustomToast.js
import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip'; // For optional tooltip on info icon
import { PrimeIcons } from 'primereact/api';  // Import PrimeIcons

import { Button } from 'primereact/button';

const CustomToast = (props) => {
  const toast = useRef(""); // Reference for the toast
  const msg=props.txtmsg

  const showInfo = (text) => {
    toast.current.show({
        severity: 'info',
        summary: 'Πληροφορία',
        detail: text,
        life: 3000,
    });
};

  return (
    <>
        <Toast ref={toast} />
        <Button type="button" icon="pi pi-info-circle" className="p-button-rounded p-button-info p-button-text" onClick={(e)=> showInfo(msg)} />

    </>
  );
};

export default CustomToast;