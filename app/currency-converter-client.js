#!/usr/bin/env node
const thrift = require('thrift');
const CurrencyConverter = require('../gen-nodejs/CurrencyConverter');

const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

const connection = thrift.createConnection('localhost', 9090, {
  transport,
  protocol,
});

const client = thrift.createClient(CurrencyConverter, connection);
const matchCurrenciesRegExp = /^([a-zA-Z]{3})\/([a-zA-Z]{3})$/i;

const [value, currencies] = process.argv.slice(2);
const parcedValue = parseFloat(value);

if (!value) {
  console.log('You should specify a value which you want to convert (example: ./currency-converter-client.js 10 rub/byn');
  process.exit();
}

if (!currencies) {
  console.log('You should specify converting currencies (example: ./currency-converter-client.js 10 rub/byn');
  process.exit();
}

let [, currencyFrom, currencyTo] = (currencies && currencies.match(matchCurrenciesRegExp)) || [];

if (!currencyFrom || !currencyTo) {
  console.log('Invalid currency format. Try something like: byn\/rub');
  process.exit();
}

currencyFrom = currencyFrom.toUpperCase();
currencyTo = currencyTo.toUpperCase();

client.convert(parcedValue, currencyFrom, currencyTo, (err, responseValue) => {
  console.log(`${parcedValue} ${currencyFrom} is ${responseValue} ${currencyTo}`);
  process.exit();
});
