import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import type { LifeDomain } from "@/lib/types";

type WheelSegment = LifeDomain;
interface WheelNavProps {
  segments: WheelSegment[];
}

const WheelNav = ({ segments }: WheelNavProps) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const calculateTextPosition = useCallback(
    (index: number, total: number) => {
      const anglePerSegment = (2 * Math.PI) / total;
      const midAngle = (index + 0.5) * anglePerSegment - Math.PI / 2;

      // Use windowWidth state instead of direct window.innerWidth
      const baseRadius = Math.min(windowWidth, 400) / 4;
      const radius = Math.min(baseRadius, 100);

      const x = 200 + radius * Math.cos(midAngle);
      const y = 200 + radius * Math.sin(midAngle);

      let rotation = (midAngle * 180) / Math.PI;
      if (rotation > 90 && rotation < 270) {
        rotation += 180;
      }

      return { x, y, rotation };
    },
    [windowWidth]
  ); // Add windowWidth as dependency

  if (!segments.length) {
    return <div className="text-center">No segments available</div>;
  }

  return (
    <div className="wheel-container">
      <svg
        viewBox="0 0 400 400"
        className="wheel"
        preserveAspectRatio="xMidYMid meet"
      >
        {segments.map((segment, index) => {
          const textPos = calculateTextPosition(index, segments.length);
          return (
            <Link key={index} href={`/${segment.slug}`}>
              {" "}
              <g className="segment-group">
                <path
                  d={calculateSegmentPath(index, segments.length)}
                  fill={segment.colour}
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
                  <tspan
                    dy="0"
                    className="text-balance"
                    style={{
                      fontSize: window.innerWidth <= 480 ? "14px" : "16px",
                      maxWidth: `${Math.min(window.innerWidth / 4, 100)}px`,
                    }}
                  >
                    {segment.label}
                  </tspan>
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
