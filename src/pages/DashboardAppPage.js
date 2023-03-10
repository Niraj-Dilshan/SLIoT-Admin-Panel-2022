import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { Grid, Container, Typography } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// firebase
import { collection, getDocs , getFirestore, query } from 'firebase/firestore';
import firebase from "firebase/compat/app";

// Rect
import { useState, useEffect } from 'react';

// sections
import {
  AppNewsUpdate,
  AppWebsiteVisits,
  AppWidgetSummary,
  AppDistricts,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {

  const [users, setUsers] = useState([]);
  const [entryList, setEntryList] = useState([{}]);
  const [userCount, setUserCount] = useState(0);
  const [userCountsByDistrict, setUserCountsByDistrict] = useState({});

  const db = getFirestore(firebase.app());
  const entryCollectionRef = query(collection(db, "entry"));
  const userCollectionRef = query(collection(db, "user"));
  
  useEffect(() => {
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
  }, []);

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
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
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

          <Grid item xs={12} md={6} lg={6}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}