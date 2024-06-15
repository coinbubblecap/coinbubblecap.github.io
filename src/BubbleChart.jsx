import * as d3 from "d3";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import "./BubbleChart.css";

const BubbleChartComponent = ({ tokens }) => {
  const svgRef = useRef(null);

  const formatCapitalization = (value) => {
    value = value / 1e18;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(0);
  };

  const minRadius = 20;
  const maxRadius = 100;

  useEffect(() => {
    if (!tokens.length) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const maxCap = Math.max(
      ...tokens.map((t) => parseFloat(t.capitalization) / 1e18)
    );

    const radiusScale = d3
      .scaleSqrt()
      .domain([0, maxCap])
      .range([minRadius, maxRadius]);

    const bubble = d3.pack().size([width, height]).padding(1.5);

    const root = d3
      .hierarchy({ children: tokens })
      .sum((d) => Math.max(1, radiusScale(parseFloat(d.capitalization) / 1e18)))
      .sort((a, b) => b.value - a.value);

    const nodes = bubble(root).leaves();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("position", "relative")
      .style("overflow", "hidden");

    const node = svg
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    node
      .append("circle")
      .attr("r", (d) => d.r)
      .style("fill", (d, i) => color(i))
      .attr("class", "pulse");

    node
      .append("text")
      .attr("dy", "-0.5em")
      .style("text-anchor", "middle")
      .style("fill", "#fff")
      .text((d) => d.data.symbol)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        window.open(
          `https://sepolia.scrollscan.com/address/${d.data.address}`,
          "_blank"
        );
      });

    node
      .append("text")
      .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .style("fill", "#fff")
      .text((d) => formatCapitalization(parseFloat(d.data.capitalization)));
  }, [tokens]);

  return <svg ref={svgRef}></svg>;
};

BubbleChartComponent.propTypes = {
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      symbol: PropTypes.string.isRequired,
      capitalization: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default BubbleChartComponent;
