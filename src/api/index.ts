import * as request from 'superagent';
import {paths} from './paths';

export const coinMarketCapApi = async(pair : string) => {
    try {
        const response = await request
            .get(`${paths.coinMarketCapQuotes}`)
            .query({'id': '1'})
            .set('X-CMC_PRO_API_KEY', process.env.COINMARKETAPI)
            .set('json', 'true')
            .set('gzip', 'true')
           
        return response.body
    } catch (e) {
        console.log(e.message)
    }
}

export const ratesApi = async(pair : string) => {
    try {
        const response = await request
            .get(`${paths.rates}`)
           
        return response.body
    } catch (e) {
        console.log(e.message)
    }
}

export const localBtcApi = async() => {
    try {
        const response = await request
            .get(`${paths.localBtc}`)
        
        return response.body
    } catch (e) {
        console.log(e.message)
    }
}

