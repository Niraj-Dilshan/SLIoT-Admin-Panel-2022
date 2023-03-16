import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// firebase
import { collection, getDocs , getFirestore, query, where, and} from 'firebase/firestore';
import firebase from "firebase/compat/app";

// Rect
import { useState, useEffect } from 'react';

// sections
import {
  AppWidgetSummary,
  AppDistricts,
  AppSystemUpdate,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {

  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [userCountsByDistrict, setUserCountsByDistrict] = useState({});
  const [error, setError] = useState(0);
  const [errorMessageTitle, setErrorMessageTitle] = useState("");
  const [errorMessageBody, setErrorMessageBody] = useState("");
  const [errorImage, setErrorImage] = useState("");
  const [errorPostedAt, setErrorPostedAt] = useState("");

  const db = getFirestore(firebase.app());
  const userCollectionRef = query(collection(db, "user"));
  const errorCollectionRef = query(collection(db, "fault"), where("fault", "==", "1"));
  
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

  useEffect(() => {
    const fetchFaultData = async () => {
      const currentTime = new Date();
      try {
        const faultSnapshot = await getDocs(errorCollectionRef);
        const fetchedfaults = faultSnapshot.docs.map(doc => ({
          id: doc.id,
          elecAccNumber: doc.data().elecAccNumber,
          faults: doc.data().fault,
        }));
        if (fetchedfaults.length > 0) {
          setError(1);
          const firstFault = fetchedfaults[0];
          const firstHouseEnum = firstFault.elecAccNumber;
          console.log(firstHouseEnum);
          const houseinfoCollectionRef = query(collection(db, "houseinfo"), where("elecAccNumber", "==", firstHouseEnum));
          const houseinfoSnapshot = await getDocs(houseinfoCollectionRef);
          const fetchedHouseinfo = houseinfoSnapshot.docs.map(doc => ({
            id: doc.id,
            elecAccNumber: doc.data().elecAccNumber,
            phase: doc.data().phase,
            transformer_id: doc.data().transformer_id,
          }));
          console.log(fetchedHouseinfo.length);
          const firstHouseinfo = fetchedHouseinfo[0];
          console.log(firstHouseinfo);
          const firstHousePhase = firstHouseinfo.phase;
          const firstHouseTransformerId = firstHouseinfo.transformer_id;
          const secondHouseSamePhaseRf = query(collection(db, "houseinfo"), where("transformer_id", "==", firstHouseTransformerId), where ("phase", "==", firstHousePhase), where ("elecAccNumber", "!=", firstHouseEnum));
          const secondHouseSameSnapshot = await getDocs(secondHouseSamePhaseRf);
          const fetchedsecondHouseSame = secondHouseSameSnapshot.docs.map(doc => ({
            id: doc.id,
            elecAccNumber: doc.data().elecAccNumber,
            phase: doc.data().phase,
            transformer_id: doc.data().transformer_id,
          }));
          if(fetchedsecondHouseSame.length > 0){
            const otherHouseInSamePhase = fetchedsecondHouseSame[0];
            const otherHouseInSamePhaseElecAccNumber = otherHouseInSamePhase.elecAccNumber;
            console.log(otherHouseInSamePhaseElecAccNumber);
            const otherHouseInSamePhaseFaultCheck = query(collection(db, "fault"), where ("elecAccNumber", "==", otherHouseInSamePhaseElecAccNumber), where ("fault", "==", "1"));
            const otherHouseInSamePhaseFaultSnapshot = await getDocs(otherHouseInSamePhaseFaultCheck);
            const fetchedOtherHouseInSamePhaseFault = otherHouseInSamePhaseFaultSnapshot.docs.map(doc => ({
              id: doc.id,
              elecAccNumber: doc.data().elecAccNumber,
              faults: doc.data().fault,
            }));
            console.log(fetchedOtherHouseInSamePhaseFault.length);
            if(fetchedOtherHouseInSamePhaseFault.length > 0){
              const phaseFaultLookUP = query(collection(db, "houseinfo"), where("transformer_id", "==", firstHouseTransformerId), where ("phase", "!=", firstHousePhase));
              const phaseFaultLookUPSnapshot = await getDocs(phaseFaultLookUP);
              const fetchedPhaseFaultLookUP = phaseFaultLookUPSnapshot.docs.map(doc => ({
                id: doc.id,
                elecAccNumber: doc.data().elecAccNumber,
                phase: doc.data().phase,
                transformer_id: doc.data().transformer_id,
              }));
              console.log(fetchedPhaseFaultLookUP.length);
              const otherHouseInDifferentPhase = fetchedPhaseFaultLookUP[0];
              const otherHouseInDifferentPhaseElecAccNumber = otherHouseInDifferentPhase.elecAccNumber;
              const otherHouseInDifferentPhaseFaultCheck = query(collection(db, "fault"), where("elecAccNumber", "==", otherHouseInDifferentPhaseElecAccNumber), where ("fault", "==", "1"));
              const otherHouseInDifferentPhaseFaultSnapshot = await getDocs(otherHouseInDifferentPhaseFaultCheck);
              const fetchedOtherHouseInDifferentPhaseFault = otherHouseInDifferentPhaseFaultSnapshot.docs.map(doc => ({
                id: doc.id,
                elecAccNumber: doc.data().elecAccNumber,
                faults: doc.data().fault,
              }));
              if(fetchedOtherHouseInDifferentPhaseFault.length > 0){
                setErrorMessageTitle(`Power Failure In transformer ID:${firstHouseTransformerId}`);
                setErrorMessageBody(`Failure is in ID:${firstHouseTransformerId} transformer`);
                setErrorImage("/assets/images/covers/cover_14.jpg");
                setErrorPostedAt(currentTime);
              }else{
                setErrorMessageTitle(`Power Failure In phase ${firstHousePhase}`);
                setErrorMessageBody(`Failure is in ID:${firstHouseTransformerId} phase ${firstHousePhase}`);
                setErrorImage("/assets/images/covers/cover_14.jpg");
                setErrorPostedAt(currentTime);
              }
            }else{
              setErrorMessageTitle(`Power Failure In user ${firstHouseEnum}`);
              setErrorMessageBody("Failure is in house");
              setErrorImage("/assets/images/covers/cover_14.jpg");
              setErrorPostedAt(currentTime);
            }
          }else{
            setErrorMessageTitle(`Power Failure In user ${firstHouseEnum}`);
            setErrorMessageBody("Error is unknown. Because Insufficient data");
            setErrorImage("/assets/images/covers/cover_14.jpg");
            setErrorPostedAt(currentTime);
          }
        }else{
          setError(0);
          setErrorMessageTitle(`No Failure In System`);
          setErrorMessageBody("System is working fine");
          setErrorImage("/assets/images/covers/cover_23.jpg");
          setErrorPostedAt(currentTime);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFaultData();
  }, [error]);

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
            <AppWidgetSummary title="New Users" total={userCount} color="primary" icon={<PersonAddAltIcon/>} />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary title="Total Users" total={userCount} color="primary" icon={<PeopleAltIcon/>} />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppSystemUpdate
              title="System Updates"
              list={[
                {
                  id: 1,
                  title: errorMessageTitle,
                  description: errorMessageBody,
                  image: errorImage,
                  postedAt: errorPostedAt,
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