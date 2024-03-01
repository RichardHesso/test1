
import Label from '../../../components/Label'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';

export const getMesTypeLabel = (mesType) => {
  const map = {
    text: {
      text: 'Текстовое сообщение',
      color: 'primary'
    },
    photo: {
      text: 'Фото',
      color: 'warning'
    },
    video: {
      text: 'Видео',
      color: 'warning'
    },
    animation: {
      text: 'Gif',
      color: 'warning'
    },
  };

  const { text, color } = map[mesType];

  return (<>{text}</>)
};


export const getStatusLabel = (status) => {
  console.log(333333333333, status)
    const map = {
      working: {
        text: 'Работает',
        color: 'success'
      },
      stopped: {
        text: 'Остановлена',
        color: 'error'
      },
    };
  
    const { text, color } = map[status];
  
    return (
      <Label color={color}>
        {text}
      </Label>
    );
  };

export const getBoolLabel = (bool) => {
  return bool ? <CheckCircleOutlineIcon style={{color: 'green'}}/> : <CancelIcon style={{color: 'red'}}/>
};

