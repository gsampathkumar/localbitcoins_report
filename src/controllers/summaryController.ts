import * as mongoose from 'mongoose';
import { summarySchema } from '../models/Summary';

const Summary = mongoose.model('Summary', summarySchema);

export class SummaryController{

    public async addNewSummary (data) {                
        let newSummary = new Summary(data);
    
        await newSummary.save((err, Summary) => {
            if(err){
                return(err);
            }    
            return(Summary);
        });
    }

    public getSummarys () {           
        Summary.find({}, (err, Summary) => {
            if(err){
                return(err);
            }
            return(Summary);
        });
    }

    public getSummaryWithID (data) {           
        Summary.findById(data._id, (err, Summary) => {
            if(err){
                return(err);
            }
            return(Summary);
        });
    }

    public updateSummary (data) {           
        Summary.findOneAndUpdate({ _id: data }, data, { new: true }, (err, Summary) => {
            if(err){
                return(err);
            }
            return(Summary);
        });
    }

    public deleteSummary (data) {           
        Summary.remove({ _id: data.id }, (err, Summary) => {
            if(err){
                return(err);
            }
            return({ message: 'Successfully deleted!'});
        });
    }
    
}