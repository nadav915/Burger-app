import React from 'react';
import classes from './BuildControls.css'
import BuildControl from './BuildControl/BuildControl';
const controls=[
    {lable:'Salad',type:'salad'},
    {lable:'Bacon',type:'bacon'},
    {lable:'Cheese',type:'cheese'},
    {lable:'Meat',type:'meat'},
]


const buildControls = (props)=> (
    <div className={classes.BuildControls}>
        <p>The price is: {props.price.toFixed(2)}$</p> 
        {controls.map(control=>{
            if(props.isKosher&&(control.type==='bacon'||control.type==='cheese')){
                return;
            }
           return <BuildControl 
           more={()=>props.more(control.type)} 
           less={()=>props.less(control.type)} 
           key={control.lable} 
           lable={control.lable} 
           disabled={props.disabled[control.type]}  />
        })}
        <div className={classes.Buttons}>
        <button className={props.isKosher?classes.Button1:classes.Button} onClick={props.kosher}>Kosher</button>
        <button className={classes.OrderButton} disabled={!props.purchaseable} onClick={props.orderd}>Order now</button> 
        </div>
        
    </div>
)
  

export default buildControls;