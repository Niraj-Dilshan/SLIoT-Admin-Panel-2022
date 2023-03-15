// @mui
import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Divider, Typography, CardHeader } from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Scrollbar from '../../../components/scrollbar';

// ----------------------------------------------------------------------

AppSystemUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppSystemUpdate({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((news) => (
            <NewsItem key={news.id} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />
    </Card>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    postedAt: PropTypes.instanceOf(Date),
    title: PropTypes.string,
  }),
};

function NewsItem({ news }) {
  const { image, title, description, postedAt } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box component="img" alt={title} src={image} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {title}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fToNow(postedAt)}
      </Typography>
    </Stack>
  );
}
