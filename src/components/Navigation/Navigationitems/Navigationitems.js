import React from 'react';
import Navigationitem from './Navigationitem/Navigationitem';
import classes from './Navigationitems.css';
const navigationitems = (props) =>(
    <ul className={classes.Navigationitems}>
      <Navigationitem link="/" active>BurgerBuilder</Navigationitem>
      <Navigationitem link="/">CheckOut</Navigationitem>
      
    </ul>
);

export default navigationitems;