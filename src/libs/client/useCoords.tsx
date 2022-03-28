import { useCallback, useEffect, useState } from "react";

interface ICoordsState {
  latitude: number | null;
  longitude: number | null;
}

export default function useCoords() {
  const [coords, setCoords] = useState<ICoordsState>({
    latitude: null,
    longitude: null,
  });

  const onSuccess = useCallback(
    ({ coords: { latitude, longitude } }: GeolocationPosition) => {
      setCoords({ latitude, longitude });
    },
    []
  );
  const onFailure = useCallback((error: GeolocationPositionError) => {
    console.log("실패 >> ", error);
    // Toast 보여주기
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess, onFailure);
  }, [onSuccess, onFailure]);

  return coords;
}
