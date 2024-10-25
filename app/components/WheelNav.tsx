import { useCallback } from "react";
import Link from "next/link";

interface WheelSegment {
  label: string;
  color: string;
  link: string;
}

interface WheelNavProps {
  segments: WheelSegment[];
}

const WheelNav = ({ segments }: WheelNavProps) => {
  const calculateSegmentPath = useCallback((index: number, total: number) => {
    if (total === 0) return "";

    const anglePerSegment = (2 * Math.PI) / total;
    const startAngle = index * anglePerSegment - Math.PI / 2; // Start from top
    const endAngle = (index + 1) * anglePerSegment - Math.PI / 2;

    // SVG dimensions
    const centerX = 200;
    const centerY = 200;
    const radius = 180; // Slightly smaller than viewBox to add padding

    // Calculate points
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);

    // Create SVG arc path
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `
      M ${centerX} ${centerY}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;
  }, []);

  const calculateTextPosition = useCallback((index: number, total: number) => {
    const anglePerSegment = (2 * Math.PI) / total;
    const midAngle = (index + 0.5) * anglePerSegment - Math.PI / 2;
    const radius = 120; // Distance of text from center

    const x = 200 + radius * Math.cos(midAngle);
    const y = 200 + radius * Math.sin(midAngle);

    // Calculate rotation to keep text readable
    let rotation = (midAngle * 180) / Math.PI;
    if (rotation > 90 && rotation < 270) {
      rotation += 180; // Flip text if it would be upside down
    }

    return { x, y, rotation };
  }, []);

  if (!segments.length) {
    return <div className="text-center">No segments available</div>;
  }

  return (
    <div className="wheel-container">
      <svg viewBox="0 0 400 400" className="wheel">
        {segments.map((segment, index) => {
          const textPos = calculateTextPosition(index, segments.length);
          return (
            <Link key={index} href={segment.link}>
              <g className="segment-group">
                <path
                  d={calculateSegmentPath(index, segments.length)}
                  fill={segment.color}
                  className="segment-path"
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  className="segment-text"
                >
                  {segment.label}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
};

export default WheelNav;
