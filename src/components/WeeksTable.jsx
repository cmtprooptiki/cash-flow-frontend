import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Select from 'react-select';

const WeeksTable = ({ income_paradotea, income_ekx, income_ekx_cust, selectedDateType, calendarDate, onDateChange }) => {
  const [year, setYear] = useState(calendarDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(calendarDate.getMonth());

  // console.log("Income_ekx: ", income_ekx.Ekxorimena_Timologium.bank_ammount)

  // Function to count occurrences of each ID in income_ekx
  const countIdsInIncomeEkx = () => {
    const idCounts = {};
    income_ekx.forEach(item => {
      const id = item.Ekxorimena_Timologium.id;
      if (idCounts[id]) {
        idCounts[id]++;
      } else {
        idCounts[id] = 1;
      }
    });
    return idCounts;
  };


  // const idCounts = countIdsInIncomeEkx();
  // console.log("Found Ids: ", idCounts)

  useEffect(() => {
    setYear(calendarDate.getFullYear());
    setSelectedMonth(calendarDate.getMonth());
  }, [calendarDate]);

  const monthsOptions = moment.months().map((month, index) => ({
    value: index,
    label: month
  }));

  // Utility function to get weeks in a month
  const getWeeksInMonth = (year, month) => {
    const startOfMonth = moment([year, month]);
    const endOfMonth = startOfMonth.clone().endOf('month');
    const weeks = [];

    let current = startOfMonth.clone().startOf('week');
    while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'week')) {
      const weekStart = current.clone();
      const weekEnd = weekStart.clone().endOf('week');

      const itemsInWeekParadotea = income_paradotea.filter(item =>
        moment(item[selectedDateType]).isBetween(weekStart, weekEnd, 'day', '[]')
      );

      const itemsInWeekEkx = income_ekx.filter(item =>
        moment(item.Ekxorimena_Timologium["bank_date"]).isBetween(weekStart, weekEnd, 'day', '[]')
      );

      const itemsInWeekEkx_Cust = income_ekx_cust.filter(item =>
        moment(item.Ekxorimena_Timologium["cust_date"]).isBetween(weekStart, weekEnd, 'day', '[]')
      );

      const getCountOfIdsInIncomeEkx = () => {
        const idCounts = countIdsInIncomeEkx();
        return Object.keys(idCounts).length; // Count the number of unique IDs
      };
      
      // Calculate the count of IDs in income_ekx
      const countOfIdsInIncomeEkx = getCountOfIdsInIncomeEkx();

      

      const weekAmountParadotea = itemsInWeekParadotea.reduce((sum, item) => sum + item.ammount_total, 0);
      // const weekAmountEkx = itemsInWeekEkx.reduce((sum, item) => sum + (item.Ekxorimena_Timologium.bank_ammount / countOfIdsInIncomeEkx), 0);
      // Calculate weekAmountEkx by filtering items with the same ID and then dividing the sum by the count of IDs
      const weekAmountEkx = itemsInWeekEkx.reduce((sum, item) => {
  // Assuming item.Ekxorimena_Timologium.id is the ID you want to match
  const foundId = item.Ekxorimena_Timologium.id;

  // Filter items in income_ekx with the same ID as foundId
  const itemsWithSameId = income_ekx.filter(ekxItem => ekxItem.Ekxorimena_Timologium.id === foundId);

  // Calculate the sum of bank amounts for items with the same ID
  const sumOfBankAmounts = itemsWithSameId.reduce((acc, ekxItem) => acc + ekxItem.Ekxorimena_Timologium.bank_ammount, 0);

  // Calculate the average bank amount for items with the same ID
  const averageBankAmount = sumOfBankAmounts / itemsWithSameId.length;

  // console.log("HHHHH",averageBankAmount)

  // Add the average bank amount to the sum
  return sum + (averageBankAmount / itemsWithSameId.length);
}, 0);
      
      const weekAmmountEkxCust = itemsInWeekEkx_Cust.reduce((sum, item) => {
        // Assuming item.Ekxorimena_Timologium.id is the ID you want to match
        const foundId = item.Ekxorimena_Timologium.id;
      
        // Filter items in income_ekx with the same ID as foundId
        const itemsWithSameId = income_ekx_cust.filter(ekxItem => ekxItem.Ekxorimena_Timologium.id === foundId);
      
        // Calculate the sum of bank amounts for items with the same ID
        const sumOfCustAmounts = itemsWithSameId.reduce((acc, ekxItem) => acc + ekxItem.Ekxorimena_Timologium.customer_ammount, 0);
      
        // Calculate the average bank amount for items with the same ID
        const averageBankAmount = sumOfCustAmounts / itemsWithSameId.length;

        // console.log("EEEEEEEEEEEEEE",averageBankAmount)

      
        // Add the average bank amount to the sum
        return sum + (averageBankAmount / itemsWithSameId.length);
      }, 0);

      // console.log("Giatiiii",weekAmmountEkxCust)

      const uniqueErganamesParadotea = [...new Set(itemsInWeekParadotea.map(item => item.erga.name))];
      const uniqueErganamesEkx = [...new Set(itemsInWeekEkx.map(item => item.paradotea.erga.name))];
      const uniqueErganamesEkxCust = [...new Set(itemsInWeekEkx_Cust.map(item => item.paradotea.erga.name))]

      const combinedUniqueErganames = [...new Set([...uniqueErganamesParadotea, ...uniqueErganamesEkx, ...uniqueErganamesEkxCust])].join(', ');


      weeks.push({
        start: weekStart.format('DD/MM/YYYY'),
        end: weekEnd.format('DD/MM/YYYY'),
        amount: weekAmountParadotea + weekAmountEkx + weekAmmountEkxCust,
        erganames: combinedUniqueErganames,
      });

      current.add(1, 'week');
    }

    return weeks;
  };

  // Handler for changing the year
  const handleYearChange = (event) => {
    setYear(event.target.value);
    const newDate = moment([event.target.value, selectedMonth]);
    onDateChange(newDate.toDate());
  };

  // Handler for changing the selected month
  const handleMonthChange = (selectedOption) => {
    setSelectedMonth(selectedOption.value);
    const newDate = moment([year, selectedOption.value]);
    onDateChange(newDate.toDate());
  };

  return (
    <div>
      <div className="selectors">
        
        <div className="year-selector">
        <br></br>
          <label htmlFor="year">Select Year: </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={handleYearChange}
            min="1900"
            max="2100"
          />
              <br></br>
        </div>
        <div className="month-selector">
        <br></br>
          <label htmlFor="month">Select Month: </label>
          <Select
            name="month"
            options={monthsOptions}
            className="basic-single-select"
            classNamePrefix="select"
            value={monthsOptions.find(option => option.value === selectedMonth)}
            onChange={handleMonthChange}
          />
              <br></br>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Week</th>
            <th>Amount Total</th>
            <th>Projects</th>
          </tr>
        </thead>
        <tbody>
          {getWeeksInMonth(year, selectedMonth).map((week, weekIndex) => (
            <tr key={weekIndex}>
              <td>
                {week.start} - {week.end}
              </td>
              <td>
                {week.amount}€
              </td>
              <td>
                {week.erganames}
              </td>
            </tr>
          ))}
          <tr>
            <td><strong>Total Amount</strong></td>
            <td>
              <strong>
                {getWeeksInMonth(year, selectedMonth).reduce((sum, week) => sum + week.amount, 0)}€
              </strong>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeeksTable;