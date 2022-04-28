import DataContextProvide from "./context/DataContext";
import Map from "./components/Map";
import MapGuide from "./components/MapGuide";
import Filter from "./components/Filter";

const App = () => {
  return (
    <DataContextProvide>
      <div className="countainer-lg mw-100">
        <div className="row">
          <div className="col-lg-4">
            <Filter />
          </div>
          <div className="col-lg-8 map-container">
            <Map />
            <MapGuide />
          </div>
        </div>
      </div>
    </DataContextProvide>
  );
};

export default App;
