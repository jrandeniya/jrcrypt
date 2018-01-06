# jrCrypt

Simple app to visualize your current crypto-AUD position.

The following APIs are used to retrieved current exchange rates for various coins:
* BTCMarkets (https://github.com/BTCMarkets/API).
* Binance (https://www.binance.com/restapipub.html).
* BitGrail (https://bitgrail.com/api-documentation)

## Supported Coins:
The following virtual currencies are currently supported: **BTC, ETH, XRP, BCH, LTC, XRB, REQ, IOTA, ADA and XLM**

The following fiat currencies are currently supported: **AUD**

### Demos
You can construct the URL depending on your profile. For example:
* If you have 1BTC, 10ETH: https://jrcrypt.herokuapp.com/?BTC=1&ETH=10
* If you have 1BTC, 300XRP and invested AUD $1000: https://jrcrypt.herokuapp.com/?BTC=1&XRP=300&AUD=1000
* View app with all supported coins: [DEMO](https://jrcrypt.herokuapp.com/?BTC=0.1&ETH=1&XRP=100&BCH=0.5&LTC=2&XRB=25&REQ=1000&IOTA=250ADA=500&XLM=500&AUD=10000)

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
