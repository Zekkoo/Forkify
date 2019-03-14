// Global app controller
import axios from "axios";


const getResults = async query => {
    const API_KEY = '394e7cb4d3f66b21b66fc6a1c6ff3371';
    try{
        const response = await axios.get(`https://www.food2fork.com/api/search?key=${API_KEY}&q=${query}`);
        const data = await response.data;
        console.log(data.recipes);
    } catch (error) {
        alert(error);
    }
    
    
}

getResults('brownies');
