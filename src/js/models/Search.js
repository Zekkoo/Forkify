import axios from "axios";
import {API_KEY, API} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    
    async getResults(){
        let response;
        try{
            response = await axios.get(`${API}/api/search?key=${API_KEY}&q=${this.query}`);
            this.result = await response.data.recipes;
            if(response.data.error === 'limit') {
                throw response;
            }
        } catch (error) {
            if(response.data.error === 'limit') {
                console.log('API has reached limit of daily calls... :(');
            } else{
                console.log(`Something went wrong in getResults(): ${error}`);
            }
        }   
        
    }
}





//Search.getResults('brownies');