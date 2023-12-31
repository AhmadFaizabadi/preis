const fs = require("fs");
const path = require("path");

const regex = /[\s\$]t\(['"](.*?)['"]\)/gm;
const messages = new Set();

function extractMessagesFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const matches = content.match(regex);

  if (matches) {
    matches.forEach((match) => {
      const message = match.match(/[\s\$]t\(['"](.*?)['"]\)/)[1];
      messages.add(message);
    });
  }
}

function extractMessagesFromDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      extractMessagesFromDirectory(filePath);
    } else if (path.extname(filePath) === ".vue") {
      extractMessagesFromFile(filePath);
    }
  });
}

// Replace 'path_to_your_vue_project_directory' with the path to your Vue.js project directory
const projectDirectory = "..";

extractMessagesFromDirectory(projectDirectory);

console.log("Extracted Messages:");
messages.forEach((message) => console.log(message));
