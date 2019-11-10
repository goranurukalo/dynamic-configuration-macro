const { createMacro, MacroError } = require('babel-plugin-macros');

const DEFAULT_CONFIG_NAME = 'defaultConfig';
const getValue = (path) => {
  switch (path.type) {
    case 'CallExpression':
      return path.node.arguments[0].value;
    case 'TaggedTemplateExpression':
      return path.node.quasi.quasis[0].value.cooked;
    default:
      return null;
  }
};

module.exports = createMacro(({ babel: { types: t }, references: { default: paths } }) => {
  paths.forEach(({ parentPath }) => {
    const value = getValue(parentPath);

    if (!value) {
      const { line } = parentPath.node.loc.start;
      throw new MacroError(`Invalid input given to dc.macro at line ${line}`);
    }

    const firstPart = !!process.env.SUPPRESS_DC ? '' : `${DEFAULT_CONFIG_NAME} && ${DEFAULT_CONFIG_NAME}["${value}"] || `;
    const secondPart = `process.env.${value}`;

    const newValue = `${firstPart}${secondPart}`;
    if (newValue) {
      parentPath.replaceWithSourceString(newValue);
    }
  });
});