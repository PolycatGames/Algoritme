document.addEventListener("DOMContentLoaded", function () {
  let data = [
    { x: 1, y: 0.677 },
    { x: 2, y: 0.704 },
    { x: 3, y: 0.630 },
    { x: 4, y: 0.522 },
    { x: 5, y: 0.396 },
    { x: 6, y: 0.337 },
    { x: 7, y: 0.374 },
    { x: 8, y: 0.442 },
    { x: 9, y: 0.490 },
    { x: 10, y: 0.547 },
    { x: 11, y: 0.613 },
    { x: 12, y: 0.563 },
    { x: 13, y: 0.429 },
    { x: 14, y: 0.398 },
    { x: 15, y: 0.428 },
    { x: 16, y: 0.419 },
    { x: 17, y: 0.308 },
    { x: 18, y: 0.270 },
    { x: 19, y: 0.301 },
    { x: 20, y: 0.402 },
    { x: 21, y: 0.511 },
    { x: 22, y: 0.495 },
    { x: 23, y: 0.407 },
    { x: 24, y: 0.317 },
    { x: 25, y: 0.184 },
    { x: 26, y: 0.210 },
    { x: 27, y: 0.330 },
    { x: 28, y: 0.418 },
    { x: 29, y: 0.488 },
    { x: 30, y: 0.530 },
    { x: 31, y: 0.475 },
    { x: 32, y: 0.480 },
    { x: 33, y: 0.466 },
    { x: 34, y: 0.490 },
    { x: 35, y: 0.496 },
    { x: 36, y: 0.491 },
    { x: 37, y: 0.410 },
  ]

  function findHighestYInPairs(data) {
    const pairs = [];

    for (let i = 0; i < data.length; i += 8) {
      let highestY = -Infinity;
      let highestX = null;

      for (let j = i; j < i + 8 && j < data.length; j++) {
        const point = data[j];
        if (point.y > highestY) {
          highestY = point.y;
          highestX = point.x;
        }
      }

      if (highestX !== null) {
        pairs.push({ x: highestX, y: highestY });
      }
    }
    return pairs;
  }

  const highestYInPairs = findHighestYInPairs(data);
  console.log("Highest Magnitudes:", highestYInPairs);

  function calculateSlope(point1, point2) {
    return (point2.y - point1.y) / (point2.x - point1.x);
  }

  const slopes = [];
  for (let i = 0; i < highestYInPairs.length - 1; i++) {
    const slope = calculateSlope(highestYInPairs[i], highestYInPairs[i + 1]);
    slopes.push(slope);
  }

  const sumOfSlopes = slopes.reduce((acc, slope) => acc + slope, 0);
  const averageSlope = sumOfSlopes / slopes.length;

  console.log("Average Slope:", averageSlope);

  var iteration = 0;
  let periodTypes = [];
  let periodAmps = [];

  periodType();
  function periodType() {

    var lastY = Infinity;
    var downDetection = 0;
    var upDetection = 0;
    var lowestValue = Infinity;

    for (let i = highestYInPairs[0 + iteration].x; i < highestYInPairs[1 + iteration].x; i++) {

      if (data[i].y > lastY && downDetection < 1) {
        downDetection++;
      }
      if (downDetection > 0 && data[i].y < lastY && upDetection < 1) {
        upDetection++;
        periodTypes.push(1);
      }

      if (data[i].y < lowestValue) {
        lowestValue = data[i].y;
      }


      lastY = data[i].y;

    }

    periodAmps.push((highestYInPairs[0 + iteration].y) - (lowestValue));


    if (upDetection == 0) {
      periodTypes.push(0);
    }
    if (iteration < highestYInPairs.length - 2) {
      iteration++;
      periodType();
    }
  }

  console.log("Period Types:", periodTypes);
  console.log("Period Amplitudes:", periodAmps);


  //Graph
  const width = 600;
  const height = 400;
  const margin = { top: 70, right: 70, bottom: 70, left: 70 };
  const svg = d3.select("#graph").attr("width", width).attr("height", height);

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.x)])
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([d3.max(data, (d) => d.y), d3.min(data, (d) => d.y)])
    .range([height - margin.bottom, margin.top]);

  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(d3.curveCardinal);


  const xValues = highestYInPairs.map((point) => point.x);
  const yValues = highestYInPairs.map((point) => point.y);

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "data-point")
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("r", 4.5)
    .style("fill", (d) => {

      const index = xValues.indexOf(d.x);
      if (index !== -1 && yValues[index] === d.y) {
        return "red";
      }
    });

  svg
    .append("path")
    .datum(data)
    .attr("class", "data-line")
    .attr("d", lineGenerator)
    .attr("fill", "none");

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "data-point")
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("r", 4.5);

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height)
    .attr("dy", -20)
    .text("Dagen");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", -height / 2)
    .attr("y", 10)
    .attr("dy", 20)
    .attr("transform", "rotate(-90)")
    .text("Magnitude");

  const slope = -0.00625;
  const startingPoint = highestYInPairs[0];


  const endPointX = 37;
  const endPointY = startingPoint.y + (endPointX - startingPoint.x) * slope;

  const lineData = [startingPoint, { x: endPointX, y: endPointY }];

  const lineGeneratorSlope = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(d3.curveCardinal);

  svg
    .append("path")
    .datum(lineData)
    .attr("class", "data-line-slope")
    .attr("d", lineGeneratorSlope)
    .attr("fill", "none")
    .attr("stroke", "orange");

});
