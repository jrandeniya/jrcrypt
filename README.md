# jrCrypt

Simple service to return your current crypto-AUD position for Bitcoin (BTC) and Cardano (ADA).

The following APIs are used to retrieved current exchange rates for various coins:
* BTCMarkets (https://github.com/BTCMarkets/API).
* Binance (https://www.binance.com/restapipub.html).
* BitGrail (https://bitgrail.com/api-documentation)

[Heroku Demo](https://jrcrypt.herokuapp.com/?BTC=0.1&ETH=10&XRP=500&XRB=100&ADA=1000&AUD=10000)

## URL Paramaters (?BTC=0.1&ETH=10&XRP=500&XRB=100&ADA=1000&AUD=10000)
* BTC (Float) - total Bitcoin coins
* ETH (Float) - total Ethereum coins
* ADA (Float) - total Cardano coins
* XRB (Float) - total RaiBlock coins
* AUD (Float) - total AUD investment to gauge +/- %

## Development
* Rename `.env.sample` to `.env`
* Update `.env` with an available local PORT.
* `npm install` 
* `npm run dev`
* Visit `http://localhost:8000/?BTC=0.1&ETH=10&XRP=500&XRB=100&ADA=1000&AUD=10000`

## ToDo
* Add a graph to show total holdings as a piechart
* Refactor BTCM/Binance calls into service files
* Convert API call to stream for prices.
* Add polling to get prices every 5 seconds for non-streamable API
* Slack/Chrome notification for price swings?
* Add transaction fees into calculations
