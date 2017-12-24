require('dotenv').config();

const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const BTCMarkets  = require('btc-markets');
const binance = require('node-binance-api');
const currencyFormatter = require('currency-formatter');
const { thousandSep } = require('./helpers');

const app = express();
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))
app.set('view engine', 'ejs');

const port = process.env.PORT;
const btcm = new BTCMarkets(null, null);

app.get('/', async (req, res) => {
	const coins = {
		btc: parseFloat(req.query.BTC) || 0,
		ada: parseFloat(req.query.ADA) || 0,
		aud: parseFloat(req.query.AUD) || 0,
	};
	const GET_BTC_AUD_PRICE = new Promise((resolve, reject) => btcm.getTick("BTC", "AUD", (err, data) => err ? reject(err) : resolve(data.lastPrice)));
	const GET_ETH_AUD_PRICE = new Promise((resolve, reject) => btcm.getTick("ETH", "AUD", (err, data) => err ? reject(err) : resolve(data.lastPrice)));
	const GET_ALT_PRICES = new Promise((resolve, reject) => binance.prices(ticker => resolve(ticker)));

	let BTC_AUD_PRICE, ETH_AUD_PRICE, ADAETH, ADABTC;
	try {
		[ BTC_AUD_PRICE, ETH_AUD_PRICE, { ADAETH, ADABTC } ] = await Promise.all([
			GET_BTC_AUD_PRICE,
			GET_ETH_AUD_PRICE,
			GET_ALT_PRICES,
			]);
	} catch (e) {
		return res.render('pages/error', { error: e.message });
	}

	const DATA_RETRIEVED = new Date();
	const ADA_BTC_PRICE = parseFloat(ADABTC);
	const ADA_ETH_PRICE = parseFloat(ADAETH);

	const btc_value = BTC_AUD_PRICE * coins.btc;
	const ada_value_via_btc = BTC_AUD_PRICE * ADA_BTC_PRICE * coins.ada;
	const ada_value_via_eth = ETH_AUD_PRICE * ADA_ETH_PRICE * coins.ada;
	const max_ada_value = Math.max(ada_value_via_eth, ada_value_via_btc);

	const data = {	
		DATA_RETRIEVED,
		PATH: req.protocol + '://' + req.get('host'),
		TOTAL_PORTFOLIO_VALUE: currencyFormatter.format(btc_value + max_ada_value, { code: 'AUD' }),
		PORTFOLIO_DIFF: {
			value: (coins.aud ? (btc_value + max_ada_value - coins.aud) / coins.aud : 0) * 100,
		},
		AUD: {
			total_coins_raw: coins.aud,
			total_coins: thousandSep(coins.aud),
		},
		BITCOIN: {
			total_coins_raw: coins.btc,
			total_coins: thousandSep(coins.btc),
			market_price_aud: currencyFormatter.format(BTC_AUD_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(btc_value, { code: 'AUD' }),
		},
		CARDANO: {
			total_coins_raw: coins.ada,
			total_coins: thousandSep(coins.ada),
			market_price_aud_via_btc: currencyFormatter.format(BTC_AUD_PRICE * ADA_BTC_PRICE, { code: 'AUD', precision: 4 }),
			market_price_aud_via_eth: currencyFormatter.format(ETH_AUD_PRICE * ADA_ETH_PRICE, { code: 'AUD', precision: 4 }),
			current_value: currencyFormatter.format(max_ada_value, { code: 'AUD' }),
			current_value_via: ada_value_via_eth >= ada_value_via_btc ? '(via ETH)' : '(via BTC)',
		},
	};

	data.PORTFOLIO_DIFF.class = data.PORTFOLIO_DIFF.value >= 0 ? 'positive' : 'negative';
	data.PORTFOLIO_DIFF.value = `${data.PORTFOLIO_DIFF.value >= 0 ? '+' : ''}${thousandSep(data.PORTFOLIO_DIFF.value.toFixed(2))}`;

	return res.render('pages/home', data);
});

app.listen(port, () => console.log('We are live on ' + port));