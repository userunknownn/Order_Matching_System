import React from "react";
import { Match } from "../../../../domain/entities/Match";

interface GlobalMatchesTableProps {
  matches: Match[];
}

const GlobalMatchesTable: React.FC<GlobalMatchesTableProps> = ({ matches }) => {
  return (
    <div className="card p-4 mb-4">
      <h2>Global Matches</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Price (USD)</th>
            <th>Volume (BTC)</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, idx) => (
            <tr key={idx}>
              <td>${match.price.toFixed(2)}</td>
              <td>{match.volume.toFixed(3)} BTC</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GlobalMatchesTable;

