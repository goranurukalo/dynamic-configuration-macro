let defaultConfig = {};
const x1 = defaultConfig && defaultConfig["ABC"] || process.env.ABC;
const x2 = defaultConfig && defaultConfig["ABCD"] || process.env.ABCD;