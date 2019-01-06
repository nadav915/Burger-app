import React from 'react';
import classes from './Navigationitem.css';
const navigationitem = (props) =>(
    <li className={classes.Navigationitem}>
    <a className={props.active ? classes.active : null} href={props.link}>{props.children}</a>
    </li>
);

export default navigationitem;