import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ICoordsState {
  latitude: number | null;
  longitude: number | null;
}

export default function useCoords(warningText: string) {
  const [coords, setCoords] = useState<ICoordsState>({
    latitude: null,
    longitude: null,
  });

  const onSuccess = useCallback(
    ({ coords: { latitude, longitude } }: GeolocationPosition) =>
      setCoords({ latitude, longitude }),
    []
  );
  const onFailure = useCallback(
    (error: GeolocationPositionError) => toast.warning(warningText),
    [warningText]
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess, onFailure);
  }, [onSuccess, onFailure]);

  return coords;
}
