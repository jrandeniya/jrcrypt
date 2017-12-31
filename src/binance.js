const fetchUrl = require("fetch").fetchUrl;
const binance = require('node-binance-api');

const getMarkets = ({ fetchPrice }) => {
	return new Promise((resolve, reject) => {
		if (!fetchPrice) {
			return resolve({
				ADA_BTC_PRICE: 0,
				ADA_ETH_PRICE: 0,
			});
		}

		console.log('Making API call to Binance');
		return binance.prices(ticker => {
			const { ADABTC, ADAETH } = ticker;
			return resolve({
				ADA_BTC_PRICE: parseFloat(ADABTC),
				ADA_ETH_PRICE: parseFloat(ADAETH),
			})
		});
	});
}

module.exports = { 
	getMarkets,
};