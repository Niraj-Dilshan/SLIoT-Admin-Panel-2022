import { collection, getDocs , getFirestore } from 'firebase/firestore';
import firebase from "firebase/compat/app";
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import {
  Stack,
  Container,
  Typography,
} from '@mui/material';

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';

import {Bar} from 'react-chartjs-2';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
  )

export default function UserInfo() {

    const elecAccNumber = sessionStorage.getItem('elecAccNumber');
    const fname = sessionStorage.getItem('fname');
    const lname = sessionStorage.getItem('lname');
    const email = sessionStorage.getItem('email');
    const address = sessionStorage.getItem('address');
    const nidnum = sessionStorage.getItem('nidnum');

    const db = getFirestore(firebase.app());

    const entryCollectionRef = collection(db, "entry");

    const [entryList, setEntryList] = useState([{}]);

    useEffect(() =>{
        const getEntry = async () => {
          const _data_ = await getDocs(entryCollectionRef);

          const filteredData = _data_.docs.filter(doc => {
            return doc.data().elecAccNumber === elecAccNumber;
          });

          if (filteredData.length) {
            setEntryList(filteredData.map(doc => ({ ...doc.data(), id:doc.id})));
          }else{
            console.log("No data found");
          }
        }
      
        getEntry();
      }, [])
    
      const OutputMaxVoltage = entryList.reduce((prevValue, { date, DayMaxVoltage }) => {
        prevValue[date] = typeof DayMaxVoltage === "string" ? JSON.parse(DayMaxVoltage) : DayMaxVoltage
        return prevValue;
    }, {});
    
    const maxVoltage = Math.max(...Object.values(OutputMaxVoltage));
    
    const OutputMinVoltage = entryList.reduce((prevValue, { date, DayMinVoltage }) => {
      prevValue[date] = typeof DayMinVoltage === "string" ? JSON.parse(DayMinVoltage) : DayMinVoltage
      return prevValue;
    }, {});
    
    const minVoltage = Math.max(...Object.values(OutputMinVoltage));
    
    const OutputTotRealPower = entryList.reduce((prevValue, { date, DayTotRealPower }) => {
      prevValue[date] = typeof DayTotRealPower === "string" ? JSON.parse(DayTotRealPower) : DayTotRealPower
      return prevValue;
    }, {});
    
    const OutputTotApperentPower = entryList.reduce((prevValue, { date, DaytotapparentPower }) => {
      prevValue[date] = typeof DaytotapparentPower === "string" ? JSON.parse(DaytotapparentPower) : DaytotapparentPower
      return prevValue;
    }, {});
    
    let keys = Object.keys(OutputTotRealPower);
    keys.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      return 0;
    });
    let lastIndex = keys.length - 1;
    const LastRealDayKey = keys[0];
    const CurrentRealDayValue = OutputTotRealPower[LastRealDayKey];
    
    keys = Object.keys(OutputTotApperentPower);
    
    keys.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      return 0;
    });
    
    lastIndex = keys.length - 1;
    const LastAppDayKey = keys[0];
    const CurrentAppDayValue = OutputTotApperentPower[LastAppDayKey];
    
    const OutputTotRealPowerValues = Object.values(OutputTotRealPower);
    const OutputTotRealPowerSum = OutputTotRealPowerValues.reduce((a, b) => a + b, 0);
    
    const OutputTotApperentPowerValues = Object.values(OutputMaxVoltage);
    const OutputTotApperentPowerSum = OutputTotApperentPowerValues.reduce((a, b) => a + b, 0);
    
    let price;
    
    if (OutputTotRealPowerSum > 180) {
      price = 75 * OutputTotRealPowerSum + 1500;
    } else if (OutputTotRealPowerSum > 120) {
      price = 50 * OutputTotRealPowerSum + 960;
    } else if (OutputTotRealPowerSum > 60) {
      price = 16 * OutputTotRealPowerSum + 360;
    } else if (OutputTotRealPowerSum > 30) {
      price = 10 * OutputTotRealPowerSum + 240;
    } else {
      price = 8 * OutputTotRealPowerSum + 120;
    }    
    
    const lastTenDates = Object.keys(OutputMaxVoltage).sort().slice(-6);
    const TotRealPowData={
      labels: lastTenDates,
      datasets: [
        {
          label: 'Total Real Power',
          data: lastTenDates.map(date => OutputTotRealPower[date]),
          backgroundColor: 'aqua',
          borderColor: 'black',
          borderWidth: 1,
        },
      ]
    };
    
    
    const latestDates = Object.keys(OutputMaxVoltage).sort().slice(-6);
    const TotApprPowData={
    labels: latestDates,
    datasets: [
        {
        label: 'Total Apparent Power',
        data: latestDates.map(date => OutputTotApperentPower[date]),
        backgroundColor: 'green',
        borderColor: 'black',
        borderWidth: 1,
        },
    ]
    };

    const options={

    };

    const FormattedNumber = ({ value }) => {
      const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
      });
    
      return <>{formatter.format(value)}</>;
    };
    

    return (
        <>
        <Helmet>
            <title> User's Info | AEMS </title>
        </Helmet>

        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
                User's Info
            </Typography>
            </Stack>
            <card>
                <cardHeader title="User's Info" />
                <cardContent>
                    <Typography variant="h6" gutterBottom>
                        Account Number: {elecAccNumber}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        First Name: {fname}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Last Name: {lname}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Email: {email}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Address: {address}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        NID Number: {nidnum}
                    </Typography>
                </cardContent>
                <center>  
                    <div style={
                        {padding: '20px', backgroundColor:'#f2f2f2', borderRadius:"15px"}
                        }>
                    <h3>Daily Energy Consumption</h3>
                    <Bar
                        data={TotRealPowData}
                        options={options}
                        className="mb-4"
                    />
                    </div>
                    <br/>
                    <div style={
                        {padding: '20px', backgroundColor:'#f2f2f2', borderRadius:"15px"}
                        }>
                    <h3>Daily Apperent Power Consumption</h3>
                        <Bar
                        data={TotApprPowData}
                        options={options}
                        className="mb-4"
                        />
                    </div>
                    <br/>
                </center>
                <Typography variant="h5" gutterBottom>
                  {`Daily Avg PF: ${(Math.cos(CurrentAppDayValue/CurrentRealDayValue)).toFixed(2)}`}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {`Daily Minimum Voltage: ${minVoltage}`}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {`Daily Minimum Voltage: ${maxVoltage}`}
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Price For Current Usage: <FormattedNumber value={price}/>
                </Typography>
            </card>
        </Container>
        </>
    );
}