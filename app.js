require('dotenv').config();

const express = require('express');
const BTCMarkets  = require('btc-markets');
const binance = require('node-binance-api');
const currencyFormatter = require('currency-formatter');

const app = express();
const port = process.env.PORT;
const btcm = new BTCMarkets(null, null);

function thousandSep(val) {
	const parts = String(val).split('.');
	const part1 = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	const part2 = parts[1];
	return (part1 + '.' + part2);
}

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
	const coins = {
		btc: parseFloat(req.query.BTC) || 0,
		ada: parseFloat(req.query.ADA) || 0,
	};

	const GET_BTC_AUD_PRICE = new Promise((resolve, reject) => btcm.getTick("BTC", "AUD", (err, data) => err ? reject(err) : resolve(data.lastPrice)));
	const GET_ADA_BTC_PRICE = new Promise((resolve, reject) => binance.prices(ticker => resolve(ticker.ADABTC)));

	const [ BTC_AUD_PRICE, STR_ADA_BTC_PRICE ] = await Promise.all([
		GET_BTC_AUD_PRICE,
		GET_ADA_BTC_PRICE,
		]);

	const DATA_RETRIEVED = new Date();

	const ADA_BTC_PRICE = parseFloat(STR_ADA_BTC_PRICE);

	const btc_value = BTC_AUD_PRICE * coins.btc;
	const ada_value = BTC_AUD_PRICE * ADA_BTC_PRICE * coins.ada;

	const data = {	
		DATA_RETRIEVED,
		TOTAL_PORTFOLIO_VALUE: currencyFormatter.format(btc_value + ada_value, { code: 'AUD' }),
		BITCOIN: {
			total_coins: thousandSep(coins.btc),
			market_price_aud: currencyFormatter.format(BTC_AUD_PRICE, { code: 'AUD' }),
			current_value: currencyFormatter.format(btc_value, { code: 'AUD' }),
		},
		CARDANO: {
			total_coins: thousandSep(coins.ada),
			market_price_btc: ADA_BTC_PRICE,
			market_price_aud: currencyFormatter.format(BTC_AUD_PRICE * ADA_BTC_PRICE, { code: 'AUD' }),
			current_value: currencyFormatter.format(ada_value, { code: 'AUD' }),
		},
	};

	return res.render('home', data);
});

app.listen(port, () => console.log('We are live on ' + port));