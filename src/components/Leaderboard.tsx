import React from "react";
import { Badge, Col, Row } from "react-bootstrap";
import "./Leaderboard.css";
import { Player } from "../types";
import numeral from "numeral";
import { countriesById } from "../api";

type LeaderboardProps = {
  players: { [id: string]: Player };
  trees: Array<[string, string]>;
  emissions: Array<[string, string]>;
};

const unknownPlayer = { name: "Mr. Mysterious", event: "???" };

const Leader = ({ player, balance }: { player: Player; balance: number }) => (
  <Row noGutters>
    <Col xs={10} className="player-name">
      <Badge
        pill
        style={{
          backgroundColor: (
            countriesById[player.countryId] || { color: "white" }
          ).color,
          color: (countriesById[player.countryId] || { textColor: "#333333" })
            .textColor
        }}
      >
        {(countriesById[player.countryId] || { event: "ext" }).event}
      </Badge>{" "}
      {player.name || "Mr. Anonymous"}
    </Col>
    <Col>{numeral(balance).format("0a")}</Col>
  </Row>
);

const Leaderboard = (props: LeaderboardProps) => (
  <div className="leaderboard">
    <h4>Best planters - CO₂ locked</h4>
    <Row className="tree-huggers" noGutters>
      <Col>
        <Row className="headers" noGutters>
          <Col xs={10}>name</Col>
          <Col>CO₂ (Mt)</Col>
        </Row>
        {props.trees.slice(0, 10).map(t => (
          <Leader
            key={t[0]}
            player={props.players[t[0]] || unknownPlayer}
            balance={parseInt(t[1], 10)}
          />
        ))}
      </Col>
    </Row>
    <h4>Worst polluters - CO₂ emitted</h4>
    <Row className="polluters" noGutters>
      <Col>
        <Row className="headers" noGutters>
          <Col xs={10}>name</Col>
          <Col>CO₂ (Mt)</Col>
        </Row>
        {props.emissions.slice(0, 10).map(e => (
          <Leader
            key={e[0]}
            player={props.players[e[0]] || unknownPlayer}
            balance={parseInt(e[1], 10)}
          />
        ))}
      </Col>
    </Row>
  </div>
);

export default React.memo(Leaderboard);
