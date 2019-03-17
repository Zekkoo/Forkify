import axios from 'axios';
import { API_KEY, API } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        let res;
        try {
            res = await axios.get(`${API}/api/get?key=${API_KEY}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            if(res.data.error === 'limit') {
                console.log(`In: getRecipe(); API has reached limit of daily calls... :(`);
            } else{
                console.log(`Something went wrong in getRecipe(): ${error}`);
            }
            
        }
    }

    calcTime() {
        // na każde 3 składniki 15 min
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const longUnit = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce', 'cups', 'pounds', 'grams', 'gram', 'kilograms', 'kilogram'];
        const shortUnit = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'pound', 'g', 'g','kg', 'kg'];

        const newIngredients = this.ingredients.map(el => {
            //1. Uniform units
            let ingredient = el.toLowerCase();

            longUnit.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, shortUnit[i]);
            })
             //2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            if(ingredient.match(/\d/)){
                ingredient = ingredient.replace(/^[^\d]*/,"");
            }
            //3. Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => shortUnit.includes(el2));

            let objIng;
            if(unitIndex > -1){
                //there is unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1) {
                    count = eval(arrCount[0]);
                } else {
                    count = eval(arrCount.join('+').replace('-', '+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            } else if(parseInt(arrIng[0], 10)) {
                //there is no unit but first el is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if(unitIndex === -1) {
                //there is no unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
           

            return objIng;
        })

        this.ingredients = newIngredients;
    }

}