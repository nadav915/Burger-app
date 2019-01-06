import React from 'react';
import classes from './Burger.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'
const Burger = (props) => {

    let ingredientsArr = Object.keys(props.ingredients).map(igkey =>{
        return [...Array(props.ingredients[igkey])].map((_,i)=>{
          return  <BurgerIngredient key={igkey + i} type={igkey}/>
        });
    }).reduce((arr,el)=>{
        return arr.concat(el)
    },[]);
    if(ingredientsArr.length===0){
        ingredientsArr=<p>Please add ingredients to your burger</p>
    }
    return(
        <div className={classes.Burger}>
        <BurgerIngredient type='bread-top'/>
        {ingredientsArr}
        <BurgerIngredient type='bread-bottom'/>
    </div>
    );
   
};

export default Burger;