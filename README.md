# jrCrypt

Simple service to return your current crypto-AUD position for Bitcoin (BTC) and Cardano (ADA).

* The current BTC/AUD rate is retrieved from BTCMarkets (https://github.com/BTCMarkets/API).
* The current ADA/BTC rate is retrieved from Binance (https://www.binance.com/restapipub.html).

[Heroku Demo](https://jrcrypt.herokuapp.com/?BTC=0.001&ADA=200)

## Development
* Rename `.env.sample` to `.env`
* Update `.env` with an available local PORT.
* `npm install` 
* `npm run dev`
* Visit `http://localhost:8000/?BTC=0.001&ADA=100`

## ToDo
* Add transaction fees into calculations
