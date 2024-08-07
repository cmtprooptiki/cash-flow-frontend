// import React, { useRef } from 'react';
// import { Stepper } from 'primereact/stepper';
// import { StepperPanel } from 'primereact/stepperpanel';
// import { Button } from 'primereact/button';
// import Tags2 from './tags_pages2/Tags2';
// import Ypoxreoseis2 from './ypoxreoseis_pages2/Ypoxreoseis2';
// import Doseis2 from './doseis_pages2/Doseis2';
// import AddTag2 from './tags_pages2/AddTag2';
// const Wizard_Eksoda = () => {
//     const stepperRef = useRef(null);

//     return (
//     <div className="card flex justify-content">
//         <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
//             <StepperPanel header="Tags">
//                 <div className="flex flex-column h-12rem">
//                     <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"><Tags2></Tags2></div>
//                 </div>
//                 <div className="flex pt-4 justify-content-end">
//                     <br />
//                     <br />
//                     <AddTag2></AddTag2>
//                     <br />
//                     <br />
//                     <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
//                 </div>
//             </StepperPanel>
//             <StepperPanel header="Ypoxreoseis">
//                 <div className="flex flex-column h-12rem">
//                     <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"><Ypoxreoseis2></Ypoxreoseis2></div>
//                 </div>
//                 <div className="flex pt-4 justify-content-between">
//                     <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
//                     <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
//                 </div>
//             </StepperPanel>
//             <StepperPanel header="Doseis">
//                 <div className="flex flex-column h-12rem">
//                     <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"><Doseis2></Doseis2></div>
//                 </div>
//                 <div className="flex pt-4 justify-content-start">
//                     <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
//                 </div>
//             </StepperPanel>
//         </Stepper>
//     </div>
//     )
// };

// export default Wizard_Eksoda;

import React, { useRef, useState } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import Tags2 from './tags_pages2/Tags2';
import Ypoxreoseis2 from './ypoxreoseis_pages2/Ypoxreoseis2';
import Doseis2 from './doseis_pages2/Doseis2';
import AddTag2 from './tags_pages2/AddTag2';

const Wizard_Eksoda = () => {
    const stepperRef = useRef(null);
    // const [refresh, setRefresh] = useState(false);

    // const handleAddTagClick = () => {
    //     setRefresh(prev => !prev); // Toggle state to force a re-render
    // };

    return (
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
                                fontWeight: '500',
                                maxWidth: '800px'
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
    );

    
};

export default Wizard_Eksoda;