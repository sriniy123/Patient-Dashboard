"use client";

import { useState, useEffect } from "react";
import { usePatientContext } from "@/context/PatientContext";

const BASE_ADS = [
    {
        title: "Health Services",
        description: "Premium healthcare at your fingertips. Find specialists near you.",
        type: "health",
        id: "base_health"
    },
    {
        title: "Local Support Groups",
        description: "You are not alone. Join a community that understands you.",
        type: "support",
        id: "base_support"
    },
    {
        title: "In-House Services",
        description: "Exclusive care packages available for our premium members.",
        type: "inhouse",
        id: "base_inhouse"
    },
    {
        title: "Lifestyle",
        description: "Healthy living tips, yoga classes, and organic nutrition.",
        type: "lifestyle",
        id: "base_lifestyle"
    },
];

export default function AdBanner({ position }) {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const { patientData } = usePatientContext();
    const [ads, setAds] = useState(BASE_ADS);

    useEffect(() => {
        // Regenerate ads whenever patient data changes
        let personalizedAds = [...BASE_ADS];

        // 1. Zip Code Targeting
        if (patientData?.zipCode) {
            // Modify the Support Group ad to be local
            personalizedAds = personalizedAds.map(ad => {
                if (ad.type === "support") {
                    return {
                        ...ad,
                        title: `Support Groups in ${patientData.zipCode}`,
                        description: `Connect with patients near you in ${patientData.zipCode}.`
                    };
                }
                return ad;
            });
        }

        // 2. Disease Targeting
        if (patientData?.disease) {
            // Add a specific high-priority ad for the disease
            const diseaseAd = {
                title: `${patientData.disease} Care`,
                description: `Specialized treatments and management plans for ${patientData.disease}.`,
                type: "health",
                id: "disease_specific"
            };
            // Insert at the beginning
            personalizedAds.unshift(diseaseAd);
        }

        setAds(personalizedAds);
    }, [patientData]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, [ads.length]); // Dependencies changed to ads.length

    // Ensure index is valid if ads array shrinks/grows
    const safeIndex = currentAdIndex % ads.length;
    const ad = ads[safeIndex];

    if (!ad) return null;

    if (position === "top") {
        return (
            <div className={`ad-banner ad-banner-top ad-type-${ad.type}`}>
                <div className="ad-content">
                    <span className="ad-label">Ad</span>
                    <span className="ad-title">{ad.title}:</span> <span className="ad-desc">{ad.description}</span>
                </div>
                <button className="ad-link-btn">Learn More</button>
            </div>
        );
    }

    if (position === "left" || position === "right") {
        return (
            <aside className={`ad-banner ad-banner-${position} ad-type-${ad.type}`}>
                <div className="ad-label-container">
                    <span className="ad-label">Sponsored</span>
                </div>
                <div className="ad-body">
                    <h3 className="ad-heading">{ad.title}</h3>
                    <p className="ad-text">{ad.description}</p>
                </div>
                <button className="ad-cta-btn">
                    View Offer
                </button>
            </aside>
        );
    }

    return null;
}
