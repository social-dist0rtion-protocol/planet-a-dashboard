import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { draw } from "patternomaly";
import Leaderboard from "./components/Leaderboard";
import GlobalStats from "./components/GlobalStats";
import Sustainability from "./components/Sustainability";
import { useInterval } from "./effects";
import { getLeaderboard, countriesById } from "./api";
import { LeaderboardResponse } from "./types";
import "./App.css";

const POLL_INTERVAL_SECONDS = 15;

// use a Map so that insertion order is used in traversals
const countries = new Map(
  // group countries by event, sort by short name lexicographically
  Object.entries(countriesById).sort(([_, c1], [__, c2]) =>
    c1.event > c2.event
      ? 1
      : c1.event === c2.event
      ? c1.shortName > c2.shortName
        ? 1
        : c1.shortName === c2.shortName
        ? 0
        : -1
      : -1
  )
);

export const backgroundColors = Array.from(countries.values()).reduce(
  (prev, current) => {
    prev[current.id] = current.pattern
      ? draw(current.pattern as "dot" | "dash", current.color)
      : current.color;
    return prev;
  },
  {} as { [countryId: string]: string | CanvasPattern }
);

const App: React.FC = () => {
  const [players, setPlayers] = useState<LeaderboardResponse["players"]>({});
  const [trees, setTrees] = useState<LeaderboardResponse["trees"]>([]);
  const [emissions, setEmissions] = useState<LeaderboardResponse["emissions"]>(
    []
  );
  const [netCO2History, setNetCO2History] = useState(
    Object.keys(countries).reduce(
      (prev, current) => {
        prev[current] = [];
        return prev;
      },
      {} as LeaderboardResponse["netCO2History"]
    )
  );
  const [co2ByCountry, setCO2ByCountry] = useState<
    LeaderboardResponse["co2ByCountry"]
  >({});
  const [treesByCountry, setTreesByCountry] = useState<
    LeaderboardResponse["treesByCountry"]
  >({});
  const [goeMillis, setGoeMillis] = useState(0);
  const lastPolled = useRef(new Date("1984-02-24T15:54:00"));

  const pollLeaderbord = async () => {
    const response = await getLeaderboard();
    if (lastPolled.current) {
      lastPolled.current.setTime(new Date().valueOf());
    }
    if (response) {
      setPlayers(response.players);
      setTrees(response.trees);
      setEmissions(response.emissions);
      setNetCO2History(response.netCO2History);
      setCO2ByCountry(response.co2ByCountry);
      setTreesByCountry(response.treesByCountry);
      setGoeMillis(response.goeMillisCirculating);
    }
  };

  // initialize the leaderboard by polling once right away
  useEffect(() => {
    pollLeaderbord();
    const focusListener = () => {
      if (document.visibilityState === "visible") {
        if (
          lastPolled.current &&
          new Date().valueOf() - lastPolled.current.valueOf() >
            POLL_INTERVAL_SECONDS * 1000
        ) {
          console.log(
            `polling after getting back focus, lastUpdate was on ${lastPolled}`
          );
          pollLeaderbord();
        }
      }
    };
    document.addEventListener("visibilitychange", focusListener);
    // unregister focus listener on cleanup
    return () =>
      document.removeEventListener("visibilitychange", focusListener);
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
            Planet A{" "}
            <span role="img" aria-label="globe">
              🌳
            </span>
          </h1>
        </Col>{" "}
      </Row>
      <Row>
        <Col className="mainCol" sm={12} lg={6} xl={4}>
          <Leaderboard
            countries={countries}
            players={players}
            trees={trees}
            emissions={emissions}
          />
        </Col>
        <Col className="mainCol" sm={12} lg={6} xl={4}>
          <GlobalStats
            countries={countries}
            netCO2History={netCO2History}
            goeMillis={goeMillis}
          />
        </Col>
        <Col className="mainCol" sm={12} lg={6} xl={4}>
          <Sustainability
            countries={countries}
            co2ByCountry={co2ByCountry}
            treesByCountry={treesByCountry}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
