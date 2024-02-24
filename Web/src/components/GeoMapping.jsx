import React from "react";

const GeoMapping = ({ latitude, longitude }) => {
  const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-grey&width=600&height=300&center=lonlat:${longitude},${latitude}&zoom=15&marker=lonlat:${longitude},${latitude};size:large&apiKey=f9351bb499d244a8b43036c84893a902`;
  return (
    <div>
      <img src={mapUrl} alt="Map" />
    </div>
  );
};

export default GeoMapping;
