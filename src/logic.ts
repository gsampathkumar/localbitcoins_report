import {coinMarketCapApi, ratesApi, localBtcApi} from './api/index';
import {emailTemplate} from './template/emailTemplate';
import {sendMail} from './services/sendgrid';
import Summary from './models/Summary';

const getFXRate = async(pair : string) : Promise < number >=> {
    const {quotes} = await ratesApi("usdinr");
    return quotes[pair]
        ? quotes[pair]
        : 0;
}
const getBtcPriceFromMCapData = (obj) : number => {
    if (obj.data && obj.data["1"] && obj.data["1"]["quote"] && obj.data["1"]["quote"]["USD"] && obj.data["1"]["quote"]["USD"]["price"]) 
        return obj.data["1"]["quote"]["USD"]["price"];
    return 0;
}
const filterLocalBtcData = (obj, btcPrice, usdInrFXRate) : object => {
    if (!obj.data) 
        return []; // no data than return empty array
    
    let totalProfit : number = 0
    let btcQuantity : number = 0;

    // iterate and set seller list data
    const sellerDataArray = obj.data && obj.data.ad_list
        ? obj.data.ad_list
        : [];

    sellerDataArray.map(({data}) => {

        // btc amount in INR from localbitcoin
        const maxAmountAvailable : number = data.max_amount_available

        // atleast 1000 INR btc to be sell available , otherwise initiating txn is of no
        // use
        if (maxAmountAvailable > 1000) {

            const calcBtcRateUsd : number = (Number(data.temp_price) / usdInrFXRate);
            const btcQty : number = Number(data.max_amount_available) / (btcPrice * usdInrFXRate);
            const priceDiff : number = Math.abs(btcPrice - calcBtcRateUsd);
            const profitInr = btcQty * priceDiff * usdInrFXRate;

            if (btcPrice <= calcBtcRateUsd) { // our buying price is less than selling price
                // add totalProfit and btc quantity
                totalProfit = totalProfit + profitInr;
                btcQuantity = btcQuantity + btcQty;
                // return {     profit_inr: profitInr,     calc_btc_rate_usd: calcBtcRateUsd,
                // btc_qty: btcQty,     max_amount_available: maxAmountAvailable,
                // temp_price_usd: data.temp_price_usd,     temp_price: data.temp_price }
            }
        }
    })
    return {totalProfit, btcQuantity};
}

export const getaDataFromSources = async() : Promise < object > => {
    // fx rate from currency layer api
    const usdInrFXRate : number = await getFXRate("USDINR");

    // btc price from coin market cap
    const coinMCapData : any = await coinMarketCapApi("USDINR");
    const btcPrice : number = getBtcPriceFromMCapData(coinMCapData);

    // localbitcoin data
    const localBtcData : any = await localBtcApi();
    const {totalProfit, btcQuantity} : any = filterLocalBtcData(localBtcData, btcPrice, usdInrFXRate);

    // return totalProfit
    return {totalProfit, btcQuantity};
}

export const saveToDB = async(data) : Promise < object > => {

    let newSummary = new Summary(data);
    return await newSummary.save(data);

}
export const logic = async() : Promise < object > => {

    // fetch data from various sources
    const data = await getaDataFromSources();
    if (data) {
        // save to db
        const result = await saveToDB(data);
        return {msg: "saved to db", success: true};
    }
    return {msg: "failed", success: false};
}

export const sendSummary = async() : Promise < object > => {

    const subject = process.env.subject || 'Cyrpto daily summary';
    const email = process.env.email || 'gsampathkumar@gmail.com'; //gsampathkumar@gmail.com
    const bccemail = process.env.bccemail || 'yogeshwar@gmail.com';
    
    // const summary = new Summary();
    const dbData = await Summary.find({
        "timestamp": {
            $lt: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - 1))
        }
    });
    const template = emailTemplate(dbData);
    const result = await sendMail([email], subject, template, {
        contentType: 'text/html'
    }, bccemail);
    if(result.statusCode === 202){
        return {msg: "email sent", success: true};
    }
    return {msg: "email sent failed", success: false};
}