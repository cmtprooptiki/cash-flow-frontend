import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Select from 'react-select';
import axios from 'axios';
import apiBaseUrl from '../apiConfig';

const WeeksTable_Eksoda_OLD = ({ eventsWithActualPaymentDate, eventsWithoutActualPaymentDate, calendarDate, onDateChange }) => {
  const [year, setYear] = useState(calendarDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(calendarDate.getMonth());
  const [providerNames, setProviderNames] = useState({});

  useEffect(() => {
    setYear(calendarDate.getFullYear());
    setSelectedMonth(calendarDate.getMonth());
  }, [calendarDate]);

  useEffect(() => {
    const providerIds = [...new Set(getWeeksInMonth(year, selectedMonth).flatMap(week => week.providers))];
    fetchProviderNames(providerIds);
  }, [year, selectedMonth]);

  const fetchProviderNames = async (providerIds) => {
    const names = {};
  await Promise.all(providerIds.map(async (providerId) => {
    const name = await getProviderName(providerId);
    names[providerId] = name;
  }));
  setProviderNames(names);
  };

  const getProviderName = async (ypoxreoseisId) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/ypo/${ypoxreoseisId}`, {timeout: 5000});
      return response.data.provider;
    } catch (error) {
      console.error('Error fetching provider name:', error);
      return 'Unknown Provider';
    }
  };

  const monthsOptions = moment.months().map((month, index) => ({
    value: index,
    label: month
  }));

  const getWeeksInMonth = (year, month) => {
    const startOfMonth = moment([year, month]);
    const endOfMonth = startOfMonth.clone().endOf('month');
    const weeks = [];

    let current = startOfMonth.clone().startOf('week');
    while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'week')) {
      const weekStart = current.clone();
      const weekEnd = weekStart.clone().endOf('week');

      const eventsWithActualPaymentDateInWeek = eventsWithActualPaymentDate.filter(event =>
        moment(event.actual_payment_date).isBetween(weekStart, weekEnd, 'day', '[]')
      );

      const eventsWithoutActualPaymentDateInWeek = eventsWithoutActualPaymentDate.filter(event =>
        moment(event.estimate_payment_date).isBetween(weekStart, weekEnd, 'day', '[]')
      );

      const weekAmountWithActualPayment = eventsWithActualPaymentDateInWeek.reduce((sum, event) => sum + event.ammount, 0);
      const weekAmountWithoutActualPayment = eventsWithoutActualPaymentDateInWeek.reduce((sum, event) => sum + event.ammount, 0);

      const combinedEvents = [...eventsWithActualPaymentDateInWeek, ...eventsWithoutActualPaymentDateInWeek];
      const uniqueProviders = [...new Set(combinedEvents.map(event => event.ypoxreoseis_id))];

      weeks.push({
        start: weekStart.format('DD/MM/YYYY'),
        end: weekEnd.format('DD/MM/YYYY'),
        amount: weekAmountWithActualPayment + weekAmountWithoutActualPayment,
        providers: uniqueProviders
      });

      current.add(1, 'week');
    }

    return weeks;
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
    const newDate = moment([event.target.value, selectedMonth]);
    onDateChange(newDate.toDate());
  };

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
            <th>Providers</th>
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
                {week.providers.map((providerId, index) => (
                  <span key={index}>{providerNames[providerId]}</span>
                )).map((name, index, array) => (
                    <React.Fragment key={index}>
                      {name}
                      {index < array.length - 1 && ", "}
                    </React.Fragment>
                  ))}
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

export default WeeksTable_Eksoda_OLD;