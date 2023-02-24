const fs = require('fs')
const path = require('path')
const fileToCheck = 'widgets/messages.less'
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(fileToCheck)
});

const fontAwesomeVariablesInFile = []
lineReader.on('line', function (line) {
  // if line contains "content"
  if (line.includes("@fa")) {
    // if line contains "content"
    if (line.includes("content")) {
      // split line by content: 
      const splitLineName = line.split("content: ")
      // get the variable name
      const variableName = splitLineName[1].replace(";", "").trim()
      fontAwesomeVariablesInFile.push(variableName)
    }else if (line.includes("(")) {
      // console.log(line);
      // split line by (
      const splitLineName = line.split("(")[1].split(")")[0];
      // get the variable name
      const variableName = splitLineName.trim();
      fontAwesomeVariablesInFile.push(variableName)
    }
  };
});
// on line reader close
lineReader.on('close', function () {
  var overwrittenVariableFileCheck = require('readline').createInterface({
    input: require('fs').createReadStream('overrides.less')
  });
  const overwrittenVariables = []
  overwrittenVariableFileCheck.on('line', function (line) {
    // split line by ":"
    const splitLineName = line.split(":")[0].trim();
    overwrittenVariables.push(splitLineName);
  });
  overwrittenVariableFileCheck.on('close', function () {
    // get the variables that are not overwritten yet
    const variablesNotOverwritten = fontAwesomeVariablesInFile.filter(variable => !overwrittenVariables.includes(variable))
    // write to overridesToDo.txt file
    // remove duplicates
    const uniqueVariablesNotOverwritten = [...new Set(variablesNotOverwritten)];
    fs.writeFileSync(
      path.resolve(__dirname, 'overridesToDo.txt'),
      uniqueVariablesNotOverwritten.map((variable) => `${variable}: ;`).join('\n'),
      'utf8'
    );
  });
});