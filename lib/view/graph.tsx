import { Component } from "react";

class Graph extends Component {
  render() {
    return (
      <div>
        hi
        <svg width="300" height="200">
          {/* Draw axes */}
          <line
            x1="40"
            y1="180"
            x2="260"
            y2="180"
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1="40"
            y1="180"
            x2="40"
            y2="20"
            stroke="black"
            strokeWidth="2"
          />
          {/* Draw a simple line graph */}
          <polyline
            fill="none"
            stroke="blue"
            strokeWidth="2"
            points="40,180 80,120 120,100 160,60 200,80 240,40"
          />
          {/* Add labels */}
          <text x="10" y="25" fontSize="12">
            Y
          </text>
          <text x="255" y="195" fontSize="12">
            X
          </text>
        </svg>
      </div>
    );
  }
}

export default Graph;
