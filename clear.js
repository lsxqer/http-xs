
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

const outDir = "./lib", types = "./@types", testDir = "./coverage";
rmFile([outDir, types, testDir]);

