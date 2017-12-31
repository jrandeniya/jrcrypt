require('dotenv').config();

const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const currencyFormatter = require('currency-formatter');

const { thousandSep } = require('./helpers');
const btcm = require('./btcm');
const binance = require('./binance');
const bitgrail = require('./bitgrail');

const app = express();
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))
app.set('view engine', 'ejs');

const port = process.env.PORT;

app.get('/', async (req, res) => {
	const coins = {
		btc: parseFloat(req.query.BTC) || 0,
		eth: parseFloat(req.query.ETH) || 0,
		xrp: parseFloat(req.query.XRP) || 0,
		ada: parseFloat(req.query.ADA) || 0,
		xrb: parseFloat(req.query.XRB) || 0,
		aud: parseFloat(req.query.AUD) || 0,
	};
	const GET_BTC_AUD_PRICE = btcm.getPrice({ tick: 'BTC', fetchPrice: coins.btc + coins.ada + coins.xrb });
	const GET_ETH_AUD_PRICE = btcm.getPrice({ tick: 'ETH', fetchPrice: coins.eth + coins.ada + coins.xrb });
	const GET_XRP_AUD_PRICE = btcm.getPrice({ tick: 'XRP', fetchPrice: coins.xrp });
	const GET_BINANCE_PRICES = binance.getMarkets({ fetchPrice: coins.ada });
	const GET_BITGRAIL_PRICES = bitgrail.getMarkets({ fetchPrice: coins.xrb });

	let BTC_AUD_PRICE, ETH_AUD_PRICE, XRP_AUD_PRICE, ADA_BTC_PRICE, ADA_ETH_PRICE, XRB_BTC_PRICE, XRB_ETH_PRICE;
	try {
		[ BTC_AUD_PRICE, ETH_AUD_PRICE, XRP_AUD_PRICE, { ADA_BTC_PRICE, ADA_ETH_PRICE }, { XRB_BTC_PRICE, XRB_ETH_PRICE } ] = await Promise.all([
			GET_BTC_AUD_PRICE,
			GET_ETH_AUD_PRICE,
			GET_XRP_AUD_PRICE,
			GET_BINANCE_PRICES,
			GET_BITGRAIL_PRICES,
			]);
	} catch (e) {
		return res.render('pages/error', { error: e.message });
	}

	const btc_value = BTC_AUD_PRICE * coins.btc;
	const eth_value = ETH_AUD_PRICE * coins.eth;
	const xrp_value = XRP_AUD_PRICE * coins.xrp;

	const xrb_value_via_btc = BTC_AUD_PRICE * XRB_BTC_PRICE * coins.xrb;
	const xrb_value_via_eth = ETH_AUD_PRICE * XRB_ETH_PRICE * coins.xrb;
	const max_xrb_value = Math.max(xrb_value_via_eth, xrb_value_via_btc);

	const ada_value_via_btc = BTC_AUD_PRICE * ADA_BTC_PRICE * coins.ada;
	const ada_value_via_eth = ETH_AUD_PRICE * ADA_ETH_PRICE * coins.ada;
	const max_ada_value = Math.max(ada_value_via_eth, ada_value_via_btc);

	const data = {	
		DATA_RETRIEVED: new Date(),
		TOTAL_PORTFOLIO_VALUE: {
			value_raw: btc_value + eth_value + xrp_value + max_ada_value + max_xrb_value,
			value: currencyFormatter.format(btc_value + eth_value + xrp_value + max_ada_value + max_xrb_value, { code: 'AUD' })
		},
		PORTFOLIO_DIFF: {
			value: (coins.aud ? (btc_value + eth_value + xrp_value + max_ada_value + max_xrb_value - coins.aud) / coins.aud : 0) * 100,
		},
		AUD: {
			value: currencyFormatter.format(coins.aud, { code: 'AUD', precision: 2 }),
		},
		BITCOIN: {
			total_coins_raw: coins.btc,
			total_coins: thousandSep(coins.btc),
			market_price_aud: currencyFormatter.format(BTC_AUD_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(btc_value, { code: 'AUD' }),
		},
		ETHEREUM: {
			total_coins_raw: coins.eth,
			total_coins: thousandSep(coins.eth),
			market_price_aud: currencyFormatter.format(ETH_AUD_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(eth_value, { code: 'AUD' }),
		},
		RIPPLE: {
			total_coins_raw: coins.xrp,
			total_coins: thousandSep(coins.xrp),
			market_price_aud: currencyFormatter.format(XRP_AUD_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(xrp_value, { code: 'AUD' }),
		},
		RAIBLOCK: {
			total_coins_raw: coins.xrb,
			total_coins: thousandSep(coins.xrb),
			market_price_aud_via_btc: currencyFormatter.format(BTC_AUD_PRICE * XRB_BTC_PRICE, { code: 'AUD', precision: 2 }),
			market_price_aud_via_eth: currencyFormatter.format(ETH_AUD_PRICE * XRB_ETH_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(max_xrb_value, { code: 'AUD' }),
			current_value_via: xrb_value_via_eth >= xrb_value_via_btc ? '(via ETH)' : '(via BTC)',
		},
		CARDANO: {
			total_coins_raw: coins.ada,
			total_coins: thousandSep(coins.ada),
			market_price_aud_via_btc: currencyFormatter.format(BTC_AUD_PRICE * ADA_BTC_PRICE, { code: 'AUD', precision: 2 }),
			market_price_aud_via_eth: currencyFormatter.format(ETH_AUD_PRICE * ADA_ETH_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(max_ada_value, { code: 'AUD' }),
			current_value_via: ada_value_via_eth >= ada_value_via_btc ? '(via ETH)' : '(via BTC)',
		},
	};

	// Overal Portfolio 
	data.PORTFOLIO_DIFF.class = data.PORTFOLIO_DIFF.value >= 0 ? 'positive' : 'negative';
	data.PORTFOLIO_DIFF.value = `${data.PORTFOLIO_DIFF.value >= 0 ? '+' : ''}${thousandSep(data.PORTFOLIO_DIFF.value.toFixed(2))}`;

	// Pie Chart Data
	data.PIE_CHART = {
		data: [],
		labels: [], 
		colors: [],
	};
	if (coins.btc) {
		data.PIE_CHART.data.push((btc_value / data.TOTAL_PORTFOLIO_VALUE.value_raw).toFixed(2));
		data.PIE_CHART.labels.push('BTC');
		data.PIE_CHART.colors.push('#f8a035');
	}
	if (coins.eth) {
		data.PIE_CHART.data.push((eth_value / data.TOTAL_PORTFOLIO_VALUE.value_raw).toFixed(2));
		data.PIE_CHART.labels.push('ETH');
		data.PIE_CHART.colors.push('#000000');
	}
	if (coins.xrp) {
		data.PIE_CHART.data.push((xrp_value / data.TOTAL_PORTFOLIO_VALUE.value_raw).toFixed(2));
		data.PIE_CHART.labels.push('XRP');
		data.PIE_CHART.colors.push('#049bd4');
	}
	if (coins.xrb) {
		data.PIE_CHART.data.push((max_xrb_value / data.TOTAL_PORTFOLIO_VALUE.value_raw).toFixed(2));
		data.PIE_CHART.labels.push('XRB');
		data.PIE_CHART.colors.push('#4ab74a');
	}
	if (coins.ada) {
		data.PIE_CHART.data.push((max_ada_value / data.TOTAL_PORTFOLIO_VALUE.value_raw).toFixed(2));
		data.PIE_CHART.labels.push('ADA');
		data.PIE_CHART.colors.push('#377fe3');
	}
	return res.render('pages/home', data);
});

app.listen(port, () => console.log('We are live on ' + port));