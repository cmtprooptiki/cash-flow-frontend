import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import WeeksTableBudget from "../components/WeeksTableBudget";
import WeeksTableBudget_Est2 from "../components/WeeksTableBudget_Est2";
import WeeksTableBudget_Est3 from "../components/WeeksTableBudget_Est3";
import Layout from './Layout';

const BudgetPage = () => {
    // State for selected table and input value
    const [selectedTable, setSelectedTable] = useState('table1');
    const [budget, setBudget] = useState('');

    // Handle change in input field
    const handleBudgetChange = (e) => {
        const value = e.target.value;
        // Ensure the value is a valid float or empty
        if (/^\d*\.?\d*$/.test(value)) {
            setBudget(value); // Update with the string value to handle decimals correctly
        }
    };

    // Convert the budget to a float for calculations
    const parsedBudget = parseFloat(budget);
    const validBudget = isNaN(parsedBudget) ? 0 : parsedBudget;

    return (
        <Layout>
            <div className="boxclass">
                <h1>Budget</h1>
                <div className="input-group">
                    <h3>Εισαγωγή budget: </h3>
                    <InputText
                        id="budget"
                        type="text" // Use text type to handle decimal input
                        value={budget}
                        onChange={handleBudgetChange}
                        placeholder="0.00" // Optional placeholder
                    />
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

                {selectedTable === 'table1' && <WeeksTableBudget budget={validBudget} />}
                {selectedTable === 'table2' && <WeeksTableBudget_Est2  budget={validBudget} />}
                {selectedTable === 'table3' && <WeeksTableBudget_Est3 budget={validBudget} />}
            </div>
        </Layout>
    );
}

export default BudgetPage;