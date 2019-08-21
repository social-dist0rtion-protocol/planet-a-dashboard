import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Line, defaults } from "react-chartjs-2";
import { LeaderboardResponse } from "../types";
import "./GlobalStats.css";
import "chartjs-plugin-annotation";
import { countriesById } from "../api";

export const MIN_THRESHOLD = 420000;
export const MAX_THRESHOLD = 1170000;
const MAX_Y = 1300000;

const ChartConf = (defaults as any).global;

ChartConf.elements.point.backgroundColor = "rgba(255, 255, 255, 0.8)";
ChartConf.elements.point.borderColor = "rgba(255, 255, 255, 0.8)";
ChartConf.elements.line.borderColor = "rgba(255, 255, 255, 0.8)";
ChartConf.elements.line.borderColor = "rgba(255, 255, 255, 0.8)";
ChartConf.legend.labels.fontColor = "rgba(255, 255, 255, 0.8)";

type GlobalStatsProps = {
  netCO2History: LeaderboardResponse["netCO2History"];
};

type TimeSeriesByCountry = { [id: string]: number[] };

const GlobalStats = (props: GlobalStatsProps) => {
  const countryIds = Object.keys(countriesById);
  const [times, setTimes] = useState<Date[]>([]);
  const [netCO2ByCountry, setNetCO2ByCountry] = useState<TimeSeriesByCountry>(
    {}
  );
  const [totalCO2, setTotalCO2] = useState(0);

  useEffect(() => {
    const { netCO2History } = props;

    // merge all time series into a single one
    const allTimeEntries: { [instant: string]: { [id: string]: number } } = {};

    Object.entries(netCO2History).forEach(([id, l]) => {
      l.forEach(v => {
        const values = allTimeEntries[v[1]] || {};
        values[id] = parseInt(v[0], 10);
        allTimeEntries[v[1]] = values;
      });
    });

    const sortedTimeline = Object.keys(allTimeEntries).sort();

    const newTimes: Date[] = [...times];
    const newValues = countryIds.reduce(
      (prev, current) => {
        prev[current] = netCO2ByCountry[current] || [];
        return prev;
      },
      {} as TimeSeriesByCountry
    );

    // fill "holes" for each country
    sortedTimeline.forEach(t => {
      newTimes.push(new Date(parseInt(t, 10) * 1000));
      countryIds.forEach(id => {
        const newValuesForCountry = newValues[id];
        let newValue = allTimeEntries[t][id];
        if (!newValue) {
          const [latest] = (
            (newValuesForCountry.length && newValuesForCountry) || [0]
          ).slice(-1);
          newValue = latest;
        }
        newValuesForCountry.push(newValue);
      });
    });

    const co2 = Object.values(newValues).reduce((prev, current) => {
      const [latest] = current.slice(-1);
      return prev + latest;
    }, 0);

    setTimes(newTimes);
    setNetCO2ByCountry(newValues);
    setTotalCO2(co2);
  }, [props.netCO2History]);

  return (
    <>
      <h4>Global emissions</h4>
      <Row className="global-stats" noGutters>
        <Col>
          <Row>
            <Col>
              <Line
                data={{
                  labels: times,
                  datasets: Object.entries(netCO2ByCountry).map(
                    ([countryId, series]) => ({
                      label: countriesById[countryId].name,
                      data: series,
                      pointBorderWidth: 0,
                      backgroundColor: countriesById[countryId].color
                    })
                  )
                }}
                options={{
                  animation: { duration: 0 },
                  showLine: true,
                  spanGaps: true,
                  cubicInterpolationMode: "monotone",
                  scales: {
                    xAxes: [
                      {
                        id: "time-axis",
                        type: "time",
                        display: true,
                        gridLines: {
                          display: false,
                          color: "rgba(255, 255, 255, 0.6)"
                        },
                        ticks: {
                          source: "auto",
                          beginAtZero: false,
                          autoSkip: true,
                          fontColor: "rgba(255, 255, 255, 0.8)"
                        },
                        scaleLabel: "rgba(255, 255, 255, 0.8)",
                        time: { unit: "second", round: "second" }
                      }
                    ],
                    yAxes: [
                      {
                        id: "value-axis",
                        type: "linear",
                        scaleLabel: "rgba(255, 255, 255, 0.8)",
                        stacked: true,
                        gridLines: {
                          color: "rgba(255, 255, 255, 0.2)"
                        },
                        ticks: {
                          suggestedMax: MAX_Y,
                          suggestedMin: 0,
                          beginAtZero: true,
                          fontColor: "rgba(255, 255, 255, 0.8)"
                        }
                      }
                    ]
                  },
                  annotation: {
                    drawTime: "afterDraw",
                    annotations: [
                      {
                        type: "line",
                        mode: "horizontal",
                        scaleID: "value-axis",
                        value: MIN_THRESHOLD,
                        borderColor: "rgba(253, 106, 2, 0.3)",
                        borderWidth: 2,
                        label: {
                          content: "+1.5°C",
                          enabled: true,
                          backgroundColor: "rgba(253, 106, 2, 0.7)"
                        }
                      },
                      {
                        type: "line",
                        mode: "horizontal",
                        scaleID: "value-axis",
                        value: MAX_THRESHOLD,
                        borderColor: "red",
                        borderWidth: 1,
                        label: {
                          content: "+2°C",
                          enabled: true,
                          backgroundColor: "rgba(255, 0, 0, 0.7)"
                        }
                      }
                    ]
                  }
                }}
                width={300}
                height={258}
                redraw
              />
            </Col>
          </Row>
          <Row className="current">
            <Col>
              Current CO₂ levels: <span className="bold">{totalCO2 || 0}</span>{" "}
              Mt
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default React.memo(GlobalStats);
