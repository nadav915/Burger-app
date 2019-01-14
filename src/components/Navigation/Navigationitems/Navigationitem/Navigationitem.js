import React from 'react';
import classes from './Navigationitem.css';
import {NavLink} from 'react-router-dom';
const navigationitem = (props) =>(
    <li className={classes.Navigationitem}>
    <NavLink exact activeClassName={classes.active} to={props.link}>{props.children}</NavLink>
    </li>
);

export default navigationitem;