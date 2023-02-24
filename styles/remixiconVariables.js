const fs = require('fs')
const path = require('path')
const readline = require('readline')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('remixicon.less')
});

const remixIconVariables = []
lineReader.on('line', function (line) {
  // if line contains "content"
  if (line.includes("content")) {
    // split line by ":"
    const splitLineName = line.split(":")
    // get the variable name
    const variableName = splitLineName[0].replace(".", "@").trim()
    // get the variable value
    const variableValue = line.split("content: ")[1].split('; }')[0]
    // add to remixIconVariables
    remixIconVariables.push({
      variableName,
      variableValue
    })
  };
});
// on line reader close
lineReader.on('close', function () {
  // write to .less file
  fs.writeFileSync(
    path.resolve(__dirname, 'remixiconVariables.less'),
    remixIconVariables.map(({ variableName, variableValue }) => `${variableName}: ${variableValue};`).join('\n'),
    'utf8'
  );
});