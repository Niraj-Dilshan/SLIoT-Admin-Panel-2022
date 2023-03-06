import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { collection, where, getDocs , getFirestore, query } from 'firebase/firestore';
import firebase from "firebase/compat/app";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fname', label: 'First Name', alignRight: false },
  { id: 'lname', label: 'Last Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'elecAccNumber', label: 'Electricity Account Number', alignRight: false },
  { id: 'nidnum', label: 'National ID Number', alignRight: false },
];

// ----------------------------------------------------------------------

export default function UserPage() {
  const data = [];
  const [users, setUsers] = useState([]);
  const fetchUserData = async () => {
    const db = getFirestore(firebase.app());
    const q = query(collection(db, "user"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const row = {
        id: doc.id,
        address: doc.data().address,
        elecAccNumber: doc.data().elecAccNumber,
        email: doc.data().email,
        fname: doc.data().fname,
        lname: doc.data().lname,
        nidnum: doc.data().nidnum,
      };

      // Add the row to the data array
      data.push(row);
      // setUsers(doc.data());
      // console.log(doc.id, " => ", doc.data());
    });
    setUsers(data);
  };
  
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Helmet>
        <title> Users | AEMS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </Stack>

        <Card>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {users.map(row => (
                              <tr key={row.id}>
                                <TableCell padding="checkbox">
                                  <Checkbox />
                                </TableCell>
                                <td>{row.fname}</td>
                                <td>{row.lname}</td>
                                <td>{row.email}</td>
                                <td>{row.address}</td>
                                <td>{row.elecAccNumber}</td>
                                <td>{row.nidnum}</td>
                              </tr>
                            ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
}