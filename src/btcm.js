const fetchUrl = require("fetch").fetchUrl;
const BTCMarkets  = require('btc-markets');

const btcm = new BTCMarkets(null, null);

const getPrice = ({ tick, fetchPrice }) => {
	return new Promise((resolve, reject) => {
		if (!fetchPrice) {
			return resolve(0);
		}
		return btcm.getTick(tick, 'AUD', (err, data) => err ? reject(err) : resolve(data.lastPrice));
	});
}

module.exports = { 
	getPrice,
};