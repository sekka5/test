import logo from "./logo.svg";
import "./App.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [vehicles, setVehicles] = useState([]);
  const [SortBy, setSortBy] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(
        "https://test.tspb.su/test-task/vehicles"
      );
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleSort = (field) => {
    setSortBy(field);
    const sorted = [...vehicles].sort((a, b) => {
      if (field === "year" || field === "price") {
        return a[field] - b[field];
      }
      return 0;
    });
    setVehicles(sorted);
  };

  const handleEdit = (id, updatedVehicle) => {
    const updatedVehicles = vehicles.map((vehicle) => {
      if (vehicle.id === id) {
        return { ...vehicle, ...updatedVehicle };
      }
      return vehicle;
    });
    setVehicles(updatedVehicles);
  };

  const handleDelete = (id) => {
    const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
    setVehicles(updatedVehicles);
  };

  return (
    <div className="main-container">
      <div className="list">
        <h1>Список автомобилей</h1>
        <div className="sort">
          <button className="sort-button" onClick={() => handleSort("year")}>
            Отсортировать по году выпуска
          </button>
          <button className="sort-button" onClick={() => handleSort("price")}>
            Отсортировать по стоимости
          </button>
        </div>
        <div className="card-container">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
      <div className="map-container">
        <MapContainer
          center={[55.753215, 37.620393]}
          zoom={10}
          style={{ height: "400px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {vehicles.map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[vehicle.latitude, vehicle.longitude]}
            >
              <Popup>
                <div className="card-container">
                  <div className="item">
                    <h3>{vehicle.name}</h3>
                  </div>
                  <div className="item">
                    <p>Модель: {vehicle.model}</p>
                    <p>Год выпуска: {vehicle.year}</p>
                    <p>Цвет: {vehicle.color}</p>
                    <p>Стоимость: {vehicle.price}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState({ ...vehicle });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedVehicle((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onEdit(vehicle.id, editedVehicle);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            name="name"
            value={editedVehicle.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="model"
            value={editedVehicle.model}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            value={editedVehicle.price}
            onChange={handleInputChange}
          />
          <button onClick={handleSave}>Сохранить</button>
        </div>
      ) : (
        <div className="card">
          <div className="card-items">
            <div className="item">
            <p>{vehicle.name}</p>
            </div>
            <div className="item">
            <p>Модель: {vehicle.model}</p>
            </div>
            <div className="item">
            <p>Год выпуска: {vehicle.year}</p>
            </div>
            <div className="item">
            <p>Цвет: {vehicle.color}</p>
            </div>
            <div className="item">
            <p>Стоимость: {vehicle.price}</p>
            </div>

          <button className="sort-button" onClick={() => setIsEditing(true)}>Изменить</button>

          <button className="sort-button" onClick={() => onDelete(vehicle.id)}>Удалить</button>
          </div>

        </div>
      )}
    </div>
  );
};

export default App;
