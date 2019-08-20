import React from "react";
import { Col, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import "./Sustainability.css";
import { LeaderboardResponse, Country } from "../types";

type SustainabilityProps = {
  netCO2History: LeaderboardResponse["netCO2History"];
  countries: { [countryId: string]: Country };
};

const Sustainability = (props: SustainabilityProps) => {
  const { countries, netCO2History } = props;

  const labels: string[] = [];
  const data: number[] = [];

  Object.entries(countries).forEach(([id, c]) => {
    labels.push(c.name);
    const netCO2Values = netCO2History[id] || [[0, 0]];
    data.push(
      1 / Math.max(1, parseInt(netCO2Values[netCO2Values.length - 1][1], 10))
    );
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
            height={400}
            redraw
          />
        </Col>
      </Row>
    </>
  );
};

export default React.memo(Sustainability);
