# jrCrypt

Simple service to return your current crypto-AUD position for Bitcoin (BTC) and Cardano (ADA).

* The current BTC/AUD rate is retrieved from BTCMarkets (https://github.com/BTCMarkets/API).
* The current ADA/BTC rate is retrieved from Binance (https://www.binance.com/restapipub.html).

[Heroku Demo](https://jrcrypt.herokuapp.com/?BTC=0.1&ADA=1000&AUD=1000)

## URL Paramaters (?BTC=0.1&ADA=1000&AUD=1000)
* BTC (Float) - total BTC coints
* ADA (Float) - total ADA coins
* AUD (Float) - total AUD investment to gauge +/- %

## Development
* Rename `.env.sample` to `.env`
* Update `.env` with an available local PORT.
* `npm install` 
* `npm run dev`
* Visit `http://localhost:8000/?BTC=0.1&ADA=1000&AUD=1000`

## ToDo
* Add ETH, LTC, XRP
* Add error handlers / graceful fails for BTCMarkets / Binance API calls. 
* Add transaction fees into calculations
