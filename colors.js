const colors = {
    red: "f00",
    orange: "f80",
    yellow: "ff0",
    green: "0f0",
    cyan: "0ff",
    blue: "00f",
    magenta: "f0f",
    white: "fff",
    gray: "aaa",
    black: "000"
};

const colorFunction = (col) => ((text) => `<color="${col}">${text}</>`);
const exp = {};

for (const col in colors) exp[col] = colorFunction(colors[col]);

module.exports = exp;
