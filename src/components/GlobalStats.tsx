import numeral from "numeral";
import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Line, defaults } from "react-chartjs-2";
import { LeaderboardResponse } from "../types";
import "./GlobalStats.css";
import "chartjs-plugin-annotation";

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
  emissionsByCountry: LeaderboardResponse["emissionsByCountry"];
  treesByCountry: LeaderboardResponse["treesByCountry"];
};

type TimeSeries = {
  times: Date[];
  values: number[];
};

// we don't show consecutive CO₂ points with the same value, unless they're
// this many seconds apart from each other
const MAX_INTERVAL_NO_PTS_SECONDS = 60;

const byCountryToGlobal = (byCountry: { [countryId: string]: number }) =>
  Object.values(byCountry).reduce((prev, current) => prev + current, 0);

const GlobalStats = (props: GlobalStatsProps) => {
  const [localStorageLoaded, setLocalStorageLoaded] = useState(false);
  const [co2, setCO2] = useState<TimeSeries>({ times: [], values: [] });
  const [trees, setTrees] = useState<TimeSeries>({ times: [], values: [] });
  const [netCO2, setNetCO2] = useState<TimeSeries>({ times: [], values: [] });
  const [lastPointAddedTime, setPointAddedTime] = useState(new Date(0));

  const loadFromLocalStorage = () => {
    const co2: TimeSeries = JSON.parse(
      localStorage.getItem("co2") || '{"times":[],"values":[]}'
    );
    const trees: TimeSeries = JSON.parse(
      localStorage.getItem("trees") || '{"times":[],"values":[]}'
    );

    const initialNetCO2: TimeSeries = { times: [], values: [] };

    // trees and co2 should always have the same length, but...
    const maxLength = Math.min(co2.values.length, trees.values.length);

    if (co2.values.length && trees.values.length) {
      // always display the oldest point
      initialNetCO2.times.push(co2.times[0]);
      initialNetCO2.values.push(co2.values[0] - trees.values[0]);
      let lastNetCO2 = -666;

      // compact values (don't display 2 consecutive points with the same value)
      for (let i = 1; i < maxLength - 1; i++) {
        const net = co2.values[i] - trees.values[i];
        if (net !== lastNetCO2) {
          initialNetCO2.times.push(co2.times[i]);
          initialNetCO2.values.push(net);
          lastNetCO2 = net;
        }
      }

      // always display the latest point
      const last = co2.values[maxLength - 1] - trees.values[maxLength - 1];
      const lastTime = co2.times[maxLength - 1];

      // we want at least 2 points; if latest === last, replace it
      if (last === lastNetCO2 && maxLength > 2) {
        initialNetCO2.times[initialNetCO2.times.length - 1] = lastTime;
        initialNetCO2.values[initialNetCO2.values.length - 1] = last;
      } else {
        initialNetCO2.times.push(lastTime);
        initialNetCO2.values.push(last);
      }
    }

    setCO2({
      times: co2.times.slice(0, maxLength),
      values: co2.values.slice(0, maxLength)
    });
    setTrees({
      times: trees.times.slice(0, maxLength),
      values: trees.values.slice(0, maxLength)
    });
    setPointAddedTime(
      initialNetCO2.times.length
        ? new Date(initialNetCO2.times[initialNetCO2.times.length - 1])
        : new Date(0)
    );
    setNetCO2(initialNetCO2);
    setLocalStorageLoaded(true);
  };

  const updateNetCO2 = () => {
    // we want to always have at least 2 points (one at (0,0), and the latest)
    if (co2.values.length > 1 && trees.values.length > 1) {
      const [latestCO2] = co2.values.slice(-1);
      const [latestTrees] = trees.values.slice(-1);
      const now = new Date();
      const newNetCO2 = latestCO2 - latestTrees;
      const latestNetCO2 = netCO2.values[netCO2.values.length - 1];
      const secondsSinceLastAdd =
        (now.valueOf() - lastPointAddedTime.valueOf()) / 1000;
      if (
        !netCO2.values.length ||
        newNetCO2 !== latestNetCO2 ||
        secondsSinceLastAdd > MAX_INTERVAL_NO_PTS_SECONDS
      ) {
        setNetCO2({
          times: [...netCO2.times, now],
          values: [...netCO2.values, newNetCO2]
        });
        setPointAddedTime(new Date());
      } else if (newNetCO2 === latestNetCO2) {
        // replace the latest value with the new one
        const netCO2TimesCopy = [...netCO2.times];
        const netCO2ValuesCopy = [...netCO2.values];
        netCO2TimesCopy[netCO2TimesCopy.length - 1] = now;
        netCO2ValuesCopy[netCO2ValuesCopy.length - 1] = newNetCO2;
        setNetCO2({ times: netCO2TimesCopy, values: netCO2ValuesCopy });
      }
    }
  };

  // fetch previous data on startup, if we had any
  useEffect(loadFromLocalStorage, []);

  // update CO2 and trees whenever we fetch new values
  useEffect(() => {
    if (localStorageLoaded) {
      const globalCO2 = byCountryToGlobal(props.emissionsByCountry);
      const newCO2 = {
        ...co2,
        times: [...co2.times, new Date()],
        values: [...co2.values, globalCO2]
      };
      setCO2(newCO2);
      localStorage.setItem("co2", JSON.stringify(newCO2));
      // we might have been notified of a new CO2 value, but not yet of trees
      if (co2.values.length === trees.values.length) updateNetCO2();
    }
  }, [props.emissionsByCountry]);

  useEffect(() => {
    if (localStorageLoaded) {
      const globalTrees = byCountryToGlobal(props.treesByCountry);
      const newTrees = {
        ...trees,
        times: [...trees.times, new Date()],
        values: [...trees.values, globalTrees]
      };
      setTrees(newTrees);
      localStorage.setItem("trees", JSON.stringify(newTrees));
      // we might have been notifid of a new trees value, but not yet of CO2
      if (co2.values.length === trees.values.length) updateNetCO2();
    }
  }, [props.treesByCountry]);

  const getBeerPrice = () => {
    if (!netCO2.values.length) return "2.00";
    const currentCO2 = netCO2.values[netCO2.values.length - 1];
    const price = Math.max(2, 2 + (currentCO2 - MIN_THRESHOLD) * 0.005 * 0.001);
    return numeral(price).format("0.00");
  };

  return (
    <>
      <h4>Global emissions</h4>
      <Row className="global-stats" noGutters>
        <Col>
          <Row>
            <Col>
              <Line
                data={{
                  labels: netCO2.times,
                  datasets: [
                    {
                      label: "CO₂ (Mt)",
                      data: netCO2.values,
                      pointBorderWidth: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }
                  ]
                }}
                options={{
                  animation: { duration: 0 },
                  showLine: true,
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
              Current CO₂ levels:{" "}
              <span className="bold">
                {netCO2.values.length
                  ? netCO2.values[netCO2.values.length - 1]
                  : 0}
              </span>{" "}
              Mt
            </Col>
          </Row>
          <Row className="beer">
            <Col>
              Current beer price:{" "}
              <span className="bold">₲{getBeerPrice()}</span>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default React.memo(GlobalStats);
