import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  recipeChange = new Subject<Recipe[]>();

  constructor() {}

  private recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl:
        'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2019/9/25/MW404_chicken-snitzel_s4x3.jpg.rend.hgtvcom.616.462.suffix/1569435370683.jpeg',
      ingredients: ['French Fries', 'Pork Meat', 'Salad'],
    },
    {
      id: 'r2',
      title: 'Schnitzel',
      imageUrl:
        'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2019/9/25/MW404_chicken-snitzel_s4x3.jpg.rend.hgtvcom.616.462.suffix/1569435370683.jpeg',
      ingredients: ['French Fries', 'Pork Meat', 'Salad'],
    },
    {
      id: 'r3',
      title: 'Schnitzel',
      imageUrl:
        'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2019/9/25/MW404_chicken-snitzel_s4x3.jpg.rend.hgtvcom.616.462.suffix/1569435370683.jpeg',
      ingredients: ['French Fries', 'Pork Meat', 'Salad'],
    },
  ];

  getAllRecipes() {
    return [...this.recipes];
  }

  getRecipe(recipeId: string) {
    return {
      ...this.recipes.find((recipe) => {
        return recipe.id === recipeId;
      }),
    };
  }

  deleteRecipe(recipeId: string) {
    this.recipes = this.recipes.filter((recipe) => {
      return recipe.id !== recipeId;
    });

    this.recipeChange.next(this.recipes);
  }
}
