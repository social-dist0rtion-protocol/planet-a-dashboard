import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Leaderboard from "./components/Leaderboard";
import GlobalStats from "./components/GlobalStats";
import Sustainability from "./components/Sustainability";
import { useInterval } from "./effects";
import { getLeaderboard, countries } from "./api";
import { LeaderboardResponse } from "./types";
import "./App.css";

const POLL_INTERVAL_SECONDS = 10;

const App: React.FC = () => {
  const [players, setPlayers] = useState<LeaderboardResponse["players"]>({});
  const [trees, setTrees] = useState<LeaderboardResponse["trees"]>([]);
  const [emissions, setEmissions] = useState<LeaderboardResponse["emissions"]>(
    []
  );
  const [emissionsByCountry, setEmissionsByCountry] = useState<
    LeaderboardResponse["emissionsByCountry"]
  >({});
  const [treesByCountry, setTreesByCountry] = useState<
    LeaderboardResponse["treesByCountry"]
  >({});

  const pollLeaderbord = async () => {
    const response = await getLeaderboard();
    setPlayers(response.players);
    setTrees(response.trees);
    setEmissions(response.emissions);
    setTreesByCountry(response.treesByCountry);
    setEmissionsByCountry(response.emissionsByCountry);
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
          <GlobalStats
            emissionsByCountry={emissionsByCountry}
            treesByCountry={treesByCountry}
          />
        </Col>
        <Col>
          <Sustainability
            countries={countries}
            emissionsByCountry={emissionsByCountry}
            treesByCountry={treesByCountry}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
