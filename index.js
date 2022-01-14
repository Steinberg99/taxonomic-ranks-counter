import fs, { writeFile } from "fs";
import * as d3 from "d3";
import { count } from "console";

loadFile();

// Load the raw data and pass it to the parseData function
function loadFile() {
  fs.readFile("rawData.txt", { encoding: "utf-8" }, function (err, data) {
    if (!err) {
      parseData(data);
    } else {
      console.log(err);
    }
  });
}

// Parse the data into the desired form
function parseData(source) {
  const data = d3.tsvParse(source);
  console.log("#Entries in data: ", data.length);
  const section = data.map(filterProperties);
  const countArray = [];

  // I know, this code is really bad
  section.forEach((item) => {
    // Kingdom
    if (countArray.some((e) => e.taxonomicRankName === item.kingdom)) {
      countArray.find((e) => e.taxonomicRankName === item.kingdom).count++;
    } else {
      countArray.push(createCountObject(item.kingdom));
    }

    // Phylum
    if (
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.some((e) => e.taxonomicRankName === item.phylum)
    ) {
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum).count++;
    } else {
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.push(createCountObject(item.phylum));
    }

    // Class
    if (
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.some((e) => e.taxonomicRankName === item.class)
    ) {
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.find((e) => e.taxonomicRankName === item.class).count++;
    } else {
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.push(createCountObject(item.class));
    }

    // Order
    if (
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.find((e) => e.taxonomicRankName === item.class)
        .children.some((e) => e.taxonomicRankName === item.order)
    ) {
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.find((e) => e.taxonomicRankName === item.class)
        .children.find((e) => e.taxonomicRankName === item.order).count++;
    } else {
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.find((e) => e.taxonomicRankName === item.class)
        .children.push(createCountObject(item.order));
    }

    // Family
    if (
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.find((e) => e.taxonomicRankName === item.class)
        .children.find((e) => e.taxonomicRankName === item.order)
        .children.some((e) => e.taxonomicRankName === item.family)
    ) {
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.find((e) => e.taxonomicRankName === item.class)
        .children.find((e) => e.taxonomicRankName === item.order)
        .children.find((e) => e.taxonomicRankName === item.family).count++;
    } else {
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.find((e) => e.taxonomicRankName === item.class)
        .children.find((e) => e.taxonomicRankName === item.order)
        .children.push(createCountObject(item.family));
    }

    // Genus
    if (
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.find((e) => e.taxonomicRankName === item.class)
        .children.find((e) => e.taxonomicRankName === item.order)
        .children.find((e) => e.taxonomicRankName === item.family)
        .children.some((e) => e.taxonomicRankName === item.genus)
    ) {
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.find((e) => e.taxonomicRankName === item.class)
        .children.find((e) => e.taxonomicRankName === item.order)
        .children.find((e) => e.taxonomicRankName === item.family)
        .children.find((e) => e.taxonomicRankName === item.genus).count++;
    } else {
      countArray
        .find((e) => e.taxonomicRankName === item.kingdom)
        .children.find((e) => e.taxonomicRankName === item.phylum)
        .children.find((e) => e.taxonomicRankName === item.class)
        .children.find((e) => e.taxonomicRankName === item.order)
        .children.find((e) => e.taxonomicRankName === item.family)
        .children.push(createCountObject(item.genus));
    }
  });

  writeDataFile(countArray);
}

// Write the data into a new file
function writeDataFile(data, fileIndex = 0) {
  fs.writeFile(
    "data_" + fileIndex + ".json",
    JSON.stringify(data, null, 4),
    { encoding: "utf8", flag: "wx" },
    function (err) {
      //Check if filename already exists, if it does, increase the number at the end by 1
      if (err && err.code == "EEXIST") {
        writeDataFile(data, ++fileIndex);
      } else if (err) {
        return console.log(err);
      } else {
        console.log("The file was saved!", "data_" + fileIndex + ".json");
      }
    }
  );
}

function filterProperties(item) {
  return {
    kingdom: item["kingdom"],
    phylum: item["phylum"],
    class: item["class"],
    order: item["order"],
    family: item["family"],
    genus: item["genus"]
  };
}

function createCountObject(name, rank) {
  return {
    taxonomicRankName: name,
    rank: rank,
    count: 1,
    children: []
  };
}
