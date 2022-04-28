import React from "react";

const MapGuide = () => {
  return (
    <div className="map-info">
      <div>
        <span className="small"></span> &lt; 3
      </div>
      <div>
        <span className="medium"></span> &lt; 4
      </div>
      <div>
        <span className="large"></span> &lt; 5
      </div>
      <div>
        <span className="xlarge"></span> &lt; 6
      </div>
      <div>
        <span className="xxlarge"></span> &gt; 6
      </div>
    </div>
  );
};

export default MapGuide;
