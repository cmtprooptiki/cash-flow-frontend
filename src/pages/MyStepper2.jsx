import React, { useRef, useState, useEffect } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import Tags2 from './wizard_pages/tags_pages2/Tags2';
import Ypoxreoseis2 from './wizard_pages/ypoxreoseis_pages2/Ypoxreoseis2';
import Doseis2 from './wizard_pages/doseis_pages2/Doseis2';
import AddTag2 from './wizard_pages/tags_pages2/AddTag2';
import Layout from './Layout';

const MyStepper2 = () => {
    const stepperRef = useRef(null);
    const [initialNavigationDone, setInitialNavigationDone] = useState(false);

    useEffect(() => {
        if (stepperRef.current && !initialNavigationDone) {
            // Move to the Ypoxreoseis step (index 1) on component mount
            stepperRef.current.nextCallback();
            setInitialNavigationDone(true);
        }
    }, [initialNavigationDone]);

    return (
        <Layout>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
                <Stepper 
                    ref={stepperRef} 
                    style={{ flex: '1', display: 'flex', flexDirection: 'column', width: '100%' }}
                >
                    <StepperPanel header="Tags" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
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
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                        </div>
                    </StepperPanel>
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
                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
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
                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                        </div>
                    </StepperPanel>
                </Stepper>
            </div>
        </Layout>
    );
};

export default MyStepper2;