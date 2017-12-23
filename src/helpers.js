const thousandSep = val => {
	const parts = String(val).split('.');
	const part1 = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	const part2 = parts[1];
	return `${part1}${part2 ? '.' + part2 : ''}`
}

module.exports = {
	thousandSep,
}

