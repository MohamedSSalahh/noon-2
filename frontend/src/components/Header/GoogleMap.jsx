import React, { memo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { confirmAddressChanged, updateLocationLatlng } from "../../redux/slices/locationSlice";

const containerStyle = {
  width: '100%',
  height: '100%'
};

const libraries = ["geometry", "drawing", "places"];

const MyMapComponent = (props) => {
    const lat = useSelector(({ locationState }) => locationState.lat);
    const lng = useSelector(({ locationState }) => locationState.lng);
    const addressChanged = useSelector(({ locationState }) => locationState.addressChanged);
    const dispatch = useDispatch();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "", // Note: API key was missing in original code
        libraries: libraries
    })

    const handleMapOnClick = (coord) => {
        dispatch(updateLocationLatlng({
            lat: coord.latLng.lat(),
            lng: coord.latLng.lng(),
        }));
        if (!addressChanged) dispatch(confirmAddressChanged());
    }

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={{lat, lng}}
            zoom={10}
            onClick={handleMapOnClick}
        >
            {props.isMarkerShown && <Marker
                position={{lat, lng}} />}
        </GoogleMap>
    )
}

export default memo(MyMapComponent);