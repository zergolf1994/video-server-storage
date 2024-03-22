exports.extractMaster = (data) => {
  try {
    return new Promise(function (resolve, reject) {
      data.forEach((k, i) => {
        if (k.match(/EXT-X-STREAM-INF(.*?)-/gm)) {
          const lineArray = k.split(",");
          resolve(lineArray);
        }
      });
    });
  } catch (error) {
    return { error: true };
  }
};

exports.extractIndex = (data) => {
  try {
    return new Promise(function (resolve, reject) {
      const array = [],
        regex = /seg-(.*?)-/gm;
      data.forEach((k, i) => {
        if (k.match(regex)) {
          let nameitem = k.match(regex);
          let numitem = nameitem
            .toString()
            .replace("seg-", "")
            .replace("-", "")
            .replace(".ts", "")
            .replace("-v1", "")
            .replace("-a1", "");
          array.push(Number(numitem));
        } else {
          if (k) {
            array.push(k.trim());
          }
        }
        resolve(array);
      });
    });
  } catch (error) {
    return { error: true };
  }
};
