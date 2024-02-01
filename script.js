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

  //Highest Magnitudes
  var halfPeriod = 8;
  function findHighestMagnitudes(data) {
    const pairs = [];

    for (let i = 0; i < data.length; i += halfPeriod) {
      let highestY = -Infinity;
      let highestX = null;

      for (let j = i; j < i + halfPeriod && j < data.length; j++) {
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

  const highestYInPairs = findHighestMagnitudes(data);
  console.log("Highest Magnitudes:", highestYInPairs);




  //Slope
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




  //Period Types
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

  //Graph No Slope
  var currentSlope = 0;
  var flatData = [];

  for (let i = 0; i < data.length; i++) {
    flatData.push({ x: data[i].x, y: data[i].y - currentSlope });
    currentSlope += averageSlope;
  }

  //List Per Period
  var seperatePeriods = [];
  for (let i = 0; i < highestYInPairs.length - 1; i++) {
    seperatePeriods.push([]);
    for (let l = highestYInPairs[i].x; l < highestYInPairs[i + 1].x; l++) {
      seperatePeriods[i].push({ x: flatData[l].x, y: flatData[l].y })
    }
  }
  console.log('Seperate Periods:', seperatePeriods);

  //Find Matches
  function findMatchingPeriods(arr) {
    const indexMap = new Map();
    const result = [];

    arr.forEach((item, index) => {
      if (indexMap.has(item)) {
        indexMap.get(item).push(index);
      } else {
        indexMap.set(item, [index]);
      }
    });

    indexMap.forEach((indices) => {
      if (indices.length > 1) {
        result.push(indices);
      }
    });

    return result;
  }

  const matchingPeriods = findMatchingPeriods(periodTypes);

  console.log('Matches:', matchingPeriods);

  //Stretch Period
  var stretchedPeriods = [];
  for (let i = 0; i < matchingPeriods.length; i++) {

    function stretchCoords(coords, newLength) {
      if (coords.length < 2) {
        console.error('Not enough data');
        return;
      }

      //Calculate the stretch factor
      const stretchFactor = (coords.length - 1) / (newLength - 1);
      let stretchedCoords = [];

      for (let i = 0; i < newLength; i++) {
        const origIndex = i * stretchFactor;

        const lowerIndex = Math.floor(origIndex);
        const upperIndex = Math.ceil(origIndex);

        const interpFactor = origIndex - lowerIndex;

        const yValue = coords[lowerIndex].y + interpFactor * (coords[Math.min(upperIndex, coords.length - 1)].y - coords[lowerIndex].y);

        stretchedCoords.push({ x: i + 1, y: yValue });
      }

      return stretchedCoords;
    }

    const originalCoords = seperatePeriods[matchingPeriods[i][matchingPeriods[i].length - 1]];
    const newLength = seperatePeriods[matchingPeriods[i][0]].length;

    const tempStretchedCoords = stretchCoords(originalCoords, newLength);
    stretchedPeriods.push(tempStretchedCoords);
  }

  console.log('Stretched Periods:', stretchedPeriods);


  //Trend Substracted Periods
  var diff = 0;
  var substractedPeriods = [];
  for (i = 0; i < stretchedPeriods.length; i++) {
    substractedPeriods.push([]);
    var coordCount = stretchedPeriods[i].length;
    for (l = 0; l < coordCount; l++) {
      diff = (stretchedPeriods[i][l].y) - (seperatePeriods[matchingPeriods[i][0]][l].y);
      console.log(diff);
      substractedPeriods[i].push({ x: [l], y: ((stretchedPeriods[i][l].y) + diff) })
    }
  }
  console.log('Substracted Periods:', substractedPeriods);

  //Implement Slope + Paste Prediction
  var addedSlope = averageSlope * data.length;
  var predictedPeriods = [];
  var predictedData = [...data];
  var currentCount = 0;

  for (i = 0; i < substractedPeriods.length; i++) {
    predictedPeriods.push([]);
    for (l = 0; l < substractedPeriods[i].length; l++) {
      addedSlope += averageSlope;
      predictedPeriods[i].push({ x: substractedPeriods[i][l].x, y: (substractedPeriods[i][l].y + addedSlope) });
    }

    //Paste Prediction Periods

    for (m = 0; m < predictedPeriods[i].length; m++) {
      predictedData.push({ x: (data.length + currentCount), y: predictedPeriods[i][m].y })
      currentCount++;
    }
  }
  console.log('Predicted Periods:', predictedPeriods);




  //Graph
  let visibleGraph = predictedData;

  const width = 600;
  const height = 400;
  const margin = { top: 70, right: 70, bottom: 70, left: 70 };
  const svg = d3.select("#graph").attr("width", width).attr("height", height);

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(visibleGraph, (d) => d.x)])
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([d3.max(visibleGraph, (d) => d.y), d3.min(visibleGraph, (d) => d.y)])
    .range([height - margin.bottom, margin.top]);

  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(d3.curveCardinal);


  const xValues = highestYInPairs.map((point) => point.x);
  const yValues = highestYInPairs.map((point) => point.y);

  svg.selectAll("circle")
    .data(visibleGraph)
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

      if (d.x > data.length) {
        return "blue";
      }


    });

  svg
    .append("path")
    .datum(visibleGraph)
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
    .data(visibleGraph)
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
