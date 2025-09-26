import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCar, FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import '../styles/vehicledetails.css';

export default function VehicleDetails() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://81a531d55958.ngrok-free.app/vehicles/vehicle_details/${vehicleId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch vehicle details");
        }
        return response.json();
      })
      .then((data) => setVehicle(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="vehicle-loading">
        <div className="loading-spinner"></div>
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vehicle-error">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="error-content">
          <h3>Error Loading Vehicle</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return <div className="vehicle-error"><p>No vehicle data found.</p></div>;
  }

  return (
    <div className="vehicle-details-container">
      <div className="vehicle-header-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Assets
        </button>
        <h1>Vehicle Details</h1>
        <div></div>
      </div>

      <div className="vehicle-content">
        {/* Vehicle Overview */}
        <div className="vehicle-card main-card">
          <div className="card-header">
            <div className="vehicle-info">
              <FaCar className="icon" />
              <div>
                <h2>{vehicle.make} {vehicle.model}</h2>
                <span className="vehicle-type">{vehicle.typeofvehicle}</span>
              </div>
            </div>
            <div className="vehicle-number">
              <span className="label">Vehicle Number</span>
              <span className="number">{vehicle.vehicle_no}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="vehicle-card">
          <div className="card-title">
            <FaIdCard className="icon" />
            <h3>Vehicle Information</h3>
          </div>
          <div className="vehicle-details">
            <div className="detail-row">
              <span className="label">VIN:</span>
              <span className="value">{vehicle.vin}</span>
            </div>
            <div className="detail-row">
              <span className="label">Year of Purchase:</span>
              <span className="value">{vehicle.year_of_purchase}</span>
            </div>
            <div className="detail-row">
              <span className="label">Policy ID:</span>
              <span className="value">{vehicle.policy_id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Vehicle ID:</span>
              <span className="value">{vehicle.vehicle_id}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Images */}
        <div className="vehicle-card">
          <div className="card-title">
            <FaCar className="icon" />
            <h3>Vehicle Images</h3>
          </div>
          <div className="images-grid">
            {['front', 'back', 'left', 'right'].map((side) => (
              <div key={side} className="image-card">
                <h4>{side.charAt(0).toUpperCase() + side.slice(1)} View</h4>
                <img
                  src={`https://81a531d55958.ngrok-free.app/vehicles/get_vehicle_image/${vehicle.id}/${side}`}
                  alt={`${side} view`}
                  className="vehicle-image"
                  onError={(e) => {
                    e.target.src = '/placeholder-car.png';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Damage Report */}
        {vehicle.damage_report && (
          <div className="vehicle-card">
            <div className="card-title">
              <FaCalendarAlt className="icon" />
              <h3>Damage Report</h3>
            </div>
            <div className="damage-report">
              <p>{vehicle.damage_report}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}