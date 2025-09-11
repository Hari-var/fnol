import React from 'react';
import '../styles/vehiclecard.css';
import { useNavigate } from "react-router-dom";

export default function VehicleCard({ vehicle }) {
    const navigate = useNavigate();
    return (
        <div 
            className="vehicle-card" 
            onClick={() => navigate(`/vehicles/${vehicle.vehicle_id}`)}
        >
            <table>
                <thead>
                    <tr>
                        <th>Vehicle No.</th>
                        <th>Vehicle Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{vehicle.vehicle_no}</td>
                        <td>{vehicle.description}</td> {/* assuming API gives description */}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
