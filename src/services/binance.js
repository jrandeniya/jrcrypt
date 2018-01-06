const fetchUrl = require("fetch").fetchUrl;
const binance = require('node-binance-api');

const getMarkets = ({ fetchPrice }) => {
	return new Promise((resolve, reject) => {
		if (!fetchPrice) {
			return resolve({
				ADA_BTC_PRICE: 0,
				ADA_ETH_PRICE: 0,
				REQ_BTC_PRICE: 0,
				REQ_ETH_PRICE: 0,
				IOTA_BTC_PRICE: 0,
				IOTA_ETH_PRICE: 0,
				XLM_BTC_PRICE: 0,
				XLM_ETH_PRICE: 0,
			});
		}
		return binance.prices(ticker => {
			const { ADABTC, ADAETH, REQBTC, REQETH, IOTABTC, IOTAETH, XLMBTC, XLMETH } = ticker;
			return resolve({
				ADA_BTC_PRICE: parseFloat(ADABTC),
				ADA_ETH_PRICE: parseFloat(ADAETH),
				REQ_BTC_PRICE: parseFloat(REQBTC),
				REQ_ETH_PRICE: parseFloat(REQETH),
				IOTA_BTC_PRICE: parseFloat(IOTABTC),
				IOTA_ETH_PRICE: parseFloat(IOTAETH),
				XLM_BTC_PRICE: parseFloat(XLMBTC),
				XLM_ETH_PRICE: parseFloat(XLMETH),
			});
		});
	});
}

module.exports = { 
	getMarkets,
};