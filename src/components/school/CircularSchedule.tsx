"use client";

/**
 * 시간(HH:MM)을 각도(degree)로 변환
 * 00:00 -> -90deg (top)
 */
function timeToDegree(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const degreePerMinute = 360 / (24 * 60);
    return totalMinutes * degreePerMinute - 90;
}

export interface ScheduleItem {
    id: string;
    title: string;
    startTime: string; // HH:MM (24h)
    endTime: string;   // HH:MM (24h)
    color: string;
    type: 'basic' | 'event';
}

interface CircularScheduleProps {
    items: ScheduleItem[];
    onItemClick?: (item: ScheduleItem) => void;
}

export function CircularSchedule({ items, onItemClick }: CircularScheduleProps) {
    // SVG Path Generator for Arc
    const createArc = (startDegree: number, endDegree: number) => {
        const radius = 100;
        const center = 100;
        
        // Convert degrees to radians
        const startRad = (startDegree * Math.PI) / 180;
        const endRad = (endDegree * Math.PI) / 180;

        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        // Determine large arc flag
        let diff = endDegree - startDegree;
        if (diff < 0) diff += 360;
        const largeArcFlag = diff > 180 ? 1 : 0;

        return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };

    // Calculate text position for labels
    const getTextPosition = (startDegree: number, endDegree: number) => {
        const radius = 70; // Text closer to center
        const center = 100;
        let diff = endDegree - startDegree;
        if (diff < 0) diff += 360;
        const midDegree = startDegree + diff / 2;
        const midRad = (midDegree * Math.PI) / 180;
        
        return {
            x: center + radius * Math.cos(midRad),
            y: center + radius * Math.sin(midRad),
            degree: midDegree
        };
    };

    return (
        <div className="relative w-full max-w-[400px] aspect-square mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                {/* Background Circle */}
                <circle cx="100" cy="100" r="100" fill="white" className="stroke-gray-100" strokeWidth="1" />

                {/* Slices */}
                {items.map((item) => {
                    const startDeg = timeToDegree(item.startTime);
                    const endDeg = timeToDegree(item.endTime);
                    const path = createArc(startDeg, endDeg);
                    const textPos = getTextPosition(startDeg, endDeg);

                    return (
                        <g key={item.id} onClick={() => onItemClick?.(item)} className="cursor-pointer hover:opacity-90 transition-opacity group">
                            <path 
                                d={path} 
                                fill={item.color} 
                                stroke="white" 
                                strokeWidth="2"
                            />
                            {/* Label: Stroke 효과로 가독성 확보 */}
                            <text
                                x={textPos.x}
                                y={textPos.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="9"
                                fontWeight="800"
                                className="pointer-events-none select-none"
                                style={{ 
                                    fill: "#333", // 진한 회색 텍스트
                                    stroke: "#fff", // 흰색 테두리
                                    strokeWidth: "3px",
                                    paintOrder: "stroke fill", // 테두리 먼저 그리고 채우기
                                    filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.2))"
                                }}
                            >
                                {item.title}
                            </text>
                            {/* Time Range (Optional, small text underneath) */}
                            {/* 
                            <text
                                x={textPos.x}
                                y={textPos.y + 7}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="6"
                                fontWeight="600"
                                fill="#555"
                                style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: "2px" }}
                            >
                                {item.startTime}-{item.endTime}
                            </text>
                            */}
                        </g>
                    );
                })}

                {/* Center Circle (Current Time or Deco) */}
                <circle cx="100" cy="100" r="22" fill="white" stroke="#e5e7eb" strokeWidth="2" className="drop-shadow-sm" />
                <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="900" fill="#333">
                    하루
                </text>

                {/* Modern Markers */}
                <text x="100" y="12" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#aaa">24</text>
                <text x="188" y="103" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#aaa">06</text>
                <text x="100" y="194" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#aaa">12</text>
                <text x="12" y="103" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#aaa">18</text>
            </svg>
        </div>
    );
}
