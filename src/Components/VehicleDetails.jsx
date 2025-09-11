import React,{useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/style.css'
import '../styles/vehicledetails.css'

export default function VehicleDetails() {
    const { vehicleId } = useParams(); // get vehicle id from URL
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/vehicles/vehicle_details/${vehicleId}`,{
            method: "GET",
            credentials: "include",
        }).then((response) => {
            if (!response.ok) {
          throw new Error("Failed to fetch vehicle details");
        }
        return response.json();
      })
      .then((data) => setVehicle(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    },[vehicleId]);

    if (loading) {
    return <p>Loading vehicle details...</p>;
  }

  if (error) {
    return (
      <div className="vehicle-error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!vehicle) {
    return <p>No vehicle data found.</p>;
  }
  return(
    <div className="vehicle-details-container">
        <h2>Vehicle Details</h2>
        <p><strong>ID:</strong> {vehicle.id}</p>
        <p><strong>Make:</strong> {vehicle.make}</p>
        <p><strong>Model:</strong> {vehicle.model}</p>
        <p><strong>Year:</strong> {vehicle.year}</p>
        <p><strong>Price:</strong> ${vehicle.price}</p>
    </div>
  )
}