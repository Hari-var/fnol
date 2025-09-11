import React from 'react';
import '../styles/claimcard.css';
import { useNavigate } from "react-router-dom";

export default function ClaimCard({ claim }) {
    const navigate = useNavigate();
    return(
        <div key={claim.claim_id} className="claim-card" onClick={() => navigate(`/claims/${claim.claim_id}`)}>
            <table>
                <tr>
                    <th>Claim.No</th>
                    <th>Claim Description</th>
                    <th>Date of Incident</th>
                    <th>Raised Date</th>
                    <th>Status</th>
                </tr>
                <tr>
                    <td>{claim.claim_number}</td>
                    <td>{claim.damage_description_user}</td>
                    <td>{claim.date_of_incident}</td>
                    <td>{claim.claim_date}</td>
                    <td>{claim.claim_status}</td>
                </tr>
            </table>
        </div>
    )
}
