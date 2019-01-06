import React,{Component} from 'react';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';
class Layout extends Component{
    state ={
        showSideDrawer:true
    }

    sideDrawerToggleHandler = () =>
    {
        this.setState((prevState)=>{
          return  {showSideDrawer:!prevState.showSideDrawer}
        });
    }

    sideDrawerCloseHandler = () =>
    {
        this.setState({showSideDrawer:false});
    }

    render(){
        return(
            <React.Fragment>
            <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerCloseHandler} />    
            <Toolbar toggleClicked={this.sideDrawerToggleHandler} />
            <main className={classes.Content}>
                {this.props.children}
            </main>
            </React.Fragment>
        );
    }

}


export default Layout;