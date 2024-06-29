const fs = require('fs');
const path = require('path');

const generate = (theme) => {
	let css = `
pre[class*="language-"],
code[class*="language-"] {
    color: ${theme.plain.color};
    background-color: ${theme.plain.backgroundColor};
}
      `;

	theme.styles.forEach(({ types, style }) => {
		const selectors = types.map((type) => `.token.${type}`).join(',\n');
		css += `
${selectors} {
  color: ${style.color || 'inherit'};
  background-color: ${style.backgroundColor || 'inherit'};
  font-style: ${style.fontStyle || 'normal'};
}
        `;
	});

	return css;
};

const theme_names = [
	'tokyonight_day',
	'tokyonight_moon',
	'tokyonight_night',
	'tokyonight_storm',
];

theme_names.forEach((th) => {
    const theme_cjs = require(`./${th}.cjs`);
    const parsed_cjs = generate(theme_cjs);

    fs.writeFileSync(path.join(__dirname, `prism-${th}.css`), parsed_cjs);
    console.log(`ok: ${th}.cjs => prism-${th}.css`);
});
