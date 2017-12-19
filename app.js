require('dotenv').config();

const express = require('express');
const BTCMarkets  = require('btc-markets');
const binance = require('node-binance-api');

const app = express();
const port = process.env.PORT;
const hash = process.env.HASH;

const btcm = new BTCMarkets(null, null);

app.get('/', async (req, res) => {

	const coins = {
		btc: parseFloat(req.query.BTC) || 0,
		ada: parseFloat(req.query.ADA) || 0,
	};

	const GET_BTC_AUD_PRICE = new Promise((resolve, reject) => btcm.getTick("BTC", "AUD", (err, data) => err ? reject(err) : resolve(data.lastPrice)));
	const GET_ADA_BTC_PRICE = new Promise((resolve, reject) => binance.prices(ticker => resolve(ticker.ADABTC)));

	const [ BTC_AUD_PRICE, STR_ADA_BTC_PRICE ] = await Promise.all([
		GET_BTC_AUD_PRICE,
		GET_ADA_BTC_PRICE
		]);

	const ADA_BTC_PRICE = parseFloat(STR_ADA_BTC_PRICE);

	const btc_value = BTC_AUD_PRICE * coins.btc;
	const ada_value = BTC_AUD_PRICE * ADA_BTC_PRICE * coins.ada;

	const response = {	
		TOTAL_PORTFOLIO_VALUE: `A$${(btc_value + ada_value).toFixed(2)}`,
	};

	if (coins.btc) {
		response.BITCOIN = {
			total_coins: coins.btc,
			source: 'BTCMarkets',
			market_price_aud: BTC_AUD_PRICE,
			current_value: `A$${btc_value.toFixed(2)}`,
		};
	}

	if (coins.ada) {
		response.CARDANO = {
			total_coins: coins.ada,
			source: 'Binance',
			market_price_btc: parseFloat(ADA_BTC_PRICE),
			market_price_aud: BTC_AUD_PRICE * ADA_BTC_PRICE,
			current_value: `A$${ada_value.toFixed(2)}`,
		};
	}

	return res.json(response);
});

app.listen(port, () => console.log('We are live on ' + port));