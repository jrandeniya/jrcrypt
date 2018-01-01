# JRCrypt

Simple app to visualize your current crypto-AUD.

The following APIs are used to retrieved current exchange rates for various coins:
* BTCMarkets (https://github.com/BTCMarkets/API).
* Binance (https://www.binance.com/restapipub.html).
* BitGrail (https://bitgrail.com/api-documentation)

## [Heroku Demo](https://jrcrypt.herokuapp.com/?BTC=0.1&XRB=100&ADA=1000&XRP=500&ETH=1&AUD=1000	)

## URL Paramaters
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
* Visit `http://localhost:8000/?BTC=0.1&XRB=100&ADA=1000&XRP=500&ETH=1&AUD=1000	`

## ToDo
* Add Bitcoin Cash
* If API call errors, exclude from table and include warning message (instead of entire page erroring out)
* Add Google Analytics
* Convert app to client-side only (React?)
* Allow coin count / AUD total to be edited (update URL accordingly)
* Convert API call to stream for prices / add polling for non-streamable APIs
* Add transaction fees into calculations
