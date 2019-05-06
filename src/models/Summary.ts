import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface ISummaryModel extends mongoose.Document { 
    totalProfit: number
    btcQuantity: number
    timestamp: Date
  }
export const summarySchema = new Schema({
    totalProfit: {
        type: Number,
        required: true,
        default:0,
    },
    btcQuantity: {
        type: Number,
        required: true,
        default:0,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model<ISummaryModel>('summary', summarySchema)
