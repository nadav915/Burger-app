import React from 'react';
import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import Navigationitems from '../Navigationitems/Navigationitems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
const toolbar = (props) =>(
    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.toggleClicked}/>
        <div className={classes.Logo}>
        <Logo />
        </div>
        
        <nav className={classes.DesktopOnly}>
            <Navigationitems />
        </nav>
    </header>
)

export default toolbar;