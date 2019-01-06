import React,{Component} from 'react';
import Checkoutsummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

class Checkout extends Component
{
    state ={
        ingredients:{}
    }

    componentDidMount(){
        const query = new URLSearchParams(this.props.location.search);
        const ingredients ={};
        for (let param of query.entries())
        {
            ingredients[param[0]]=+param[1];
        }
        this.setState({ingredients:ingredients});
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
           </div>
           
       ) 
    }
}

export default Checkout;