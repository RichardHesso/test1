
import {
    Box,
    Card,
    Typography,
    makeStyles
  } from '@material-ui/core';
  import clsx from 'clsx';

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: 7,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    label: {
      marginLeft: theme.spacing(1)
    },
    avatar: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      height: 48,
      width: 48
    },
}))

const CardInfo = ({title, value}) => {

    const classes = useStyles();

    return (
        <Card className={clsx(classes.root)}>
        <Box>
        <Typography
          component="h3"
          gutterBottom
          variant="overline"
          color="textSecondary"
        >
          {title}: {value}
        </Typography>
        {/* <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography
            variant="h3"
            color="textPrimary"
          >
            {value}
          </Typography>
        </Box> */}
      </Box>
    </Card>
    )
}

export default CardInfo;