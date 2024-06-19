import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Select from 'react-select';
import axios from 'axios';
import apiBaseUrl from '../apiConfig';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const WeeksTableBudget_Est3 = ()=>
{
    const [ypoxreoseis, setYpoxreoseis] = useState([]);
    const [doseis, setDoseis] = useState([]);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [paradotea, setParadotea] = useState([]);
    const [income_ekx, setIncome_ekx] = useState([]);
    const [income_ekx_cust, setIncome_Ekx_Cust] = useState([]);
    const [income_paradotea, setIncome_paradotea] = useState([]);
    const [ergaListNames, setErgaListNames] = useState([]);
    const [providerNames, setProviderNames] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isError } = useSelector((state) => state.auth);

    const year = calendarDate.getFullYear();
    const selectedMonth = calendarDate.getMonth();

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate('/');
        }
    }, [isError, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    paradoteaRes,
                    incomeParadoteaRes,
                    incomeEkxRes,
                    ergaListNamesRes,
                    incomeEkxCustRes,
                    doseisRes,
                    ypoxreoseisRes
                ] = await Promise.all([
                    axios.get(`${apiBaseUrl}/getlistParErgColors`),
                    axios.get(`${apiBaseUrl}/CheckParadotea`),
                    axios.get(`${apiBaseUrl}/ParadoteaBank_Date`),
                    axios.get(`${apiBaseUrl}/getlistErgaNames`),
                    axios.get(`${apiBaseUrl}/ParadoteaCust_Date`),
                    axios.get(`${apiBaseUrl}/doseis`),
                    axios.get(`${apiBaseUrl}/ypoquery`)
                ]);

                setParadotea(paradoteaRes.data);
                setIncome_paradotea(incomeParadoteaRes.data);
                setIncome_ekx(incomeEkxRes.data);
                setErgaListNames(ergaListNamesRes.data);
                setIncome_Ekx_Cust(incomeEkxCustRes.data);
                setDoseis(doseisRes.data);
                setYpoxreoseis(ypoxreoseisRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleYearChange = (event) => {
        const newDate = new Date(calendarDate);
        newDate.setFullYear(Number(event.target.value));
        setCalendarDate(newDate);
    };

    const handleMonthChange = (selectedOption) => {
        const newDate = new Date(calendarDate);
        newDate.setMonth(selectedOption.value);
        setCalendarDate(newDate);
    };

    const monthsOptions = moment.months().map((month, index) => ({
        value: index,
        label: month
    }));

    const eventsWithActualPaymentDate = doseis.filter(
        (item) => item.actual_payment_date !== null
      );
    
      const eventsWithoutActualPaymentDate = doseis.filter(
        (item) => item.actual_payment_date === null
      );

    const getWeeksInMonth = (year, month) => {
        const startOfMonth = moment([year, month]);
        const endOfMonth = startOfMonth.clone().endOf('month');
        const weeks = [];

        let current = startOfMonth.clone().startOf('week');
        while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'week')) {
            const weekStart = current.clone();
            const weekEnd = weekStart.clone().endOf('week');

            console.log("MONTH IOFJDIDF", income_paradotea.filter(item =>
                moment(item.paradotea.estimate_payment_date_3)))

            const itemsInWeekParadotea = income_paradotea.filter(item =>
                moment(item.paradotea.estimate_payment_date_3).isBetween(weekStart, weekEnd, 'day', '[]')
            );

            const itemsInWeekEkx = income_ekx.filter(item =>
                moment(item.Ekxorimena_Timologium["bank_date"]).isBetween(weekStart, weekEnd, 'day', '[]')
            );

            const itemsInWeekEkx_Cust = income_ekx_cust.filter(item =>
                moment(item.Ekxorimena_Timologium["cust_date"]).isBetween(weekStart, weekEnd, 'day', '[]')
            );

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

            const getCountOfIdsInIncomeEkx = () => {
                const idCounts = countIdsInIncomeEkx();
                return Object.keys(idCounts).length; // Count the number of unique IDs
            };

            const countOfIdsInIncomeEkx = getCountOfIdsInIncomeEkx();

            const weekAmountParadotea = itemsInWeekParadotea.reduce((sum, item) => sum + (item.paradotea.ammount_total || 0), 0);

            console.log("Week Start: ", weekStart.format('DD/MM/YYYY'));
            console.log("Week End: ", weekEnd.format('DD/MM/YYYY'));
            console.log("Income Paradotea: ", income_paradotea);
            console.log("Items in Week Paradotea: ", itemsInWeekParadotea);


            const weekAmountEkx = itemsInWeekEkx.reduce((sum, item) => {
                const foundId = item.Ekxorimena_Timologium.id;
                const itemsWithSameId = income_ekx.filter(ekxItem => ekxItem.Ekxorimena_Timologium.id === foundId);
                const sumOfBankAmounts = itemsWithSameId.reduce((acc, ekxItem) => acc + ekxItem.Ekxorimena_Timologium.bank_ammount, 0);
                const averageBankAmount = sumOfBankAmounts / itemsWithSameId.length;
                return sum + (averageBankAmount / itemsWithSameId.length);
            }, 0);

            const weekAmountEkxCust = itemsInWeekEkx_Cust.reduce((sum, item) => {
                const foundId = item.Ekxorimena_Timologium.id;
                const itemsWithSameId = income_ekx_cust.filter(ekxItem => ekxItem.Ekxorimena_Timologium.id === foundId);
                const sumOfCustAmounts = itemsWithSameId.reduce((acc, ekxItem) => acc + ekxItem.Ekxorimena_Timologium.customer_ammount, 0);
                const averageCustAmount = sumOfCustAmounts / itemsWithSameId.length;
                return sum + (averageCustAmount / itemsWithSameId.length);
            }, 0);

            

            const uniqueErganamesParadotea = [...new Set(itemsInWeekParadotea.map(item => item.paradotea.erga.name))];
            const uniqueErganamesEkx = [...new Set(itemsInWeekEkx.map(item => item.paradotea.erga.name))];
            const uniqueErganamesEkxCust = [...new Set(itemsInWeekEkx_Cust.map(item => item.paradotea.erga.name))];

            const combinedUniqueErganames = [...new Set([...uniqueErganamesParadotea, ...uniqueErganamesEkx, ...uniqueErganamesEkxCust])].join(', ');


            const eventsWithActualPaymentDateInWeek = eventsWithActualPaymentDate.filter(event =>
                moment(event.actual_payment_date).isBetween(weekStart, weekEnd, 'day', '[]')
              );
        
              const eventsWithoutActualPaymentDateInWeek = eventsWithoutActualPaymentDate.filter(event =>
                moment(event.estimate_payment_date).isBetween(weekStart, weekEnd, 'day', '[]')
              );
        
              const weekAmountWithActualPayment = eventsWithActualPaymentDateInWeek.reduce((sum, event) => sum + event.ammount, 0);
              const weekAmountWithoutActualPayment = eventsWithoutActualPaymentDateInWeek.reduce((sum, event) => sum + event.ammount, 0);
        
              const combinedEvents = [...eventsWithActualPaymentDateInWeek, ...eventsWithoutActualPaymentDateInWeek];

            weeks.push({
                start: weekStart.format('DD/MM/YYYY'),
                end: weekEnd.format('DD/MM/YYYY'),
                ammount: weekAmountParadotea + weekAmountEkx + weekAmountEkxCust - (weekAmountWithActualPayment + weekAmountWithoutActualPayment),
                erganames: combinedUniqueErganames,
            });

            current.add(1, 'week');
        }

        return weeks;
    };

    return (
        <div>
            <h1 style={{fontSize: "30px", fontWeight:"bold", textAlign:"center", marginBottom: "20px", marginTop: "20px"}}>ΠΡΟΥΠΟΛΟΓΙΣΜΟΣ Worst-Case Scenario</h1>
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
                    </tr>
                </thead>
                <tbody>
                    {getWeeksInMonth(year, selectedMonth).map((week, weekIndex) => (
                        <tr key={weekIndex}>
                            <td>{week.start} - {week.end}</td>
                            <td>{week.ammount.toFixed(2)}€</td>
                        </tr>
                    ))}
                    <tr>
                        <td><strong>Total Amount</strong></td>
                        <td>
                            <strong>
                                {getWeeksInMonth(year, selectedMonth).reduce((sum, week) => sum + week.ammount, 0).toFixed(2)}€
                            </strong>
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
        );
}
export default WeeksTableBudget_Est3;