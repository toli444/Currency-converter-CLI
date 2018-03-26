import fetch from 'node-fetch';
import thrift from 'thrift';
import CurrencyConverter from '../gen-nodejs/CurrencyConverter';
import CurrencyConverterTypes from '../gen-nodejs/currency-converter_types';

const port = process.env.PORT || 9090;
const currencyUrl = 'https://openexchangerates.org/api/latest.json?app_id=6a63d97a8e1543669bca587c6adf876a';
const currencyUpdateInterval = 3600000;

let lastUpdateTime = new Date();
let latestCurrencies;

async function resetFetchCurrencyCooldown() {
  const response = await fetch(currencyUrl);
  latestCurrencies = response.json();
  lastUpdateTime = new Date();
}

function isCooldownOver() {
  const currentTime = new Date();
  const timeDiff = Math.abs(currentTime.getTime() - lastUpdateTime.getTime());
  const diffHours = Math.ceil(timeDiff / currencyUpdateInterval);

  return diffHours > 0;
}

async function getLatestCurrencies() {
  try {
    if (isCooldownOver()) {
      await resetFetchCurrencyCooldown();
    }

    return latestCurrencies;
  } catch (ex) {
    return null;
  }
}

const server = thrift.createServer(CurrencyConverter, {
  async convert(value, currencyFrom, currencyTo, result) {
    const currencies = await getLatestCurrencies();
    const availableCurrencies = Object.keys(currencies.rates) || [];

    if (!availableCurrencies.includes(currencyFrom)) {
      const ex = new CurrencyConverterTypes.InvalidCurrencyException();
      ex.message = `Invalid currency ${currencyFrom}`;
      result(ex);
      return;
    }

    if (!availableCurrencies.includes(currencyTo)) {
      const ex = new CurrencyConverterTypes.InvalidCurrencyException();
      ex.message = `Invalid currency ${currencyTo}`;
      result(ex);
      return;
    }

    const convertedCurrency = value / currencies.rates[currencyFrom] * currencies.rates[currencyTo];
    result(null, convertedCurrency);
  },
});

async function init() {
  await resetFetchCurrencyCooldown();
}

try {
  server.listen(port, async () => {
    await init();
    console.log(`Server running on port:${port}`);
  });
} catch (e) {
  console.error(e);
}
