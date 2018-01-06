require('dotenv').config();

const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const moment = require('moment');
const currencyFormatter = require('currency-formatter');

const { thousandSep } = require('./helpers');
const btcm = require('./services/btcm');
const binance = require('./services/binance');
const bitgrail = require('./services/bitgrail');

const app = express();
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const port = process.env.PORT;

app.get('/', async (req, res) => {
	const coins = {
		btc: parseFloat(req.query.BTC) || 0,
		bch: parseFloat(req.query.BCH) || 0,
		ltc: parseFloat(req.query.LTC) || 0,
		eth: parseFloat(req.query.ETH) || 0,
		xrp: parseFloat(req.query.XRP) || 0,
		ada: parseFloat(req.query.ADA) || 0,
		xrb: parseFloat(req.query.XRB) || 0,
		req: parseFloat(req.query.REQ) || 0,
		iota: parseFloat(req.query.IOTA) || 0,
		xlm: parseFloat(req.query.XLM) || 0,
		xem: 0, // WIP
		aud: parseFloat(req.query.AUD) || 0,
	};
	const GET_BTC_AUD_PRICE = btcm.getPrice({ tick: 'BTC', fetchPrice: true });
	const GET_ETH_AUD_PRICE = btcm.getPrice({ tick: 'ETH', fetchPrice: true });
	const GET_XRP_AUD_PRICE = btcm.getPrice({ tick: 'XRP', fetchPrice: coins.xrp });
	const GET_BCH_AUD_PRICE = btcm.getPrice({ tick: 'BCH', fetchPrice: coins.bch });
	const GET_LTC_AUD_PRICE = btcm.getPrice({ tick: 'LTC', fetchPrice: coins.ltc });
	const GET_BINANCE_PRICES = binance.getMarkets({ fetchPrice: coins.ada + coins.req + coins.iota + coins.xlm });
	const GET_BITGRAIL_PRICES = bitgrail.getMarkets({ fetchPrice: coins.xrb });

	let BTC_AUD_PRICE,
	ETH_AUD_PRICE,
	BCH_AUD_PRICE,
	LTC_AUD_PRICE,
	XRP_AUD_PRICE,
	ADA_BTC_PRICE,
	ADA_ETH_PRICE,
	REQ_BTC_PRICE,
	REQ_ETH_PRICE,
	IOTA_BTC_PRICE,
	IOTA_ETH_PRICE,
	XLM_BTC_PRICE,
	XLM_ETH_PRICE,
	XEM_BTC_PRICE = 0,
	XEM_ETH_PRICE = 0,
	XRB_BTC_PRICE,
	XRB_ETH_PRICE;

	try {
		[ BTC_AUD_PRICE,
		ETH_AUD_PRICE,
		BCH_AUD_PRICE,
		LTC_AUD_PRICE,
		XRP_AUD_PRICE,
		{ ADA_BTC_PRICE, ADA_ETH_PRICE, REQ_BTC_PRICE, REQ_ETH_PRICE, IOTA_BTC_PRICE, IOTA_ETH_PRICE, XLM_BTC_PRICE, XLM_ETH_PRICE },
		{ XRB_BTC_PRICE, XRB_ETH_PRICE } ] = await Promise.all([
			GET_BTC_AUD_PRICE,
			GET_ETH_AUD_PRICE,
			GET_BCH_AUD_PRICE,
			GET_LTC_AUD_PRICE,
			GET_XRP_AUD_PRICE,
			GET_BINANCE_PRICES,
			GET_BITGRAIL_PRICES,
			]);
	} catch (e) {
		return res.render('pages/error', { error: e.message });
	}

	const btc_value = BTC_AUD_PRICE * coins.btc;
	const eth_value = ETH_AUD_PRICE * coins.eth;
	const bch_value = BCH_AUD_PRICE * coins.bch;
	const ltc_value = LTC_AUD_PRICE * coins.ltc;
	const xrp_value = XRP_AUD_PRICE * coins.xrp;

	const xrb_value_via_btc = BTC_AUD_PRICE * XRB_BTC_PRICE * coins.xrb;
	const xrb_value_via_eth = ETH_AUD_PRICE * XRB_ETH_PRICE * coins.xrb;
	const max_xrb_value = Math.max(xrb_value_via_eth, xrb_value_via_btc);

	const req_value_via_btc = BTC_AUD_PRICE * REQ_BTC_PRICE * coins.req;
	const req_value_via_eth = ETH_AUD_PRICE * REQ_ETH_PRICE * coins.req;
	const max_req_value = Math.max(req_value_via_eth, req_value_via_btc);

	const iota_value_via_btc = BTC_AUD_PRICE * IOTA_BTC_PRICE * coins.iota;
	const iota_value_via_eth = ETH_AUD_PRICE * IOTA_ETH_PRICE * coins.iota;
	const max_iota_value = Math.max(iota_value_via_eth, iota_value_via_btc);

	const xlm_value_via_btc = BTC_AUD_PRICE * XLM_BTC_PRICE * coins.xlm;
	const xlm_value_via_eth = ETH_AUD_PRICE * XLM_ETH_PRICE * coins.xlm;
	const max_xlm_value = Math.max(xlm_value_via_eth, xlm_value_via_btc);

	const xem_value_via_btc = BTC_AUD_PRICE * XEM_BTC_PRICE * coins.xem;
	const xem_value_via_eth = ETH_AUD_PRICE * XEM_ETH_PRICE * coins.xem;
	const max_xem_value = Math.max(xem_value_via_eth, xem_value_via_btc);

	const ada_value_via_btc = BTC_AUD_PRICE * ADA_BTC_PRICE * coins.ada;
	const ada_value_via_eth = ETH_AUD_PRICE * ADA_ETH_PRICE * coins.ada;
	const max_ada_value = Math.max(ada_value_via_eth, ada_value_via_btc);

	const total_value = btc_value + eth_value + bch_value + ltc_value + xrp_value + max_req_value + max_iota_value + max_ada_value + max_xrb_value + max_xlm_value + max_xem_value;
	const total_coins = coins.btc + coins.eth + coins.bch + coins.ltc + coins.xrp + coins.req + coins.iota + coins.xrb + coins.ada + coins.xlm + coins.xem;

	const data = {	
		GA: process.env.GA,
		DATA_RETRIEVED: moment.utc().format(),
		TOTAL_PORTFOLIO_VALUE: {
			coins: total_coins,
			value_raw: total_value,
			value: currencyFormatter.format(total_value, { code: 'AUD' })
		},
		PORTFOLIO_DIFF: {
			value: (coins.aud ? (total_value - coins.aud) / coins.aud : 0) * 100,
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
		BITCOIN_CASH: {
			total_coins_raw: coins.bch,
			total_coins: thousandSep(coins.bch),
			market_price_aud: currencyFormatter.format(BCH_AUD_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(bch_value, { code: 'AUD' }),
		},
		LITECOIN: {
			total_coins_raw: coins.ltc,
			total_coins: thousandSep(coins.ltc),
			market_price_aud: currencyFormatter.format(LTC_AUD_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(ltc_value, { code: 'AUD' }),
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
		REQUEST_NETWORK: {
			total_coins_raw: coins.req,
			total_coins: thousandSep(coins.req),
			market_price_aud_via_btc: currencyFormatter.format(BTC_AUD_PRICE * REQ_BTC_PRICE, { code: 'AUD', precision: 2 }),
			market_price_aud_via_eth: currencyFormatter.format(ETH_AUD_PRICE * REQ_ETH_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(max_req_value, { code: 'AUD' }),
			current_value_via: req_value_via_eth >= req_value_via_btc ? '(via ETH)' : '(via BTC)',
		},
		IOTA: {
			total_coins_raw: coins.iota,
			total_coins: thousandSep(coins.iota),
			market_price_aud_via_btc: currencyFormatter.format(BTC_AUD_PRICE * IOTA_BTC_PRICE, { code: 'AUD', precision: 2 }),
			market_price_aud_via_eth: currencyFormatter.format(ETH_AUD_PRICE * IOTA_ETH_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(max_iota_value, { code: 'AUD' }),
			current_value_via: iota_value_via_eth >= iota_value_via_btc ? '(via ETH)' : '(via BTC)',
		},
		CARDANO: {
			total_coins_raw: coins.ada,
			total_coins: thousandSep(coins.ada),
			market_price_aud_via_btc: currencyFormatter.format(BTC_AUD_PRICE * ADA_BTC_PRICE, { code: 'AUD', precision: 2 }),
			market_price_aud_via_eth: currencyFormatter.format(ETH_AUD_PRICE * ADA_ETH_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(max_ada_value, { code: 'AUD' }),
			current_value_via: ada_value_via_eth >= ada_value_via_btc ? '(via ETH)' : '(via BTC)',
		},
		STELLAR: {
			total_coins_raw: coins.xlm,
			total_coins: thousandSep(coins.xlm),
			market_price_aud_via_btc: currencyFormatter.format(BTC_AUD_PRICE * XLM_BTC_PRICE, { code: 'AUD', precision: 2 }),
			market_price_aud_via_eth: currencyFormatter.format(ETH_AUD_PRICE * XLM_ETH_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(max_xlm_value, { code: 'AUD' }),
			current_value_via: xlm_value_via_eth >= xlm_value_via_btc ? '(via ETH)' : '(via BTC)',
		},
		NEM: {
			total_coins_raw: coins.xem,
			total_coins: thousandSep(coins.xem),
			market_price_aud_via_btc: currencyFormatter.format(BTC_AUD_PRICE * XEM_BTC_PRICE, { code: 'AUD', precision: 2 }),
			market_price_aud_via_eth: currencyFormatter.format(ETH_AUD_PRICE * XEM_ETH_PRICE, { code: 'AUD', precision: 2 }),
			current_value: currencyFormatter.format(max_xem_value, { code: 'AUD' }),
			current_value_via: xem_value_via_eth >= xem_value_via_btc ? '(via ETH)' : '(via BTC)',
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
		data.PIE_CHART.data.push((btc_value / data.TOTAL_PORTFOLIO_VALUE.value_raw));
		data.PIE_CHART.labels.push('BTC');
		data.PIE_CHART.colors.push('#f8a035');
	}
	if (coins.eth) {
		data.PIE_CHART.data.push((eth_value / data.TOTAL_PORTFOLIO_VALUE.value_raw));
		data.PIE_CHART.labels.push('ETH');
		data.PIE_CHART.colors.push('#000000');
	}
	if (coins.bch) {
		data.PIE_CHART.data.push((bch_value / data.TOTAL_PORTFOLIO_VALUE.value_raw));
		data.PIE_CHART.labels.push('BCH');
		data.PIE_CHART.colors.push('#ca6e00');
	}
	if (coins.ltc) {
		data.PIE_CHART.data.push((ltc_value / data.TOTAL_PORTFOLIO_VALUE.value_raw));
		data.PIE_CHART.labels.push('LTC');
		data.PIE_CHART.colors.push('#b8b8b8');
	}
	if (coins.xrp) {
		data.PIE_CHART.data.push((xrp_value / data.TOTAL_PORTFOLIO_VALUE.value_raw));
		data.PIE_CHART.labels.push('XRP');
		data.PIE_CHART.colors.push('#049bd4');
	}
	if (coins.xrb) {
		data.PIE_CHART.data.push((max_xrb_value / data.TOTAL_PORTFOLIO_VALUE.value_raw));
		data.PIE_CHART.labels.push('XRB');
		data.PIE_CHART.colors.push('#4ab74a');
	}
	if (coins.req) {
		data.PIE_CHART.data.push((max_req_value / data.TOTAL_PORTFOLIO_VALUE.value_raw));
		data.PIE_CHART.labels.push('REQ');
		data.PIE_CHART.colors.push('#5dceae');
	}
	if (coins.iota) {
		data.PIE_CHART.data.push((max_iota_value / data.TOTAL_PORTFOLIO_VALUE.value_raw));
		data.PIE_CHART.labels.push('IOTA');
		data.PIE_CHART.colors.push('#04a997');
	}
	if (coins.ada) {
		data.PIE_CHART.data.push((max_ada_value / data.TOTAL_PORTFOLIO_VALUE.value_raw));
		data.PIE_CHART.labels.push('ADA');
		data.PIE_CHART.colors.push('#377fe3');
	}
	if (coins.xlm) {
		data.PIE_CHART.data.push((max_xlm_value / data.TOTAL_PORTFOLIO_VALUE.value_raw));
		data.PIE_CHART.labels.push('XLM');
		data.PIE_CHART.colors.push('#5f6f78');
	}
	if (coins.xem) {
		data.PIE_CHART.data.push((max_xem_value / data.TOTAL_PORTFOLIO_VALUE.value_raw));
		data.PIE_CHART.labels.push('XEM');
		data.PIE_CHART.colors.push('#2cbaad');
	}
	return res.render('pages/home', data);
});

app.listen(port, () => console.log('We are live on ' + port));