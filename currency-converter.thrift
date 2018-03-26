exception InvalidCurrencyException {
    1: required string message
}

service CurrencyConverter {
    double convert(1:double value, 2:string currencyFrom, 3:string currencyTo) throws (1:InvalidCurrencyException ex)
}