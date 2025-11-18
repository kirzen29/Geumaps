// src/App.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// IMPORT THE NEW LOCATION MARKER COMPONENT
import { LocationMarker } from './locationmarker.js'; 

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks for adding buildings
function AddMarker({ setPosition, setShowForm }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setShowForm(true);
        },
    });
    return null;
}

export default function App() {
    const [buildings, setBuildings] = useState([]);
    const [newPos, setNewPos] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    // Form inputs
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Initial default center for the map before geolocation loads
    const defaultCenter = [28.7041, 77.1025]; // Delhi coordinates

    // 1. Database Listener (IP Location logic removed)
    useEffect(() => {
        // Real-time Database Listener
        const unsubscribe = onSnapshot(collection(db, "buildings"), (snapshot) => {
            const buildingsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setBuildings(buildingsData);
        });

        return () => unsubscribe();
    }, []);

    // 2. Add Building Function
    const handleAddBuilding = async (e) => {
        e.preventDefault();
        if (!newPos) return;
        await addDoc(collection(db, "buildings"), {
            name,
            description,
            lat: newPos.lat,
            lng: newPos.lng
        });
        setShowForm(false);
        setName("");
        setDescription("");
    };

    // 3. Edit Description Function
    const handleUpdate = async (id, newDesc) => {
        const buildingRef = doc(db, "buildings", id);
        await updateDoc(buildingRef, { description: newDesc });
    };

    return (
        <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
            <header style={{ padding: "1rem", background: "#333", color: "#fff", zIndex: 1000 }}>
                <h2>Campus Map Prototype</h2>
                <p style={{ fontSize: "0.8rem", color: "#aaa" }}>Click anywhere on the map to add a building.</p>
            </header>

            {/* Map View */}
            <MapContainer center={defaultCenter} zoom={15} style={{ flex: 1 }}>
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* 🧭 YOUR GEOLOCATION MARKER IS PLACED HERE */}
                <LocationMarker />

                {/* Click Handler */}
                <AddMarker setPosition={setNewPos} setShowForm={setShowForm} />

                {/* Render Buildings from DB */}
                {buildings.map((b) => (
                    <Marker key={b.id} position={[b.lat, b.lng]}>
                        <Popup>
                            <div style={{ minWidth: "200px" }}>
                                <h3>{b.name}</h3>
                                <p>{b.description}</p>
                                <hr/>
                                <input 
                                    type="text" 
                                    placeholder="Edit description..." 
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter') handleUpdate(b.id, e.target.value)
                                    }}
                                    style={{ width: "100%", padding: "5px" }}
                                />
                                <small style={{color: 'gray'}}>Press Enter to save edit</small>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Floating Form for New Buildings */}
            {showForm && (
                <div style={{
                    position: "absolute", bottom: "20px", left: "20px", 
                    background: "white", padding: "20px", borderRadius: "8px", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)", zIndex: 1001 
                }}>
                    <h4>Add New Building</h4>
                    <form onSubmit={handleAddBuilding}>
                        <input 
                            placeholder="Building Name (e.g. Civil Block)" 
                            value={name} onChange={e => setName(e.target.value)} 
                            style={{ display: "block", marginBottom: "10px", padding: "8px", width: "200px"}}
                            required 
                        />
                        <textarea 
                            placeholder="Description (e.g. Happiness Hut Cafe)" 
                            value={description} onChange={e => setDescription(e.target.value)}
                            style={{ display: "block", marginBottom: "10px", padding: "8px", width: "200px"}}
                            required
                        />
                        <button type="submit" style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "4px" }}>
                            Add to Map
                        </button>
                        <button onClick={() => setShowForm(false)} style={{ marginLeft: "10px", padding: "8px", background: "transparent", border: "none" }}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}