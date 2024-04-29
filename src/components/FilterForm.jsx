import React, { useState } from 'react';

const FilterForm = ({ onSubmit }) => {
  const [building, setBuilding] = useState('');
  const [metric, setMetric] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ building, metric });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Building:
        <input type="text" value={building} onChange={(e) => setBuilding(e.target.value)} />
      </label>
      <label>
        Metric:
        <input type="text" value={metric} onChange={(e) => setMetric(e.target.value)} />
      </label>
      <button type="submit">Apply Filters</button>
    </form>
  );
};

export default FilterForm;