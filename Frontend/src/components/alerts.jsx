// src/components/Alerts.jsx
import React, { useEffect, useState } from 'react';
import {useUser} from '../context/user-context';
import { constrainedMemory } from 'process';
const Alerts = () => {
    const {profile} = useUser();
    const storename = profile.storename;
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await fetch(`http://localhost:YOUR_PORT/${storename}/alerts`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAlerts(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, [storename]);

    if (loading) return <p>Loading alerts...</p>;
    if (error) return <p>Error fetching alerts: {error}</p>;

    return (
        <div>
            <h2>Alerts</h2>
            {alerts.length === 0 ? (
                <p>No alerts found.</p>
            ) : (
                <ul>
                    {alerts.map(alert => (
                        <li key={alert.alertID}>
                            <strong>Product ID:</strong> {alert.productID} <br />
                            <strong>Product Name:</strong> {alert.productName} <br />
                            <strong>Expiry Date:</strong> {alert.expiryDate} <br />
                            <strong>Alert Date:</strong> {alert.alertDate} <br />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Alerts;