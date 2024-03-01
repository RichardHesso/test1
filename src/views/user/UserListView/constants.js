
import Label from '../../../components/Label'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';

export const getRoleLabel = (mesType) => {
  const map = {
    admin: {
      text: 'Админ',
      color: 'primary'
    },
    support: {
      text: 'Саппорт',
      color: 'warning'
    },
  };

  const { text, color } = map[mesType];

  return (<>{text}</>)
};


export const getStatusLabel = (status) => {
    const map = {
      created: {
        text: 'Создана',
        color: 'primary'
      },
      progress: {
        text: 'В процессе',
        color: 'warning'
      },
      success: {
        text: 'Успешно',
        color: 'success'
      },
      error: {
        text: 'Ошибка',
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

export const statusIdtoName = {
    'created': 'Создана',
    'click_payed': 'Нажал оплатил',
    'canceled': 'Отменена',
    'success': 'Успешно завершена',
    'error': 'Возникла ошибка',
}

 export const statusNametoId = {
    'Создана': 'created',
    'Нажал оплатил': 'click_payed',
    'Отменена': 'canceled',
    'Успешно завершена': 'success',
    'Возникла ошибка': 'error',
}

export const order_typeIdtoName = typeId => {
    const map = {
        'in': 'Депозит',
        'out': 'Вывод',
    }
    return map[typeId]
}

export const optionsPageSize = [
    {value: '10', label: '10'},
    {value: '25', label: '25'},
    {value: '50', label: '50'},
    {value: '100', label: '100'},
]