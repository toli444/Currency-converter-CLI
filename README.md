# Currency converter

Fantastic command-line currency converter

## Overview

The project server is developed using thrift. Interface description can be found in currency-converter.thrift
To test it use client (which is located in app/thrift-currency-client.js)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine

### Installing

First step:

```
npm install
```

Then:
```
npm run start
```

Bingo! Your server is started

## Usage

Basic usage of the client:
```
./app/currency-converter-client.js 10 rub/byn
```
By default there is specified address of remote server where app is deployed. To test it locally just change it to localhost