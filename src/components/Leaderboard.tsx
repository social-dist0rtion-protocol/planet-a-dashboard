import React from "react";
import { Badge, Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Leaderboard.css";
import { Player, Country } from "../types";
import numeral from "numeral";

type LeaderboardProps = {
  countries: Map<string, Country>;
  players: { [id: string]: Player };
  trees: Array<[string, string]>;
  emissions: Array<[string, string]>;
};

const unknownPlayer = { name: "Mr. Mysterious", event: "???" };

const Leader = ({
  countries,
  player,
  balance
}: {
  countries: LeaderboardProps["countries"];
  player: Player;
  balance: number;
}) => (
  <Row noGutters>
    <Col xs={10} className="player-name">
      <OverlayTrigger
        key={player.name}
        placement="right"
        overlay={
          <Tooltip id={`tt-${player.name}`}>
            {
              (countries.get(player.countryId) || { name: "unknown country" })
                .name
            }
          </Tooltip>
        }
      >
        <Badge
          pill
          style={{
            backgroundColor: (
              countries.get(player.countryId) || { color: "white" }
            ).color,
            color: "#eee"
          }}
        >
          {`${(countries.get(player.countryId) || { event: "ext" }).event}-${(
            countries.get(player.countryId) || { shortName: "xxx" }
          ).shortName.toLowerCase()}`}
        </Badge>
      </OverlayTrigger>
      {` ${player.name || "Mr. Anonymous"}`}
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
            countries={props.countries}
            player={props.players[t[0]] || unknownPlayer}
            balance={parseInt(t[1], 10)}
          />
        ))}
      </Col>
    </Row>
    <h4>Biggest polluters - CO₂ emitted</h4>
    <Row className="polluters" noGutters>
      <Col>
        <Row className="headers" noGutters>
          <Col xs={10}>name</Col>
          <Col>CO₂ (Mt)</Col>
        </Row>
        {props.emissions.slice(0, 10).map(e => (
          <Leader
            key={e[0]}
            countries={props.countries}
            player={props.players[e[0]] || unknownPlayer}
            balance={parseInt(e[1], 10)}
          />
        ))}
      </Col>
    </Row>
  </div>
);

export default React.memo(Leaderboard);
