// import React, { useState } from 'react';
// import { InputText } from 'primereact/inputtext';
// import WeeksTableBudget from "../components/WeeksTableBudget";
// import WeeksTableBudget_Est2 from "../components/WeeksTableBudget_Est2";
// import WeeksTableBudget_Est3 from "../components/WeeksTableBudget_Est3";
// import Layout from './Layout';
// import PaidBudgetList from './PaidBudgetList';


// const BudgetPage = () => {
//     // State for selected table and input value
//     const [selectedTable, setSelectedTable] = useState('table1');
//     const [budget, setBudget] = useState('');

//     // Handle change in input field
//     const handleBudgetChange = (e) => {
//         const value = e.target.value;
//         // Ensure the value is a valid float or empty
//         if (/^\d*\.?\d*$/.test(value)) {
//             setBudget(value); // Update with the string value to handle decimals correctly
//         }
//     };

//     // Convert the budget to a float for calculations
//     const parsedBudget = parseFloat(budget);
//     const validBudget = isNaN(parsedBudget) ? 0 : parsedBudget;
//     // console.log(parsedBudget)
//     return (
//         <Layout>
//             <div className="boxclass">
//                 <h1>Budget</h1>
//                 <div className="input-group">
//                     <h3>Εισαγωγή budget: </h3>
//                     <InputText
//                         id="budget"
//                         type="text" // Use text type to handle decimal input
//                         value={budget}
//                         onChange={handleBudgetChange}
//                         placeholder="0.00" // Optional placeholder
//                     />
//                 </div>
//                 <div className="button-group">
//                     <button
//                         className="Filters"
//                         style={{ margin: "10px" }}
//                         onClick={() => setSelectedTable('table1')}
//                     >
//                         ΠΡΟΥΠΟΛΟΓΙΣΜΟΣ Best-case Scenario
//                     </button>
//                     <button
//                         className="Filters"
//                         style={{ margin: "10px" }}
//                         onClick={() => setSelectedTable('table2')}
//                     >
//                         ΠΡΟΥΠΟΛΟΓΙΣΜΟΣ Medium-case Scenario
//                     </button>
//                     <button
//                         className="Filters"
//                         style={{ margin: "10px" }}
//                         onClick={() => setSelectedTable('table3')}
//                     >
//                         ΠΡΟΥΠΟΛΟΓΙΣΜΟΣ Worst-case Scenario
//                     </button>
//                 </div>

//                 {/* {selectedTable === 'table1' && <WeeksTableBudget budget={validBudget} />}
//                 {selectedTable === 'table2' && <WeeksTableBudget_Est2  budget={validBudget} />}
//                 {selectedTable === 'table3' && <WeeksTableBudget_Est3 budget={validBudget} />} */}
//                 {/* {selectedTable} */}
//             </div>
//             <br></br>
//             <PaidBudgetList budget={validBudget} scenario={selectedTable}/>
//         </Layout>
//     );
// }

// export default BudgetPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios to fetch the budget from the backend
import WeeksTableBudget from "../components/WeeksTableBudget";
import WeeksTableBudget_Est2 from "../components/WeeksTableBudget_Est2";
import WeeksTableBudget_Est3 from "../components/WeeksTableBudget_Est3";
import Layout from './Layout';
import PaidBudgetList from './PaidBudgetList';
// import apiBaseUrl from '../../apiConfig'; // Assuming you have an apiBaseUrl defined for your backend
import apiBaseUrl from '../apiConfig';

const BudgetPage = () => {
    // State for selected table, budget value, and date
    const [selectedTable, setSelectedTable] = useState('table1');
    const [budget, setBudget] = useState(null); // Set initial state to null to indicate loading
    const [date, setDate] = useState(null); // State to store the budget date
    const [msg, setMsg] = useState("");

    // Fetch the budget and date from the database when the component mounts
    useEffect(() => {
        const fetchBudget = async () => {
            try {
                // Fetch budget from your API endpoint
                const response = await axios.get(`${apiBaseUrl}/budget`);
                if (response.data && response.data.length > 0) {
                    // Assuming the first record is the one you're interested in
                    const budgetData = response.data[0];
                    setBudget(budgetData.ammount);
                    setDate(budgetData.date); // Store the budget date
                } else {
                    setMsg("No budget found.");
                }
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                } else {
                    setMsg("Failed to fetch budget. Please try again.");
                }
            }
        };

        fetchBudget(); // Fetch the budget on component mount
    }, []);

    // Convert the fetched budget to a float for calculations
    const parsedBudget = parseFloat(budget);
    const validBudget = isNaN(parsedBudget) ? 0 : parsedBudget;

    // Format the date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Show loading state if the budget is still being fetched
    if (budget === null || date === null) {
        return (
            <Layout>
                <div>Loading budget...</div>
            </Layout>
        );
    }

    const formatCurrency = (value) => {
        // return value.toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };


    return (
        <Layout>
            <div className="boxclass">
                <h1>Budget</h1>
                {msg && <p>{msg}</p>}
                <div className="budget-display">
                    <h3>Current Budget: {formatCurrency(validBudget)}</h3> {/* Display the fetched budget */}
                    <h3>Submission Date: {formatDate(date)}</h3> {/* Display the fetched date */}
                </div>
                <div className="button-group">
                    <button
                        className="Filters"
                        style={{ margin: "10px" }}
                        onClick={() => setSelectedTable('table1')}
                    >
                        ΠΡΟΥΠΟΛΟΓΙΣΜΟΣ Best-case Scenario
                    </button>
                    <button
                        className="Filters"
                        style={{ margin: "10px" }}
                        onClick={() => setSelectedTable('table2')}
                    >
                        ΠΡΟΥΠΟΛΟΓΙΣΜΟΣ Medium-case Scenario
                    </button>
                    <button
                        className="Filters"
                        style={{ margin: "10px" }}
                        onClick={() => setSelectedTable('table3')}
                    >
                        ΠΡΟΥΠΟΛΟΓΙΣΜΟΣ Worst-case Scenario
                    </button>
                </div>

                {/* Render the appropriate table based on the selected scenario */}
                {/* {selectedTable === 'table1' && <WeeksTableBudget budget={validBudget} />}
                {selectedTable === 'table2' && <WeeksTableBudget_Est2 budget={validBudget} />}
                {selectedTable === 'table3' && <WeeksTableBudget_Est3 budget={validBudget} />} */}
            </div>
            <br></br>
            <PaidBudgetList budget={validBudget} scenario={selectedTable} />
        </Layout>
    );
};

export default BudgetPage;