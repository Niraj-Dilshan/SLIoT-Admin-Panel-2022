// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'users',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'billing',
    path: '/dashboard/billing',
    icon: icon('i-billing'),
  },
];

export default navConfig;
