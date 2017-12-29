const fetchUrl = require("fetch").fetchUrl;

const getMarkets = () => {
	return new Promise((resolve, reject) => {
		return fetchUrl('https://bitgrail.com/api/v1/markets', (err, meta, response) => {
			if(err) {
				return reject(err);
			}

			const { response: { BTC, XRB } } = JSON.parse(response.toString());

			const XRBBTC = BTC.find(pair => pair.market === 'XRB/BTC');
			const XRBETH = XRB.find(pair => pair.market === 'ETH/XRB');
			
			resolve({
				XRB_BTC_PRICE: parseFloat(XRBBTC.bid),
				XRB_ETH_PRICE: 1/parseFloat(XRBETH.bid),
			});
		});
	});
}

module.exports = { 
	getMarkets,
};