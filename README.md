# jrCrypt

Simple app to visualize your current crypto-AUD position.

The following APIs are used to retrieved current exchange rates for various coins:
* BTCMarkets (https://github.com/BTCMarkets/API).
* Binance (https://www.binance.com/restapipub.html).
* BitGrail (https://bitgrail.com/api-documentation)

## [Heroku Demo](https://jrcrypt.herokuapp.com/?BTC=0.1&ETH=1&XRP=100&BCH=0.5&LTC=2&XRB=25&REQ=1000&IOTA=250ADA=500&AUD=7000)

## URL Paramaters
* BTC (Float) - total Bitcoin coins
* ETH (Float) - total Ethereum coins
* XRP (Float) - total Ripple coins
* BCH (Float) - total Bitcoin Cash coins
* LTC (Float) - total Litecoin coins
* XRB (Float) - total RaiBlock coins
* REQ (Float) - total Request Network coins
* IOTA (Float) - total IOTA coins
* ADA (Float) - total Cardano coins
* AUD (Float) - total AUD investment to gauge +/- %

## Development
* Rename `.env.sample` to `.env`
* Update `.env` with an available local PORT (eg: 8000).
* `npm install` 
* `npm run dev`
* Visit `http://localhost:8000/?BTC=0.1&ETH=1&XRP=100&BCH=0.5&LTC=2&XRB=25&REQ=1000&IOTA=250ADA=500&AUD=5000`

## ToDo
* Convert app to client-side only (React?)
* Allow coin count / AUD total to be added / edited via UI
* Add custom Conversion Routing
* Add transaction fees into calculations
