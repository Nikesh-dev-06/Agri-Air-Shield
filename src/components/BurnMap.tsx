import { useEffect, useRef } from "react";
import L from "leaflet";
import { BurnEvent, PredictedBurn, AQIWarning } from "@/data/burnData";

interface BurnMapProps {
  burns: BurnEvent[];
  predictions: PredictedBurn[];
  aqiWarnings: AQIWarning[];
  showPredictions: boolean;
  showAQI: boolean;
}

const intensityColors: Record<string, string> = {
  low: "#f59e0b",
  medium: "#f97316",
  high: "#ef4444",
  extreme: "#dc2626",
};

const aqiColors: Record<string, string> = {
  Good: "#22c55e",
  Moderate: "#eab308",
  Unhealthy: "#f97316",
  "Very Unhealthy": "#ef4444",
  Hazardous: "#7c2d12",
};

// India bounds
const indiaBounds: L.LatLngBoundsExpression = [
  [6.5, 68.0],   // SW
  [35.5, 97.5],  // NE
];

const BurnMap = ({ burns, predictions, aqiWarnings, showPredictions, showAQI }: BurnMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<L.LayerGroup[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: [23.5, 78.5],
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
      maxBounds: L.latLngBounds(indiaBounds),
      maxBoundsViscosity: 1.0,
      minZoom: 4,
      maxZoom: 12,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 12,
    }).addTo(mapRef.current);

    // Add Map Legend Control
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend");
      div.style.background = "#fff";
      div.style.padding = "10px";
      div.style.borderRadius = "6px";
      div.style.boxShadow = "0 0 12px rgba(0,0,0,0.2)";
      div.style.fontSize = "10px";
      div.style.fontFamily = "Arial, sans-serif";
      div.style.maxWidth = "140px";
      div.style.zIndex = "400";

      const legendHTML = `
        <div style="color:#333; font-weight:bold; margin-bottom:6px; font-size:11px;">Legend</div>
        <div style="display:flex; align-items:center; gap:5px; margin:3px 0;">
          <span style="width:10px; height:10px; background:#f59e0b; border-radius:50%;"></span>
          <span style="font-size:9px;">Low</span>
        </div>
        <div style="display:flex; align-items:center; gap:5px; margin:3px 0;">
          <span style="width:10px; height:10px; background:#f97316; border-radius:50%;"></span>
          <span style="font-size:9px;">Medium</span>
        </div>
        <div style="display:flex; align-items:center; gap:5px; margin:3px 0;">
          <span style="width:10px; height:10px; background:#ef4444; border-radius:50%;"></span>
          <span style="font-size:9px;">High</span>
        </div>
        <div style="display:flex; align-items:center; gap:5px; margin:3px 0;">
          <span style="width:10px; height:10px; background:#dc2626; border-radius:50%;"></span>
          <span style="font-size:9px;">Extreme</span>
        </div>
        <div style="display:flex; align-items:center; gap:5px; margin:3px 0;">
          <span style="width:10px; height:10px; background:#22c55e; border-radius:50%; border:1px solid #fff;"></span>
          <span style="font-size:9px;">Start</span>
        </div>
      `;
      div.innerHTML = legendHTML;
      return div;
    };
    legend.addTo(mapRef.current);

    // Draw India outline focus boundary
    L.rectangle(L.latLngBounds(indiaBounds), {
      color: "hsl(28, 95%, 55%)",
      weight: 1,
      fill: false,
      opacity: 0.3,
      dashArray: "8 4",
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old layers
    layersRef.current.forEach((lg) => lg.remove());
    layersRef.current = [];

    // Burn events
    const burnLayer = L.layerGroup();
    
    // Add starting point marker (first burn by date)
    if (burns.length > 0) {
      const sortedBurns = [...burns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const firstBurn = sortedBurns[0];
      
      L.marker([firstBurn.lat, firstBurn.lng], {
        icon: L.divIcon({
          className: "start-point-marker",
          html: `<div style="
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #22c55e, #16a34a);
            border: 3px solid #fff;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.8), inset 0 0 5px rgba(255,255,255,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            color: #fff;
          ">▶</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      })
        .bindPopup(
          `<div style="color:#1a1a2e;font-size:13px;">
            <strong>🚀 BURN START POINT</strong><br/>
            ${firstBurn.district}, ${firstBurn.state}<br/>
            📅 ${firstBurn.date}<br/>
            🌾 ${firstBurn.crop}
          </div>`
        )
        .addTo(burnLayer);
    }
    
    burns.forEach((burn) => {
      const radius = Math.max(burn.areaBurned / 15, 4);
      L.circleMarker([burn.lat, burn.lng], {
        radius,
        fillColor: intensityColors[burn.intensity],
        color: intensityColors[burn.intensity],
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.5,
      })
        .bindPopup(
          `<div style="color:#1a1a2e;font-size:13px;">
            <strong>${burn.district}, ${burn.state}</strong><br/>
            📅 ${burn.date}<br/>
            🌾 ${burn.crop}<br/>
            🔥 Intensity: <b>${burn.intensity}</b><br/>
            📐 Area: ${burn.areaBurned} ha<br/>
            ⚡ FRP: ${burn.frp} MW
          </div>`
        )
        .addTo(burnLayer);
    });
    burnLayer.addTo(mapRef.current);
    layersRef.current.push(burnLayer);

    // Pollution travel paths from burn clusters to affected cities
    if (showAQI && aqiWarnings.length > 0) {
      const pollutionLayer = L.layerGroup();

      aqiWarnings.forEach((warning) => {
        const color = aqiColors[warning.predictedCategory];
        const sourceDistricts = burns.filter((b) =>
          warning.affectedBy.includes(b.district)
        );

        // Draw gradient polylines from each burn source to the city
        const uniqueSources = new Map<string, { lat: number; lng: number }>();
        sourceDistricts.forEach((b) => {
          if (!uniqueSources.has(b.district)) {
            uniqueSources.set(b.district, { lat: b.lat, lng: b.lng });
          }
        });

        uniqueSources.forEach((src) => {
          // Draw pollution travel path
          const midLat = (src.lat + warning.lat) / 2 + (Math.random() - 0.5) * 0.3;
          const midLng = (src.lng + warning.lng) / 2 + (Math.random() - 0.5) * 0.3;

          // Main path
          L.polyline(
            [
              [src.lat, src.lng],
              [midLat, midLng],
              [warning.lat, warning.lng],
            ],
            {
              color,
              weight: 2.5,
              opacity: 0.6,
              dashArray: "6 4",
              smoothFactor: 2,
            }
          ).addTo(pollutionLayer);

          // Pollution haze circles along the path
          for (let t = 0.2; t <= 0.8; t += 0.3) {
            const lat = src.lat + (warning.lat - src.lat) * t;
            const lng = src.lng + (warning.lng - src.lng) * t;
            L.circleMarker([lat, lng], {
              radius: 6,
              fillColor: color,
              color: "transparent",
              fillOpacity: 0.2,
            }).addTo(pollutionLayer);
          }
        });

        // City AQI marker
        L.circleMarker([warning.lat, warning.lng], {
          radius: 16,
          fillColor: color,
          color,
          weight: 3,
          opacity: 1,
          fillOpacity: 0.45,
        })
          .bindPopup(
            `<div style="color:#1a1a2e;font-size:13px;">
              <strong>🏙️ ${warning.city}</strong><br/>
              Current AQI: <b>${warning.currentAQI}</b> (${warning.category})<br/>
              Predicted AQI: <b style="color:${color}">${warning.predictedAQI}</b> (${warning.predictedCategory})<br/>
              💨 Wind: ${warning.windDirection}<br/>
              ⚠️ ${warning.healthRisk}<br/>
              <small>Affected by burns in: ${warning.affectedBy.join(", ")}</small>
            </div>`
          )
          .addTo(pollutionLayer);

        // AQI label on map
        L.marker([warning.lat, warning.lng], {
          icon: L.divIcon({
            className: "",
            html: `<div style="
              background:${color};
              color:#fff;
              font-size:10px;
              font-weight:bold;
              padding:2px 5px;
              border-radius:4px;
              white-space:nowrap;
              transform:translate(-50%,-30px);
              text-align:center;
              box-shadow:0 2px 6px rgba(0,0,0,0.4);
            ">${warning.city}: AQI ${warning.predictedAQI}</div>`,
            iconSize: [0, 0],
          }),
        }).addTo(pollutionLayer);
      });

      pollutionLayer.addTo(mapRef.current);
      layersRef.current.push(pollutionLayer);
    }

    // Predictions
    if (showPredictions) {
      const predLayer = L.layerGroup();
      predictions.forEach((pred) => {
        const size = pred.riskScore / 3;
        L.circleMarker([pred.lat, pred.lng], {
          radius: Math.max(size, 8),
          fillColor: "#3b82f6",
          color: "#60a5fa",
          weight: 2,
          opacity: 0.9,
          fillOpacity: 0.3,
          dashArray: "5 5",
        })
          .bindPopup(
            `<div style="color:#1a1a2e;font-size:13px;">
              <strong>⚠️ PREDICTED BURN</strong><br/>
              📍 ${pred.district}, ${pred.state}<br/>
              📅 Expected: ${pred.predictedDate}<br/>
              📊 Probability: <b>${(pred.probability * 100).toFixed(0)}%</b><br/>
              🎯 Risk Score: <b>${pred.riskScore}</b><br/>
              🤖 Model: ${pred.model}<br/>
              🌾 ${pred.crop}
            </div>`
          )
          .addTo(predLayer);
      });
      predLayer.addTo(mapRef.current);
      layersRef.current.push(predLayer);
    }
  }, [burns, predictions, aqiWarnings, showPredictions, showAQI]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] rounded-lg border border-border overflow-hidden"
    />
  );
};

export default BurnMap;
