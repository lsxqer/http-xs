
const fs = require("fs");

function rmFile(dirList) {
  let len = dirList.length;

  for (let i = 0; i < len; i++) {

    let dir = dirList[i];
    if (!fs.existsSync(dir)) {
      continue;
    }

    let dirInfo = fs.lstatSync(dir);
    if (dirInfo.isFile()) {
      fs.unlinkSync(dir);
      console.log(`clear  --> ${dir}`);
      continue;
    }

    if (dirInfo.isDirectory()) {
      let files = fs.readdirSync(dir).map(f => `${dir}/${f}`);
      if (files.length > 0) {
        rmFile(files);
      }
      fs.rmdirSync(dir);
    }

  }
}

const outDir = "./out", types = "./@types", testDir = "./coverage";
rmFile([outDir, types, testDir]);


const directory = "./src";


function deleteFile(paths) {
  if (!Array.isArray(paths)) {
    paths = [paths];
  }

  let nextDires = [];

  paths.forEach(path => {

    let fileInfo = fs.lstatSync(path);
    if (fileInfo.isFile()) {
      if (path.endsWith(".js")) {
        fs.unlinkSync(path);
      }
    }

    fileInfo.isDirectory() && nextDires.push(path);
  });

  nextDires.forEach(dir => deleteJs(dir));
}

function deleteJs(directory) {
  let dirInfo = fs.lstatSync(directory);

  if (dirInfo.isDirectory()) {
    let files = fs.readdirSync(directory).map(c => `${directory}/${c}`);
    deleteFile(files);
  }
}
// deleteJs(directory);