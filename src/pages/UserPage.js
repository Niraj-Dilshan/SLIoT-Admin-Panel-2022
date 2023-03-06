import { Helmet } from 'react-helmet-async';
import { filter, orderBy } from 'lodash';
import { useState, useEffect } from 'react';
import { collection, getDocs , getFirestore, query } from 'firebase/firestore';
import firebase from "firebase/compat/app";
// @mui
import {
  Card,
  Table,
  Stack,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  CircularProgress
} from '@mui/material';
// components
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';

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
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Define initial state for sorting and filtering
  const [sortBy, setSortBy] = useState('fname'); // Default sort by first name
  const [filterBy, setFilterBy] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const db = getFirestore(firebase.app());
        const q = query(collection(db, "user"));
        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          address: doc.data().address,
          elecAccNumber: doc.data().elecAccNumber,
          email: doc.data().email,
          fname: doc.data().fname,
          lname: doc.data().lname,
          nidnum: doc.data().nidnum,
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Filter the data based on the filterBy criteria
  const filteredUsers = filter(users, (user) => {
    const fullName = `${user.fname} ${user.lname}`.toLowerCase();
    return fullName.includes(filterBy.toLowerCase()) || user.email.includes(filterBy.toLowerCase());
  });

  // Define function to handle table header click and change sorting criteria
  const handleSortBy = (id) => {
    setSortBy(id);
  };

  // Sort the filtered data based on the sortBy criteria
  const sortedUsers = sortBy ? orderBy(filteredUsers, sortBy) : filteredUsers;


  if (loading) {
    return <CircularProgress />;
  }

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
        </Stack>

        <Card>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                  sortBy={sortBy}
                  onSortBy={handleSortBy}
                  onFilterBy={setFilterBy}
                />
                <TableBody>
                  {sortedUsers.map(row => (
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