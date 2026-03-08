'use client';

import React from 'react';

const VesselMap = () => {
    return (
        <div className="vessel-map-container">
            <iframe
                src="https://www.vesselfinder.com/aismap?zoom=9&lat=26.6&lon=56.3&names=true"
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen
                className="vessel-map-iframe"
                title="Hormuz Strait Vessel Traffic"
            ></iframe>
            <div className="map-overlay-info">
                <div className="overlay-item">
                    <span className="dot pulse-green"></span>
                    リアルタイムAISデータ
                </div>
            </div>
        </div>
    );
};

export default VesselMap;
