const fetchUrl = require("fetch").fetchUrl;

const getMarkets = ({ fetchPrice }) => {
	return new Promise((resolve, reject) => {
		if (!fetchPrice) {
			return resolve({
				XRB_BTC_PRICE: 0,
				XRB_ETH_PRICE: 0,
			});
		}
		return fetchUrl('https://api.bitgrail.com/v1/markets', (err, meta, response) => {
			if(err) {
				return reject(err);
			}

			const responseString = response.toString();
			if (responseString === 'Website in maintenance') {
				const error = new Error('Bitgrail (XRB) is down for maintainence');
				return reject(error);
			}

			const { response: { BTC, XRB } } = response;
			const XRBBTC = BTC.find(pair => pair.market === 'XRB/BTC');
			const XRBETH = XRB.find(pair => pair.market === 'ETH/XRB');
			return resolve({
				XRB_BTC_PRICE: parseFloat(XRBBTC.bid),
				XRB_ETH_PRICE: 1/parseFloat(XRBETH.bid),
			});
		});
	});
}

module.exports = { 
	getMarkets,
};
