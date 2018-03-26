#!/usr/bin/env node
const thrift = require('thrift');
const CurrencyConverter = require('../gen-nodejs/CurrencyConverter');
const CurrencyConverterTypes = require('../gen-nodejs/currency-converter_types');
const assert = require('assert');

const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

const connection = thrift.createConnection('localhost', 9090, {
  transport,
  protocol,
});

connection.on('error', (err) => {
  assert(false, err);
});

const client = thrift.createClient(CurrencyConverter, connection);
const matchCurrenciesRegExp = /^([a-zA-Z]{3})\/([a-zA-Z]{3})$/i;

const [value, currencies] = process.argv.slice(2);
const parcedValue = parseFloat(value);

let [, currencyFrom, currencyTo] = (currencies && currencies.match(matchCurrenciesRegExp)) || [];
currencyFrom = currencyFrom.toUpperCase();
currencyTo = currencyTo.toUpperCase();

client.convert(parcedValue, currencyFrom, currencyTo, (err, response) => {
  console.log(parcedValue);
  console.log(`result ${response}`);
  process.exit();
});
