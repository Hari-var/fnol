import React, { useState, useEffect } from "react";
import "../styles/home.css";

export default function Home(){
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [policyNumber, setPolicyNumber] = useState('');

    const vehicleTypes = [
        {
            id: 1,
            type: "Four Wheeler",
            icon: "🚗",
            startingPrice: "₹2,999/year",
            description: "Complete protection for your car",
            features: ["Third Party Liability", "Own Damage Cover", "Personal Accident", "Zero Depreciation"]
        },
        {
            id: 2,
            type: "Two Wheeler",
            icon: "🏍️",
            startingPrice: "₹899/year",
            description: "Comprehensive bike insurance",
            features: ["Third Party Cover", "Theft Protection", "Accident Cover", "Engine Protection"]
        },
        {
            id: 3,
            type: "Commercial Vehicle",
            icon: "🚛",
            startingPrice: "₹8,999/year",
            description: "Business vehicle protection",
            features: ["Goods Transit", "Driver Coverage", "Third Party Liability", "Breakdown Assistance"]
        }
    ];

    const comingSoon = [
        { name: "Health Insurance", icon: "🏥", eta: "Q2 2024" },
        { name: "Home Insurance", icon: "🏠", eta: "Q3 2024" },
        { name: "Travel Insurance", icon: "✈️", eta: "Q4 2024" }
    ];

    const handlePolicySearch = (e) => {
        e.preventDefault();
        alert(`Searching for policy: ${policyNumber}`);
    };

    return(
        <div className="main-content">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Drive Safe, Stay Protected</h1>
                        <p>India's most trusted auto insurance platform with instant policy issuance and hassle-free claims</p>
                        <div className="cta-buttons">
                            <button className="primary-cta">Get Instant Quote</button>
                            <button className="secondary-cta">Renew Policy</button>
                        </div>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">50L+</span>
                            <span className="stat-label">Policies Sold</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">98.5%</span>
                            <span className="stat-label">Claim Settlement</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Support</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Policy Search */}
            <section className="policy-search">
                <div className="search-container">
                    <h2>Find Your Policy</h2>
                    <form onSubmit={handlePolicySearch} className="search-form">
                        <input 
                            type="text" 
                            placeholder="Enter Policy Number or Vehicle Registration" 
                            value={policyNumber}
                            onChange={(e) => setPolicyNumber(e.target.value)}
                            required
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </section>

            {/* Vehicle Types */}
            <section className="vehicle-types">
                <h2>Choose Your Vehicle Type</h2>
                <div className="vehicle-grid">
                    {vehicleTypes.map(vehicle => (
                        <div key={vehicle.id} className="vehicle-card">
                            <div className="vehicle-icon">{vehicle.icon}</div>
                            <h3>{vehicle.type}</h3>
                            <p className="vehicle-desc">{vehicle.description}</p>
                            <div className="price-tag">Starting from {vehicle.startingPrice}</div>
                            <ul className="feature-list">
                                {vehicle.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                            <button 
                                className="quote-btn"
                                onClick={() => setSelectedVehicle(vehicle)}
                            >
                                Get Quote
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-choose">
                <h2>Why Choose AutoSecure?</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-icon">⚡</div>
                        <h3>Instant Policy</h3>
                        <p>Get your policy issued within 2 minutes</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">💰</div>
                        <h3>Best Prices</h3>
                        <p>Compare and get the lowest premium rates</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">🛠️</div>
                        <h3>Easy Claims</h3>
                        <p>Cashless repairs at 5000+ garages</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">📱</div>
                        <h3>Digital First</h3>
                        <p>Complete paperless experience</p>
                    </div>
                </div>
            </section>

            {/* Coming Soon */}
            <section className="coming-soon">
                <h2>Coming Soon</h2>
                <div className="coming-soon-grid">
                    {comingSoon.map((item, index) => (
                        <div key={index} className="coming-soon-card">
                            <div className="coming-icon">{item.icon}</div>
                            <h3>{item.name}</h3>
                            <span className="eta-badge">{item.eta}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quote Modal */}
            {selectedVehicle && (
                <div className="modal-overlay" onClick={() => setSelectedVehicle(null)}>
                    <div className="quote-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Get Quote for {selectedVehicle.type}</h3>
                            <button className="close-btn" onClick={() => setSelectedVehicle(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="vehicle-summary">
                                <span className="modal-icon">{selectedVehicle.icon}</span>
                                <div>
                                    <h4>{selectedVehicle.type}</h4>
                                    <p>{selectedVehicle.startingPrice}</p>
                                </div>
                            </div>
                            <div className="quote-form">
                                <input type="text" placeholder="Vehicle Registration Number" />
                                <select>
                                    <option>Select Vehicle Make</option>
                                    <option>Maruti Suzuki</option>
                                    <option>Hyundai</option>
                                    <option>Tata</option>
                                </select>
                                <button className="get-quote-btn">Get Instant Quote</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}