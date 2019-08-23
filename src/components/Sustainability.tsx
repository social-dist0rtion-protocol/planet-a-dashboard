import React from "react";
import { Col, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import "./Sustainability.css";
import { Country } from "../types";
import { backgroundColors } from "../App";

type SustainabilityProps = {
  countries: Map<string, Country>;
  co2ByCountry: { [countrId: string]: string };
  treesByCountry: { [countryId: string]: string };
};

const Sustainability = (props: SustainabilityProps) => {
  const { countries, co2ByCountry, treesByCountry } = props;
  const countryIds = Array.from(countries.keys());

  const labels: string[] = [];
  const co2: number[] = [];
  const trees: number[] = [];

  countries.forEach((c, id) => {
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
                  backgroundColor: countryIds.map(c => backgroundColors[c])
                }
              ]
            }}
            options={{
              animation: { duration: 0 },
              legend: { display: false },
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
                      suggestedMin: 500000,
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
                  backgroundColor: countryIds.map(c => backgroundColors[c])
                }
              ]
            }}
            options={{
              animation: { duration: 0 },
              legend: { display: false },
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
