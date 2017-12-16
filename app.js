require('dotenv').config();

const express = require('express');
const BTCMarkets  = require('btc-markets');
const binance = require('node-binance-api');

const app = express();
const port = 8000;
const hash = process.env.HASH;
const coins = {
	btc: parseFloat(process.env.BTC),
	ada: parseFloat(process.env.ADA),
};

const btcm = new BTCMarkets(null, null);

app.get('/', async (req, res) => {

	let token = req.query.token;

	if (!hash || token !== hash) {
		return res.json({
			message: 'Access denied'
		});
	}

	const GET_BTC_AUD_PRICE = new Promise((resolve, reject) => btcm.getTick("BTC", "AUD", (err, data) => err ? reject(err) : resolve(data.lastPrice)));
	const GET_ADA_BTC_PRICE = new Promise((resolve, reject) => binance.prices(ticker => resolve(ticker.ADABTC)));

	const [ BTC_AUD_PRICE, STR_ADA_BTC_PRICE ] = await Promise.all([
		GET_BTC_AUD_PRICE,
		GET_ADA_BTC_PRICE
		]);

	const ADA_BTC_PRICE = parseFloat(STR_ADA_BTC_PRICE);

	const btc_value = BTC_AUD_PRICE * coins.btc;
	const ada_value = BTC_AUD_PRICE * ADA_BTC_PRICE * coins.ada;

	return res.json({
		BITCOIN: {
			total_coins: coins.btc,
			current_market_price_in_aud: BTC_AUD_PRICE,
			current_value: `A$${btc_value.toFixed(2)}`,
		},
		CARDANO: {
			total_coins: coins.ada,
			current_market_price_in_btc: parseFloat(ADA_BTC_PRICE),
			current_market_price_in_aud: BTC_AUD_PRICE * ADA_BTC_PRICE,
			current_value: `A$${ada_value.toFixed(2)}`,
		},		
		TOTAL_PORTFOLIO_VALUE: `A$${(btc_value + ada_value).toFixed(2)}`,
	});
});

app.listen(port, () => {
	console.log('We are live on ' + port);
});


