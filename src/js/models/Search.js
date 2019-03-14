import axios from "axios";

export default class Search {
    constructor(query) {
        this.query = query;
    }
    
    async getResults(){
        const API_KEY = '394e7cb4d3f66b21b66fc6a1c6ff3371';
        try{
            const response = await axios.get(`https://www.food2fork.com/api/search?key=${API_KEY}&q=${this.query}`);
            this.result = await response.data.recipes;
            //console.log(this.result);
        } catch (error) {
            alert(error);
        }   
        
    }
}





//Search.getResults('brownies');