import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Select from 'react-select';

const WeeksTable_Ippos = ({ income_paradotea, income_ekx, income_ekx_cust, selectedDateType, calendarDate, onDateChange }) => {
  const [year, setYear] = useState(calendarDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(calendarDate.getMonth());

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
    const currentDate = moment();

    let current = startOfMonth.clone().startOf('week');
    while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'week')) {
      const weekStart = current.clone();
      const weekEnd = weekStart.clone().endOf('week');

      const itemsInWeekParadotea = income_paradotea.filter(item =>
        moment(item[selectedDateType]).isBetween(weekStart, weekEnd, 'day', '[]')
      );

      // Filter income_ekx to exclude items with bank_date before currentDate and bank_ammount equal to 0
      const itemsInWeekEkx = income_ekx.filter(item =>
        moment(item.Ekxorimena_Timologium.bank_date).isBetween(weekStart, weekEnd, 'day', '[]') &&
        moment(item.Ekxorimena_Timologium.bank_date).isSameOrAfter(currentDate, 'day') &&
        item.Ekxorimena_Timologium.bank_ammount !== 0
      );

      // Filter income_ekx_cust to exclude items with cust_date before currentDate and customer_ammount equal to 0
      const itemsInWeekEkx_Cust = income_ekx_cust.filter(item =>
        moment(item.Ekxorimena_Timologium.cust_date).isBetween(weekStart, weekEnd, 'day', '[]') &&
        moment(item.Ekxorimena_Timologium.cust_date).isSameOrAfter(currentDate, 'day') &&
        item.Ekxorimena_Timologium.customer_ammount !== 0
      );

      const getCountOfIdsInIncomeEkx = () => {
        const idCounts = countIdsInIncomeEkx();
        return Object.keys(idCounts).length; // Count the number of unique IDs
      };

      // Calculate weekAmountEkx by filtering items with the same ID and then dividing the sum by the count of IDs
      const weekAmountEkx = itemsInWeekEkx.reduce((sum, item) => {
        const foundId = item.Ekxorimena_Timologium.id;
        const itemsWithSameId = income_ekx.filter(ekxItem => ekxItem.Ekxorimena_Timologium.id === foundId);
        const sumOfBankAmounts = itemsWithSameId.reduce((acc, ekxItem) => acc + ekxItem.Ekxorimena_Timologium.bank_ammount, 0);
        const averageBankAmount = sumOfBankAmounts / itemsWithSameId.length;
        return sum + (averageBankAmount / itemsWithSameId.length);
      }, 0);

      const weekAmmountEkxCust = itemsInWeekEkx_Cust.reduce((sum, item) => {
        const foundId = item.Ekxorimena_Timologium.id;
        const itemsWithSameId = income_ekx_cust.filter(ekxItem => ekxItem.Ekxorimena_Timologium.id === foundId);
        const sumOfCustAmounts = itemsWithSameId.reduce((acc, ekxItem) => acc + ekxItem.Ekxorimena_Timologium.customer_ammount, 0);
        const averageBankAmount = sumOfCustAmounts / itemsWithSameId.length;
        return sum + (averageBankAmount / itemsWithSameId.length);
      }, 0);

      const weekAmountParadotea = itemsInWeekParadotea.reduce((sum, item) => sum + item.ammount_total, 0);

      const uniqueErganamesParadotea = [...new Set(itemsInWeekParadotea.map(item => item.erga.name))];
      const uniqueErganamesEkx = [...new Set(itemsInWeekEkx.map(item => item.paradotea.erga.name))];
      const uniqueErganamesEkxCust = [...new Set(itemsInWeekEkx_Cust.map(item => item.paradotea.erga.name))];

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
          <br />
          <label htmlFor="year">Select Year: </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={handleYearChange}
            min="1900"
            max="2100"
          />
          <br />
        </div>
        <div className="month-selector">
          <br />
          <label htmlFor="month">Select Month: </label>
          <Select
            name="month"
            options={monthsOptions}
            className="basic-single-select"
            classNamePrefix="select"
            value={monthsOptions.find(option => option.value === selectedMonth)}
            onChange={handleMonthChange}
          />
          <br />
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

export default WeeksTable_Ippos;