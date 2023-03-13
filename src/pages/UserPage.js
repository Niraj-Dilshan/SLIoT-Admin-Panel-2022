import { Helmet } from 'react-helmet-async';
import { filter, orderBy } from 'lodash';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs , getFirestore, query } from 'firebase/firestore';
import firebase from "firebase/compat/app";
// @mui
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import {
  Card,
  Table,
  Stack,
  Paper,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  CircularProgress,
  TablePagination,
  InputAdornment, 
  TextField
} from '@mui/material';
// sections
import { UserListHead } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fname', label: 'First Name', alignRight: false },
  { id: 'lname', label: 'Last Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'elecAccNumber', label: 'Electricity Account Number', alignRight: false },
  { id: 'nidnum', label: 'National ID Card Number', alignRight: false },
];

// ----------------------------------------------------------------------

export default function UserPage() {
  // Define initial state for loading and users
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Define initial state for sorting and filtering
  const [sortBy, setSortBy] = useState('fname'); // Default sort by first name
  const [filterBy, setFilterBy] = useState('');

  //  Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //  History
  const navigate = useNavigate();

  //  useEffect to fetch data from firestore
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

  //  Filter the data based on the filterBy criteria
  const filteredUsers = filter(users, (user) => {
    const fullName = `${user.fname} ${user.lname}`.toLowerCase();
    return fullName.includes(filterBy.toLowerCase()) || user.email.includes(filterBy.toLowerCase()) || user.elecAccNumber.includes(filterBy.toLowerCase()) || user.nidnum.includes(filterBy.toLowerCase());
  });

  //  Define function to handle table header click and change sorting criteria
  const handleSortBy = (id) => {
    setSortBy(id);
  };

  //  Sort the filtered data based on the sortBy criteria
  const sortedUsers = sortBy ? orderBy(filteredUsers, sortBy) : filteredUsers;

  //  styling for table
  const StyledTableContainer = styled(TableContainer)(
    ({ theme }) => ({
      '&::-webkit-scrollbar': {
        width: '0.4em',
        height: '0.4em',
      },
      '&::-webkit-scrollbar-track': {
        borderRadius: '8px',
        backgroundColor: theme.palette.grey[100],
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: '8px',
        backgroundColor: theme.palette.grey[500],
      },
    }),
  );
  //  styling for table
  const StyledTable = styled(Table)(
    ({ theme }) => ({
      '& th': {
        fontWeight: 'bold',
        backgroundColor: theme.palette.grey[100],
        borderBottom: 'none',
      },
      '& th:first-child, & td:first-child': {
        paddingLeft: theme.spacing(3),
      },
      '& td': {
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
      },
      '& td:last-child': {
        paddingRight: theme.spacing(3),
      },
      '& tr:last-child td': {
        borderBottom: 'none',
      },
    }),
  );
  //  styling for table
  const StyledTableRow = styled(TableRow)(
    ({ theme }) => ({
      '& td': {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
      },
      '& td:first-child': {
        paddingLeft: theme.spacing(3),
      },
      '& td:last-child': {
        paddingRight: theme.spacing(3),
      },
    }),
  );
  //  sorting and pagination
  const sortedUsersForCurrentPage = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleFilterByChange = (event) => {
    setFilterBy(event.target.value);
    setPage(0); // Reset page number when filter changes
  };

  const handleRowClick = (row) => {
    sessionStorage.setItem('elecAccNumber', row.elecAccNumber);
    sessionStorage.setItem('fname', row.fname);
    sessionStorage.setItem('lname', row.lname);
    sessionStorage.setItem('email', row.email);
    sessionStorage.setItem('address', row.address);
    sessionStorage.setItem('nidnum', row.nidnum);
    navigate(`/dashboard/info`);
  };

  //  set loading
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Helmet>
        <title> User | AEMS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>

          <TextField
            size="small"
            placeholder="Search users"
            value={filterBy}
            onChange={handleFilterByChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Stack>

        <Card>
          <StyledTableContainer component={Paper}>
            <StyledTable> 
              <UserListHead
                headLabel={TABLE_HEAD}
                sortBy={sortBy}
                onSortBy={handleSortBy}
                onFilterBy={setFilterBy}
              />
              <TableBody>
                {sortedUsersForCurrentPage.map(row => (
                            <StyledTableRow key={row.id} onClick={() => handleRowClick(row)}>
                              <TableCell padding="checkbox">
                                <Checkbox />
                              </TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.fname}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.lname}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.email}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.address}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.elecAccNumber}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.nidnum}</TableCell>
                            </StyledTableRow>
                          ))}
              </TableBody>
            </StyledTable>
            <TablePagination
              component="div"
              rowsPerPageOptions={[5, 10, 25]}
              count={sortedUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </StyledTableContainer>
        </Card>
      </Container>
    </>
  );
}