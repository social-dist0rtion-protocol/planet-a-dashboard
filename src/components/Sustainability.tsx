import React from "react";
import { Col, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import "./Sustainability.css";
import { Country } from "../types";

type SustainabilityProps = {
  countries: { [countryId: string]: Country };
  co2ByCountry: { [countrId: string]: string };
  treesByCountry: { [countryId: string]: string };
};

const Sustainability = (props: SustainabilityProps) => {
  const { countries, co2ByCountry, treesByCountry } = props;

  const labels: string[] = [];
  const co2: number[] = [];
  const trees: number[] = [];

  Object.entries(countries).forEach(([id, c]) => {
    labels.push(c.shortName);
    co2.push(parseInt(co2ByCountry[id] || "0", 10));
    trees.push(parseInt(treesByCountry[id] || "0", 10));
  });

  return (
    <>
      <h4>CO₂ emitted</h4>
      <Row className="sustainability" noGutters>
        <Col>
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: "CO₂",
                  data: co2,
                  backgroundColor: "rgba(200, 200, 200, 0.6)"
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
