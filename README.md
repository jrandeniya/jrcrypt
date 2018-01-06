# jrCrypt

Simple app to visualize your current crypto-AUD position.

The following APIs are used to retrieved current exchange rates for various coins:
* BTCMarkets (https://github.com/BTCMarkets/API).
* Binance (https://www.binance.com/restapipub.html).
* BitGrail (https://bitgrail.com/api-documentation)

## Demo
You need to construct the URL depending on your portfolio holdings. To add multiple coins, just separate the ticker with an ampersand (`&`). For example:

* If you have 0.5BTC and 2ETH: https://jrcrypt.herokuapp.com/?BTC=0.5&ETH=2
* If you have 0.3BTC, 5LTC and put in $1000: https://jrcrypt.herokuapp.com/?BTC=0.3&LTC=5&AUD=1000
* If you have 100ADA, 50XLM, 10XRB and put in $500: https://jrcrypt.herokuapp.com/?ADA=1000&XLM=50&XRM=10&AUD=500
* [Demo with all coins](https://jrcrypt.herokuapp.com/?BTC=0.1&ETH=1&XRP=100&BCH=0.5&LTC=2&XRB=25&REQ=1000&IOTA=250ADA=500&XLM=500&AUD=10000)

App currently supports: **BTC, ETH, XRP, BCH, LTC, XRB, REQ, IOTA, ADA** and **XLM**

## Development
* Rename `.env.sample` to `.env`
* Update `.env` with an available local PORT (eg: 8000).
* `npm install` 
* `npm run dev`
* Visit `http://localhost:8000/?BTC=0.1&ETH=1&XRP=100&BCH=0.5&LTC=2&XRB=25&REQ=1000&IOTA=250ADA=500&XLM=500&AUD=5000`

## ToDo
* Add NEM (XEM) support
* Convert app to client-side only (React?)
* Add custom Conversion Routing
* Add transaction fees into calculations
