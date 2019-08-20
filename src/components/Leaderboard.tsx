import React from "react";
import { Col, Row } from "react-bootstrap";
import "./Leaderboard.css";
import { Player } from "../types";
import numeral from "numeral";

type LeaderboardProps = {
  players: { [id: string]: Player };
  trees: Array<[string, number]>;
  emissions: Array<[string, number]>;
};

const Leader = ({ player, balance }: { player: Player; balance: number }) => (
  <Row noGutters>
    <Col xs={8} className="player-name">
      {player.name || "Anonymous"}
    </Col>
    <Col>{numeral(balance).format("0a")}</Col>
    <Col>{player.event}</Col>
  </Row>
);

const Leaderboard = (props: LeaderboardProps) => (
  <div className="leaderboard">
    <h4>Best planters - CO₂ locked</h4>
    <Row className="tree-huggers" noGutters>
      <Col>
        <Row className="headers" noGutters>
          <Col xs={8}>name</Col>
          <Col>CO₂ (Mt)</Col>
          <Col>country</Col>
        </Row>
        {props.trees.slice(0, 10).map(t => (
          <Leader key={t[0]} player={props.players[t[0]]} balance={t[1]} />
        ))}
      </Col>
    </Row>
    <h4>Worst polluters - CO₂ emitted</h4>
    <Row className="polluters" noGutters>
      <Col>
        <Row className="headers" noGutters>
          <Col xs={8}>name</Col>
          <Col>CO₂ (Mt)</Col>
          <Col>country</Col>
        </Row>
        {props.emissions.slice(0, 10).map(e => (
          <Leader key={e[0]} player={props.players[e[0]]} balance={e[1]} />
        ))}
      </Col>
    </Row>
  </div>
);

export default React.memo(Leaderboard);
