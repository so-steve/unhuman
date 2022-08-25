const colors = [
  "Red",
  "Magenta",
  "Lime",
  "Yellow",
  "Blue",
  "Cyan",
  "Orangered",
  "Purple",
];

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function makeColorArray(colorArray, colorsNumber, length) {
  let newArray = shuffle(colorArray);
  let slicedArray = newArray.slice(0, colorsNumber);
  let newnewArray = slicedArray;
  if (slicedArray.length < length) {
    for (let i = slicedArray.length; i < length; i++) {
      let onlyValidValues = newnewArray.filter(
        (v) => v !== newnewArray[newnewArray.length - 1]
      );
      let color =
        onlyValidValues[Math.floor(Math.random() * onlyValidValues.length)];
      newnewArray.push(color);
    }
  }
  return slicedArray;
}

console.log(makeColorArray(colors, 3, 10));
