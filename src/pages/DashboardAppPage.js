import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// firebase
import { collection, getDocs , getFirestore, query } from 'firebase/firestore';
import firebase from "firebase/compat/app";

// lodash
// import { groupBy} from "lodash";

// Rect
import { useState, useEffect } from 'react';

// sections
import {
  AppVoltages,
  AppWidgetSummary,
  AppDistricts,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {

  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [userCountsByDistrict, setUserCountsByDistrict] = useState({});
  // const [chartData, setChartData] = useState([]);
  // const [chartLabels, setChartLabels] = useState([]);

  const db = getFirestore(firebase.app());
  // const entryLastdayRef = query(collection(db, "entry"), orderBy('date', 'desc'), limit(1));
  const userCollectionRef = query(collection(db, "user"));
  
  useEffect( () => {
    const fetchUserData = async () => {
      try {
        const userSnapshot = await getDocs(userCollectionRef);
        const fetchedUsers = userSnapshot.docs.map(doc => ({
          id: doc.id,
          address: doc.data().address,
          elecAccNumber: doc.data().elecAccNumber,
          email: doc.data().email,
          fname: doc.data().fname,
          lname: doc.data().lname,
          nidnum: doc.data().nidnum,
          district: doc.data().district,
        }));

        const countsByDistrict = fetchedUsers.reduce((counts, user) => {
          counts[user.district] = (counts[user.district] || 0) + 1;
          return counts;
        }, {});

        setUsers(fetchedUsers);
        setUserCount(fetchedUsers.length);
        setUserCountsByDistrict(countsByDistrict);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  },[]);

  // const getLastEntryDate = async () => {
  //   const querySnapshot = await getDocs(entryLastdayRef);    
  //   const lastEntry = querySnapshot.docs[0];
  //   const date = lastEntry?.data()?.date;
  //   return date;
  // };
  
  // // Get the last 10 days of entries from the database
  // const getLastTenDaysEntries = async () => {
  //   const lastEntryDate = await getLastEntryDate();
  //   console.log(lastEntryDate);
  //   const parts = lastEntryDate.split('-');
  //   const year = parseInt(parts[2], 10);
  //   const month = parseInt(parts[1], 10) - 1; // subtract 1 since month is zero-indexed
  //   const day = parseInt(parts[0], 10);
  //   const date = new Date(year, month, day);
  //   const tenDaysAgo = new Date(date- (9 * 24 * 60 * 60 * 1000));
  //   console.log(tenDaysAgo);
  //   const tenDaysAgoString = `${tenDaysAgo.toISOString().substring(8, 10)}-${tenDaysAgo.toISOString().substring(5, 7)}-${tenDaysAgo.toISOString().substring(0, 4)}`;

  //   console.log(tenDaysAgoString);
  //   const entryLastTendaysRef = query(collection(db, "entry"),where('date', '>=', tenDaysAgoString));
  //   const querySnapshot = await getDocs(entryLastTendaysRef);
  
  //   const entries = querySnapshot.docs.map(doc => doc.data());
  //   const groupedEntries = groupBy(entries, 'date');
  //   const chartData = Object.keys(groupedEntries).sort().map(date => {
  //     const entriesForDate = groupedEntries[date];
  //     const avgVoltage = entriesForDate.reduce((sum, entry) => {
  //       const max = parseFloat(entry.DayMaxVoltage);
  //       const min = parseFloat(entry.DayMinVoltage);
  //       return sum + ((max + min) / 2);
  //     }, 0) / entriesForDate.length;
  //     return { date, avgVoltage: Math.round(avgVoltage) };
  //   });
  //   const chartValues = chartData.map(({ avgVoltage }) => avgVoltage);
  // };

  // const fetchLastTenDaysEntries = async () => {
  //   await getLastTenDaysEntries();
  // };

  // fetchLastTenDaysEntries();

  // const dates = chartData.map(({ date }) => date);
  // console.log(dates);

  // const voltages = chartData.map(({ avgVoltage }) => avgVoltage);
  // console.log(voltages);

  return (
    <>
      <Helmet>
        <title> Dashboard | AEMS </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back to AEMS, 
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary title="New Users" total={userCount} color="warning" icon={<PersonAddAltIcon/>} />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary title="Total Users" total={userCount} color="warning" icon={<PeopleAltIcon/>} />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppVoltages
              title="Average Voltage Supply"
              chartLabels={[
                '10-01-2023',
                '10-02-2023',
                '10-03-2023',
                '10-04-2023',
                '10/05/2023',
                '10/06/2023',
                '10/07/2023',
                '10/08/2023',
                '10/09/2023',
                '10/10/2023',
                '10/11/2023',
              ]}
              chartData={[
                {
                name: 'Voltage',
                type: 'column',
                fill: 'solid',
                data: [226,227,230,225,228,229,226,227,229,231,225],
              },
            ]}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppDistricts
              title="Categorize Users by District"
              chartData={Object.entries(userCountsByDistrict).map(([district, count]) => ({
                label: district,
                value: count
              }))}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}