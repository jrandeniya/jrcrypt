# jrCrypt

Simple app to visualize your current crypto-AUD position.

The following APIs are used to retrieved current exchange rates for various coins:
* BTCMarkets (https://github.com/BTCMarkets/API).
* Binance (https://www.binance.com/restapipub.html).
* BitGrail (https://bitgrail.com/api-documentation)

## [Heroku Demo](https://jrcrypt.herokuapp.com/?BTC=0.2&ETH=2&XRP=500&BCH=1&LTC=5&XRB=50&ADA=1000&AUD=7000)

## URL Paramaters
* BTC (Float) - total Bitcoin coins
* ETH (Float) - total Ethereum coins
* XRP (Float) - total Ripple coins
* BCH (Float) - total Bitcoin Cash coins
* LTC (Float) - total Litecoin coins
* XRB (Float) - total RaiBlock coins
* ADA (Float) - total Cardano coins
* AUD (Float) - total AUD investment to gauge +/- %

## Development
* Rename `.env.sample` to `.env`
* Update `.env` with an available local PORT.
* `npm install` 
* `npm run dev`
* Visit `http://localhost:8000/?BTC=0.2&ETH=2&XRP=500&BCH=1&LTC=5&XRB=50&ADA=1000&AUD=7000`

## ToDo
* Convert app to client-side only (React?)
* Allow coin count / AUD total to be added / edited via UI
* Add custom Conversion Routing
* Add transaction fees into calculations
