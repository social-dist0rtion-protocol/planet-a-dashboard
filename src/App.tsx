import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Leaderboard from "./components/Leaderboard";
import GlobalStats from "./components/GlobalStats";
import Sustainability from "./components/Sustainability";
import { useInterval } from "./effects";
import { getLeaderboard, countries, countriesById } from "./api";
import { LeaderboardResponse } from "./types";
import "./App.css";

const POLL_INTERVAL_SECONDS = 10;

const App: React.FC = () => {
  const [players, setPlayers] = useState<LeaderboardResponse["players"]>({});
  const [trees, setTrees] = useState<LeaderboardResponse["trees"]>([]);
  const [emissions, setEmissions] = useState<LeaderboardResponse["emissions"]>(
    []
  );
  const [netCO2History, setNetCO2History] = useState(
    Object.keys(countriesById).reduce(
      (prev, current) => {
        prev[current] = [];
        return prev;
      },
      {} as LeaderboardResponse["netCO2History"]
    )
  );

  const pollLeaderbord = async () => {
    const response = await getLeaderboard();
    setPlayers(response.players);
    setTrees(response.trees);
    setEmissions(response.emissions);
    setNetCO2History(response.netCO2History);
  };

  // initialize the leaderboard by polling once right away
  useEffect(() => {
    pollLeaderbord();
  }, []);

  // start polling every POLL_INTERVAL_SECONDS... seconds
  useInterval(pollLeaderbord, POLL_INTERVAL_SECONDS * 1000);

  return (
    <Container className="app" fluid>
      <Row>
        <Col>
          <h1>
            <span role="img" aria-label="globe">
              🌍
            </span>{" "}
            Tragedy of the CO₂mmons{" "}
            <span role="img" aria-label="globe">
              🌳
            </span>
          </h1>
        </Col>{" "}
      </Row>
      <Row>
        <Col>
          <Leaderboard players={players} trees={trees} emissions={emissions} />
        </Col>
        <Col xs={6}>
          <GlobalStats netCO2History={netCO2History} />
        </Col>
        <Col>
          <Sustainability countries={countries} netCO2History={netCO2History} />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
