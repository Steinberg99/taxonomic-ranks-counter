import fs, { writeFile } from "fs";
import * as d3 from "d3";
import { count } from "console";

loadFile();

// Load the raw data and pass it to the parseData function
function loadFile() {
  fs.readFile("rawData.txt", { encoding: "utf-8" }, function (err, data) {
    if (!err) {
      const parsedData = d3.shuffle(d3.tsvParse(data));
      console.log("#Entries in data: ", data.length);
      const selection = parsedData.slice(0, 50000);

      parseDataToCount(selection);
      parseDataToIds(selection);
    } else {
      console.log(err);
    }
  });
}

// Parse the data into the desired form
function parseDataToCount(data) {
  const section = data.map(countFilterProperties);
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

  // Write data to file
  writeDataFile("Count", countArray);
}

// Parse the data into the desired form
function parseDataToIds(data) {
  const section = data.map(idsFilterProperties);
  const idsArray = [];

  section.forEach((item) => {
    if (idsArray.some((e) => e.taxonomicRankName === item.genus)) {
      idsArray
        .find((e) => e.taxonomicRankName === item.genus)
        .ids.push(item.id);
    } else {
      idsArray.push(createIdObject(item.genus, item.id));
    }
  });

  writeDataFile("Ids", idsArray);
}

// Write the data into a new file
function writeDataFile(fileName, data, fileIndex = 0) {
  fs.writeFile(
    fileName + "_" + fileIndex + ".json",
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

// Filter properties for the count
function countFilterProperties(item) {
  return {
    kingdom: item["kingdom"],
    phylum: item["phylum"],
    class: item["class"],
    order: item["order"],
    family: item["family"],
    genus: item["genus"],
  };
}

// Filter properties for the ids
function idsFilterProperties(item) {
  return {
    genus: item["genus"],
    id: item["gbifID"],
  };
}

// Create the count object
function createCountObject(name, rank) {
  return {
    taxonomicRankName: name,
    rank: rank,
    count: 1,
    children: [],
  };
}

// Create the id object
function createIdObject(rank, id) {
  return {
    taxonomicRankName: rank,
    ids: [id],
  };
}
