export const getRootUrl = () => {
      return process.env.ROOT_URL || `http://localhost:3000`
}

export const coinMarketCapBaseUrl = () =>{
    return 'https://pro-api.coinmarketcap.com/v1/cryptocurrency';
}


export const paths = {
    coinMarketCapQuotes: `${coinMarketCapBaseUrl()}/quotes/latest`,
    rates:`http://www.apilayer.net/api/live?access_key=8b5c6e3a6fc4fd88cd7723150e33752c&format=1`,
    localBtc:`https://localbitcoins.com/sell-bitcoins-online/in/india/.json`
}
