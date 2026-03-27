import Geolocation from 'react-native-geolocation-service';

export function getCurrentLocation(retryCount = 0) {

  const MAX_RETRIES = 2;

  return new Promise((resolve, reject) => {

    const options =
      retryCount === 0
        ? {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          }
        : {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 5000,
          };

    Geolocation.getCurrentPosition(

      pos => resolve(pos.coords),

      async error => {

        console.log(
          `Location attempt ${retryCount + 1} failed:`,
          error
        );

        if (error.code === 2) {

          reject({
            type: 'LOCATION_DISABLED',
            originalError: error,
          });

          return;
        }

        if (
          error.code === 3 &&
          retryCount < MAX_RETRIES
        ) {

          try {

            const coords =
              await getCurrentLocation(
                retryCount + 1
              );

            resolve(coords);

          } catch (retryError) {

            reject(retryError);
          }

          return;
        }

        reject(error);
      },

      options
    );
  });
}