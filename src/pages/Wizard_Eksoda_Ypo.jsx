import React, { useRef, useState, useEffect } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import Tags2 from './tags_pages2/Tags2';
import Ypoxreoseis2 from './ypoxreoseis_pages2/Ypoxreoseis2';
import Doseis2 from './doseis_pages2/Doseis2';
import AddTag2 from './tags_pages2/AddTag2';

const Wizard_Eksoda_Ypo = () => {
    const [stepperKey, setStepperKey] = useState(0);

    useEffect(() => {
        // Force a re-render after a short delay to set the initial step
        setTimeout(() => {
            setStepperKey(1);
        }, 0);
    }, []);

    const stepperRef = useRef(null);

    const nextStep = () => {
        stepperRef.current.nextCallback();
    };

    const prevStep = () => {
        stepperRef.current.prevCallback();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
            <Stepper
                ref={stepperRef}
                key={stepperKey}  // Change the key to force re-render
                activeIndex={1}   // This is to ensure it starts from Ypoxreoseis after re-render
                style={{ flex: '1', display: 'flex', flexDirection: 'column', width: '100%' }}
            >
                {/* <StepperPanel header="Tags" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                border: '2px dashed #ccc',
                                borderRadius: '0.25rem',
                                flex: '1',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: '500'
                            }}
                        >
                            <Tags2 />
                        </div>
                        <div 
                            style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                marginTop: '2rem', 
                                padding: '1rem', 
                                width: '100%' 
                            }}
                        >
                            <AddTag2 onButtonClick={handleAddTagClick} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={nextStep} />
                    </div>
                </StepperPanel> */}
                <StepperPanel header="Ypoxreoseis" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                border: '2px dashed #ccc',
                                borderRadius: '0.25rem',
                                flex: '1',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: '500'
                            }}
                        >
                            <Ypoxreoseis2 />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={prevStep} />
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={nextStep} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Doseis" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                border: '2px dashed #ccc',
                                borderRadius: '0.25rem',
                                flex: '1',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: '500'
                                
                            }}
                        >
                            <Doseis2 />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '1rem' }}>
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={prevStep} />
                    </div>
                </StepperPanel>
            </Stepper>
        </div>
    );

};

export default Wizard_Eksoda_Ypo;