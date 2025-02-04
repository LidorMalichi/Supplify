import Toast from 'react-native-toast-message';

// Toast promise wrapper
export const ToastPromise = <T>(
    apiCall: Promise<T>,
    {
      loading = 'Loading...',
      success = 'Success!',
      error = 'Error occurred',
    } = {}
  ) => {
    Toast.show({
      type: 'info',
      text1: loading,
      position: 'bottom',
      autoHide: false,
    });
  
    return apiCall
      .then((response) => {
        Toast.hide();
        Toast.show({
          type: 'success',
          text1: success,
          position: 'bottom',
          autoHide: true,
          visibilityTime: 2000,
        });
        return response;
      })
      .catch((err) => {
        Toast.hide();
        Toast.show({
          type: 'error',
          text1: error,
          position: 'bottom',
          autoHide: true,
          visibilityTime: 3000,
        });
        throw err;
      });
  };