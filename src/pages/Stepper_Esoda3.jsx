import React, { useRef, useState, useEffect } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import Customer2 from './customer_pages2/Customer2';
import ErgaCat2 from './erga_cat_pages2/ErgaCat2';
import Erga2 from './erga_pages2/Erga2';
import Paradotea2 from './paradotea_pages2/Paradotea2';
import Timologia2 from './timologia_pages2/Timologia2';
import Ekxorimena_Timologia2 from './ekxwrimeno_timologio_pages2/Ekxorimena_Timologia2';
import Layout from './Layout';

const Stepper_Esoda3 = () => {
    const stepperRef = useRef(null);
    const [initialNavigationDone, setInitialNavigationDone] = useState(false);

    useEffect(() => {
        if (stepperRef.current && !initialNavigationDone) {
            // Move to the Paradotea step (index 2) on component mount
            stepperRef.current.nextCallback(); // Move to Paradotea (index 2)
            stepperRef.current.nextCallback();
            
        }
        if(stepperRef.current || !initialNavigationDone) {
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
                <StepperPanel header="Customer" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
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
                            <Customer2 />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Erga" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                        <div 
                            style={{ 
                                border: '2px dashed #ccc', 
                                borderRadius: '0.25rem', 
                                flex: '1', 
                                display: 'block', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                fontWeight: '500' ,
                                width: '100%',
                                height: '1500px'
                            }}
                        >
                            <div style={{ marginBottom: '1rem', width: '100%' }}>
                                    <Erga2 />
                                </div>
                                <div style={{ marginTop: '1rem', width: '100%' }}>
                                    <ErgaCat2 />
                                </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Paradotea" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                        <div 
                            style={{ 
                                border: '2px dashed #ccc', 
                                borderRadius: '0.25rem', 
                                flex: '1', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                fontWeight: '500',
                                width: '1500px'
                            }}
                        >
                            <Paradotea2></Paradotea2>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>

                <StepperPanel header="Timologia" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
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
                            <Timologia2></Timologia2>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Ekxorimena Timologia" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
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
                            <Ekxorimena_Timologia2></Ekxorimena_Timologia2>
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

export default Stepper_Esoda3;