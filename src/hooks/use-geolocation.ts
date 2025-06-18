import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeolocationState {
    coordinates: Coordinates | null;
    error: string | null;
    isLoading: boolean;

}
export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  const getLocation=()=>{
    setLocationData((prev)=>({
      ...prev,
      isLoading: true,
      error: null,
    }))
// if user location is not available, set error message
    if(!navigator.geolocation) {
      setLocationData({
        coordinates: null,
        isLoading: false,
        error: "Geolocation is not supported by this browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Set the coordinates in the state
        setLocationData({
          coordinates: { 
            lat:position.coords.latitude,
            lon: position.coords.longitude
           },
          isLoading: false,
          error: null,
        });
      },
     (error) => {
        let errorMessage: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }

          setLocationData({
          coordinates: null,
          error: errorMessage,
          isLoading: false,
        });
      },{
        enableHighAccuracy: true,
        timeout: 5000, // 10 seconds
        maximumAge: 0, // Do not use cached position

      }
    );
  }

    // Get location on component mount
  useEffect(() => {
    getLocation();
  }, []);

  return{
    ...locationData,
    getLocation,
  }

}