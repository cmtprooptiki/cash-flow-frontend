
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios to fetch the budget from the backend
// import WeeksTableBudget from "../components/WeeksTableBudget";
// import WeeksTableBudget_Est2 from "../components/WeeksTableBudget_Est2";
// import WeeksTableBudget_Est3 from "../components/WeeksTableBudget_Est3";
import Layout from './Layout';
import PaidBudgetList from './PaidBudgetList';
// import apiBaseUrl from '../../apiConfig'; // Assuming you have an apiBaseUrl defined for your backend
import apiBaseUrl from '../apiConfig';
import {ReactComponent as BudgetIcon } from '../icons/budget.svg';

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
                const response = await axios.get(`${apiBaseUrl}/budget`, {timeout: 5000});
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
            <div >
                {msg && <p>{msg}</p>}
                {/* <div className="budget-display">
                    <h3>Current Budget: {formatCurrency(validBudget)}</h3> 
                    <h3>Submission Date: {formatDate(date)}</h3> 
                </div> */}

                <div className="col-12 md:col-6 lg:col-3">
      <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-5">
              <div>
                  <h6 className="m-0 mb-1 text-500 text-gray-800">Τραπεζικά Διαθέσιμα</h6>
                  <h1 className="m-0 text-gray-800 ">{formatCurrency(validBudget)}</h1>
                  <small className="m-0 text-gray-800 ">Τελευταία Ενημέρωση: {formatDate(date)}</small>
              </div>
              <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                  {/* <i className="pi pi-map-marker text-orange-500 text-xl"></i> */}
                  <BudgetIcon style={{ width: '2.5em', height: '2.5em' ,fill:'black'}}  className="" /> 
              </div>
          </div>
          
      </div>
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