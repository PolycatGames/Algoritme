function stretchCoords(coords, newLength) {
    // Ensure there's at least two points to interpolate between
    if (coords.length < 2) {
        console.error('Need at least two coordinates to interpolate.');
        return;
    }

    // Calculate the stretch factor
    const stretchFactor = (coords.length - 1) / (newLength - 1);
    let stretchedCoords = [];

    for (let i = 0; i < newLength; i++) {
        // Calculate the corresponding index in the original array
        const origIndex = i * stretchFactor;

        // Calculate the lower and upper indices to interpolate between
        const lowerIndex = Math.floor(origIndex);
        const upperIndex = Math.ceil(origIndex);

        // Calculate the interpolation factor
        const interpFactor = origIndex - lowerIndex;

        // Interpolate the y-value
        const yValue = coords[lowerIndex].y + interpFactor * (coords[Math.min(upperIndex, coords.length - 1)].y - coords[lowerIndex].y);

        // Add the new coordinate with the interpolated y-value
        stretchedCoords.push({ x: i + 1, y: yValue });
    }

    return stretchedCoords;
}

// Example usage
const originalCoords = [{ x: 1, y: 2 }, { x: 2, y: 18 }, { x: 3, y: 6 }, { x: 4, y: 8 }, { x: 5, y: 10 }];
const newLength = 12; // The desired new length

const stretchedCoords = stretchCoords(originalCoords, newLength);
console.log(stretchedCoords);
