// import React, { useState, useEffect } from 'react';
// import moment from 'moment';
// import Select from 'react-select';

// const WeeksTable = ({ income_paradotea, selectedDateType, calendarDate, onDateChange }) => {
//   const [year, setYear] = useState(calendarDate.getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState(calendarDate.getMonth());

//   useEffect(() => {
//     setYear(calendarDate.getFullYear());
//     setSelectedMonth(calendarDate.getMonth());
//   }, [calendarDate]);

//   const monthsOptions = moment.months().map((month, index) => ({
//     value: index,
//     label: month
//   }));

//   // Utility function to get weeks in a month
//   const getWeeksInMonth = (year, month) => {
//     const startOfMonth = moment([year, month]);
//     const endOfMonth = startOfMonth.clone().endOf('month');
//     const weeks = [];

//     let current = startOfMonth.clone().startOf('week');
//     while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'week')) {
//       const weekStart = current.clone();
//       const weekEnd = weekStart.clone().endOf('week');

//       const itemsInWeek = income_paradotea.filter(item =>
//         moment(item[selectedDateType]).isBetween(weekStart, weekEnd, 'day', '[]')
//       );

//       const weekAmount = itemsInWeek.reduce((sum, item) => sum + item.ammount_total, 0);
//       const uniqueErganames = [...new Set(itemsInWeek.map(item => item.erga.name))].join(', ');

//       weeks.push({
//         start: weekStart.format('DD/MM/YYYY'),
//         end: weekEnd.format('DD/MM/YYYY'),
//         amount: weekAmount,
//         erganames: uniqueErganames
//       });

//       current.add(1, 'week');
//     }

//     return weeks;
//   };

//   // Handler for changing the year
//   const handleYearChange = (event) => {
//     setYear(event.target.value);
//     const newDate = moment([event.target.value, selectedMonth]);
//     onDateChange(newDate.toDate());
//   };

//   // Handler for changing the selected month
//   const handleMonthChange = (selectedOption) => {
//     setSelectedMonth(selectedOption.value);
//     const newDate = moment([year, selectedOption.value]);
//     onDateChange(newDate.toDate());
//   };

//   return (
//     <div>
//       <div className="selectors">
//         <div className="year-selector">
//           <label htmlFor="year">Select Year: </label>
//           <input
//             type="number"
//             id="year"
//             value={year}
//             onChange={handleYearChange}
//             min="1900"
//             max="2100"
//           />
//         </div>
//         <div className="month-selector">
//           <label htmlFor="month">Select Month: </label>
//           <Select
//             name="month"
//             options={monthsOptions}
//             className="basic-single-select"
//             classNamePrefix="select"
//             value={monthsOptions.find(option => option.value === selectedMonth)}
//             onChange={handleMonthChange}
//           />
//         </div>
//       </div>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Week</th>
//             <th>Amount Total</th>
//             <th>Projects</th>
//           </tr>
//         </thead>
//         <tbody>
//           {getWeeksInMonth(year, selectedMonth).map((week, weekIndex) => (
//             <tr key={weekIndex}>
//               <td>
//                 {week.start} - {week.end}
//               </td>
//               <td>
//                 {week.amount}€
//               </td>
//               <td>
//                 {week.erganames}
//               </td>
//             </tr>
//           ))}
//           <tr>
//             <td><strong>Total Amount</strong></td>
//             <td>
//               <strong>
//                 {getWeeksInMonth(year, selectedMonth).reduce((sum, week) => sum + week.amount, 0)}€
//               </strong>
//             </td>
//             <td></td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default WeeksTable;

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Select from 'react-select';

const WeeksTable = ({ income_paradotea, income_ekx, selectedDateType, calendarDate, onDateChange }) => {
  const [year, setYear] = useState(calendarDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(calendarDate.getMonth());

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

      const weekAmountParadotea = itemsInWeekParadotea.reduce((sum, item) => sum + item.ammount_total, 0);
      const weekAmountEkx = itemsInWeekEkx.reduce((sum, item) => sum + item.Ekxorimena_Timologium.bank_ammount, 0);

      const uniqueErganamesParadotea = [...new Set(itemsInWeekParadotea.map(item => item.erga.name))];
      const uniqueErganamesEkx = [...new Set(itemsInWeekEkx.map(item => item.paradotea.erga.name))];

      const combinedUniqueErganames = [...new Set([...uniqueErganamesParadotea, ...uniqueErganamesEkx])].join(', ');


      weeks.push({
        start: weekStart.format('DD/MM/YYYY'),
        end: weekEnd.format('DD/MM/YYYY'),
        amount: weekAmountParadotea + weekAmountEkx,
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
          <label htmlFor="year">Select Year: </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={handleYearChange}
            min="1900"
            max="2100"
          />
        </div>
        <div className="month-selector">
          <label htmlFor="month">Select Month: </label>
          <Select
            name="month"
            options={monthsOptions}
            className="basic-single-select"
            classNamePrefix="select"
            value={monthsOptions.find(option => option.value === selectedMonth)}
            onChange={handleMonthChange}
          />
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