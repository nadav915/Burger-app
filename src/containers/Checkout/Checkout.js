import React,{Component} from 'react';
import Checkoutsummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route} from 'react-router-dom';
import ContactData from './ContactData/ContactData';
class Checkout extends Component
{
    state ={
        ingredients:{},
        price:0
    }

    componentDidMount(){
        const query = new URLSearchParams(this.props.location.search);
        const ingredients ={};
        let price;
        for (let param of query.entries())
        {
            if(param[0]==='price'){
                price= param[1]
            }
            else{
                ingredients[param[0]]=+param[1];
            }
            
        }
        this.setState({ingredients:ingredients,price:price});
    }

    checkoutCanceldHandler = ()=>{
        this.props.history.goBack();
    }

    checkoutContinuedHandler = ()=>{
        this.props.history.replace('/checkout/contact-data');
    }

    render(){
       return(
           <div>
               <Checkoutsummary ingredients={this.state.ingredients} checkoutCanceld={this.checkoutCanceldHandler} checkoutContinued={this.checkoutContinuedHandler} />
               <Route path={this.props.match.path+'/contact-data'} render={(props)=>(<ContactData ingredients={this.state.ingredients} price={this.state.price} {...props}/>)} />
           </div>
           
       ) 
    }
}

export default Checkout;