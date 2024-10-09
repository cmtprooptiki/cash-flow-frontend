import React, { useRef, useState } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import Tags2 from './wizard_pages/tags_pages2/Tags2';
import Ypoxreoseis2 from './wizard_pages/ypoxreoseis_pages2/Ypoxreoseis2';
import Doseis2 from './wizard_pages/doseis_pages2/Doseis2';
import AddTag2 from './wizard_pages/tags_pages2/AddTag2';
import Layout from './Layout';

const MyStepper1 = () => {
    const stepperRef = useRef(null);
    // const [refresh, setRefresh] = useState(false);

    // const handleAddTagClick = () => {
    //     setRefresh(prev => !prev); // Toggle state to force a re-render
    // };

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
                        {/* <div 
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
                        </div> */}
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

export default MyStepper1;