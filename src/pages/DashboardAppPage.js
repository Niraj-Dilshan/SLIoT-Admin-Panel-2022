import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// firebase
import { collection, getDocs , getFirestore, query, setDoc, doc } from 'firebase/firestore';
import firebase from "firebase/compat/app";

// lodash
// import { groupBy} from "lodash";

// Rect
import { useState, useEffect } from 'react';

// sections
import {
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