import React from "react";
import { Col, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import "./Sustainability.css";
import { LeaderboardResponse, Country } from "../types";

type SustainabilityProps = {
  netCO2History: LeaderboardResponse["netCO2History"];
  countries: { [countryId: string]: Country };
  treesByCountry: { [countryId: string]: string };
};

const Sustainability = (props: SustainabilityProps) => {
  const { countries, netCO2History, treesByCountry } = props;

  const labels: string[] = [];
  const data: number[] = [];
  const trees: number[] = [];

  Object.entries(countries).forEach(([id, c]) => {
    labels.push(c.shortName);
    const netCO2Values = netCO2History[id] || [[0, 0]];
    if (netCO2Values.length) {
      const [latestCO2] = netCO2Values.slice(-1);
      data.push(1 / Math.max(1, parseInt(latestCO2[1], 10)));
    } else {
      data.push(0);
    }
    trees.push(parseInt(treesByCountry[id] || "0", 10));
  });

  return (
    <>
      <h4>Sustainibility</h4>
      <Row className="sustainability" noGutters>
        <Col>
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: "sustainability index",
                  data,
                  backgroundColor: "rgba(80, 200, 120, 0.6)"
                }
              ]
            }}
            options={{
              animation: { duration: 0 },
              scales: {
                xAxes: [
                  {
                    barPercentage: 0.5,
                    scaleLabel: "rgba(255, 255, 255, 0.8)",
                    gridLines: {
                      color: "rgba(255, 255, 255, 0.4)"
                    },
                    ticks: {
                      fontSize: 16,
                      fontColor: "rgba(255, 255, 255, 0.8)"
                    }
                  }
                ],
                yAxes: [
                  {
                    scaleLabel: "rgba(255, 255, 255, 0.8)",
                    gridLines: {
                      color: "rgba(255, 255, 255, 0.2)"
                    },
                    ticks: {
                      suggestedMin: 0,
                      fontColor: "rgba(255, 255, 255, 0.8)"
                    }
                  }
                ]
              }
            }}
            width={200}
            height={120}
            redraw
          />
        </Col>
      </Row>
      <h4>Trees planted</h4>
      <Row className="trees" noGutters>
        <Col>
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: "trees",
                  data: trees,
                  backgroundColor: "rgba(80, 200, 120, 0.6)"
                }
              ]
            }}
            options={{
              animation: { duration: 0 },
              scales: {
                xAxes: [
                  {
                    barPercentage: 0.5,
                    scaleLabel: "rgba(255, 255, 255, 0.8)",
                    gridLines: {
                      color: "rgba(255, 255, 255, 0.4)"
                    },
                    ticks: {
                      fontSize: 16,
                      fontColor: "rgba(255, 255, 255, 0.8)"
                    }
                  }
                ],
                yAxes: [
                  {
                    scaleLabel: "rgba(255, 255, 255, 0.8)",
                    gridLines: {
                      color: "rgba(255, 255, 255, 0.2)"
                    },
                    ticks: {
                      suggestedMin: 0,
                      fontColor: "rgba(255, 255, 255, 0.8)"
                    }
                  }
                ]
              }
            }}
            width={200}
            height={120}
            redraw
          />
        </Col>
      </Row>
    </>
  );
};

export default React.memo(Sustainability);
