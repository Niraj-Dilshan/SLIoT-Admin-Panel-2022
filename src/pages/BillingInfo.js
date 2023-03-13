import { Helmet } from 'react-helmet-async';
import { filter, orderBy } from 'lodash';
import { useState, useEffect } from 'react';
import { collection, getDocs , getFirestore, query , where} from 'firebase/firestore';
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
  TextField,
  Grid,
} from '@mui/material';
// sections
import { UserListHead } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'billing_period_start', label: 'Billing Period Start', alignRight: false },
  { id: 'billing_period_end', label: 'Billing Period End', alignRight: false },
  { id: 'meter_reading_start', label: 'Meter Reading Start', alignRight: false },
  { id: 'meter_reading_end', label: 'Meter Reading End', alignRight: false },
  { id: 'consumption', label: 'Consumption', alignRight: false },
  { id: 'rate_type', label: 'Rate Type', alignRight: false },
  { id: 'rate_charge', label: 'Rate Charge', alignRight: false },
  { id: 'fixed_charges', label: 'Fixed Charges', alignRight: false },
  { id: 'taxes_and_fees', label: 'Taxes and Fees', alignRight: false },
  { id: 'total_charges', label: 'Total Charges', alignRight: false },
  { id: 'past_overdue', label: 'Past Overdue', alignRight: false },
  { id: 'total_amount_due', label: 'Total Amount Due', alignRight: false },
  { id: 'due_date', label: 'Due Date', alignRight: false },
];

// ----------------------------------------------------------------------

export default function BillingInfo() {

  const elecAccNumber = sessionStorage.getItem('elecAccNumber');
  const fname = sessionStorage.getItem('fname');
  const lname = sessionStorage.getItem('lname');

  // Define initial state for loading and users
  const [loading, setLoading] = useState(true);
  const [billing, setbilling] = useState([]);

  // Define initial state for sorting and filtering
  const [sortBy, setSortBy] = useState('fname'); // Default sort by first name
  const [filterBy, setFilterBy] = useState('');

  //  Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //  useEffect to fetch data from firestore
  useEffect(() => {
    const fetchUserBillingData = async () => {
      try {
        const db = getFirestore(firebase.app());
        const q = query(collection(db, "billing"), where("elecAccNumber", "==", elecAccNumber));
        const querySnapshot = await getDocs(q);
        const fetchedBillings = querySnapshot.docs.map(doc => ({
          docID: doc.id,
          billing_period_end: doc.data().billing_period_end.toDate().toLocaleDateString('en-GB'),
          billing_period_start: doc.data().billing_period_start.toDate().toLocaleDateString('en-GB'),
          consumption: doc.data().consumption,
          due_date: doc.data().due_date.toDate().toLocaleDateString('en-GB'),
          elecAccNumber: doc.data().elecAccNumber,
          fixed_charges: doc.data().fixed_charges,
          meter_reading_end: doc.data().meter_reading_end,
          meter_reading_start: doc.data().meter_reading_start,
          past_overdue: doc.data().past_overdue,
          rate_charge: doc.data().rate_charge,
          rate_type: doc.data().rate_type,
          taxes_and_fees: doc.data().taxes_and_fees,
          total_amount_due: doc.data().total_amount_due,
          total_charges: doc.data().total_charges,
        }));
        console.log(fetchedBillings);
        setbilling(fetchedBillings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBillingData();
  }, []);

  //  Filter the data based on the filterBy criteria
  const filteredBillings = filter(billing, (bill) => {
    return bill.billing_period_start.includes(filterBy) || bill.billing_period_end.includes(filterBy);
  });

  // Sort the filtered data based on the sortBy criteria
  const sortedBillings = orderBy(
    filteredBillings,
    [sortBy === 'billing_period_start' ? (bill) => new Date(bill.billing_period_start) : sortBy],
    ['asc']
  );

  //  sorting and pagination
  const sortedBillingForCurrentPage = sortedBillings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  //  Define function to handle table header click and change sorting criteria
  const handleSortBy = (id) => {
    setSortBy(id);
  };

  // Default sort by billing_period_start
  useEffect(() => {
    setSortBy('billing_period_start');
  }, []);

  const handleFilterByChange = (event) => {
    setFilterBy(event.target.value);
    setPage(0); // Reset page number when filter changes
  };

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

  //  set loading
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Helmet>
        <title> Billing | AEMS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Billing History of {fname} {lname}
          </Typography>

          <TextField
            size="small"
            placeholder="Search Billing"
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
                {sortedBillingForCurrentPage.map(row => (
                            <StyledTableRow key={row.id}>
                              <TableCell padding="checkbox">
                                <Checkbox />
                              </TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.billing_period_start}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.billing_period_end}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.meter_reading_start}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.meter_reading_end}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.consumption}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.rate_type}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.rate_charge}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.fixed_charges}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.taxes_and_fees}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.total_charges}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.past_overdue}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.total_amount_due}</TableCell>
                              <TableCell sx={{ py: 2, px: 3 }}>{row.due_date}</TableCell>
                            </StyledTableRow>
                          ))}
              </TableBody>
            </StyledTable>
            <TablePagination
              component="div"
              rowsPerPageOptions={[5, 10, 25]}
              count={sortedBillings.length}
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