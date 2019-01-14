import React from 'react';
import Navigationitem from './Navigationitem/Navigationitem';
import classes from './Navigationitems.css';
const navigationitems = (props) =>(
    <ul className={classes.Navigationitems}>
      <Navigationitem link="/">BurgerBuilder</Navigationitem>
      <Navigationitem link="/orders">Orders</Navigationitem>
      
    </ul>
);

export default navigationitems;