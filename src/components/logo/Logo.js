import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>

        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
        fill="#000000" stroke="none">
          <path d="M2380 4954 c-367 -42 -603 -107 -880 -245 -725 -361 -1200 -1023
          -1321 -1844 -21 -136 -18 -502 4 -645 57 -365 183 -693 377 -985 l47 -70 -24
          -34 c-41 -61 -67 -163 -60 -245 11 -122 50 -186 220 -353 165 -164 177 -170
          246 -108 21 19 42 35 46 35 5 0 31 -24 60 -52 28 -29 77 -78 108 -108 l57 -54
          55 54 55 55 -112 112 -113 113 42 41 41 42 78 -49 c42 -27 101 -70 129 -96 38
          -35 55 -44 63 -36 8 8 34 1 97 -27 47 -21 85 -39 85 -40 0 -2 -7 -19 -15 -38
          -18 -43 -22 -40 110 -85 789 -267 1634 -120 2285 396 134 107 302 280 407 419
          253 336 404 698 470 1123 24 159 24 509 -1 670 -56 366 -185 701 -386 1000
          l-37 55 24 34 c41 61 67 163 60 245 -11 122 -50 186 -220 354 -166 164 -177
          169 -248 105 l-40 -36 -107 106 c-59 59 -112 107 -117 107 -5 0 -33 -24 -62
          -52 l-53 -53 112 -112 112 -113 -54 -55 -54 -55 -66 63 c-36 34 -88 84 -116
          110 l-51 49 -59 -56 -59 -55 115 -115 114 -116 -37 -38 c-28 -29 -37 -46 -37
          -73 0 -32 14 -48 153 -186 121 -121 165 -158 212 -179 89 -41 214 -44 309 -8
          12 5 21 -6 37 -42 76 -176 138 -410 164 -612 24 -185 17 -516 -14 -687 -87
          -484 -302 -898 -645 -1241 -148 -148 -228 -213 -383 -314 -380 -248 -798 -371
          -1258 -371 -215 0 -364 18 -570 68 l-150 36 -75 73 -75 73 38 38 c28 30 37 47
          37 74 0 32 -13 48 -157 191 -138 135 -166 158 -218 178 -89 34 -187 38 -275
          11 -40 -12 -73 -21 -75 -19 -27 30 -122 193 -171 293 -108 221 -175 436 -211
          684 -22 157 -22 446 2 606 145 999 911 1765 1910 1910 159 24 448 24 606 1
          146 -21 327 -65 451 -110 54 -19 100 -32 102 -28 3 5 16 38 30 75 30 79 39 69
          -114 120 -133 44 -286 81 -420 102 -99 15 -454 28 -530 19z m2034 -649 c42
          -87 29 -184 -31 -255 -52 -60 -104 -84 -183 -84 -87 0 -123 20 -240 138 l-95
          96 170 171 170 170 95 -98 c53 -54 104 -116 114 -138z m-3388 -3173 c22 -11
          82 -64 134 -116 l95 -96 -165 -165 c-91 -91 -168 -165 -171 -165 -16 0 -198
          193 -214 227 -64 134 6 286 155 334 39 13 123 3 166 -19z"/>
          <path d="M2512 4223 c-29 -25 -992 -1955 -992 -1988 0 -14 11 -37 25 -50 l24
          -25 456 0 455 0 0 -615 0 -616 25 -24 c28 -29 70 -32 103 -9 32 22 992 1944
          992 1985 0 18 -9 39 -25 54 l-24 25 -456 0 -455 0 0 615 0 616 -25 24 c-29 30
          -74 33 -103 8z m-9 -1400 c16 -17 52 -18 451 -23 l434 -5 -374 -745 -373 -745
          0 483 -1 483 -25 24 -24 25 -431 0 -430 0 373 745 372 745 5 -485 c5 -448 6
          -486 23 -502z"/>
        </g>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
