"use client";

import { createContext, useContext, useState, useEffect } from "react";

const PatientContext = createContext();

export function PatientProvider({ children }) {
    const [patientData, setPatientData] = useState({
        disease: "",
        zipCode: "",
    });

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("globalPatientData");
            if (saved) {
                setPatientData(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Failed to load patient data", error);
        }
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem("globalPatientData", JSON.stringify(patientData));
    }, [patientData]);

    const updatePatientData = (newData) => {
        setPatientData((prev) => ({ ...prev, ...newData }));
    };

    return (
        <PatientContext.Provider value={{ patientData, updatePatientData }}>
            {children}
        </PatientContext.Provider>
    );
}

export function usePatientContext() {
    return useContext(PatientContext);
}
