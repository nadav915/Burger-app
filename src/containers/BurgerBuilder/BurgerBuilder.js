import React, { Component } from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
const INGREDIENTS_PRICES = {
    salad:0.5,
    cheese:0.5,
    meat:1.5,
    bacon: 0.7
}

class BurgerBuilder extends Component{
    state ={
        ingredients: null,
        totalPrice: 4,
        isKosher:false,
        purchaseable:false,
        purchasing:false,
        loading:false,
        error:false
    }

    componentDidMount(){
        axios.get('https://my-burger-ac371.firebaseio.com/ingredients.json')
        .then(response=>{
            this.setState({ingredients:response.data});
            console.log("%cYou Got Hacked!!!","color: blue; font-size:35px;  text-align: center;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;");
            console.log("%cSike!!!","font-size:30px; color:red;")
            console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here it is a scam and you will get Hacked","font-size:20px");
        }).catch(error=>{
            this.setState({error:true});
        });
    }

    purchaseHandler = ()=>{
        this.setState({ purchasing:true});
    }
    
    purchaseCancelHandler = ()=>{
        this.setState({ purchasing:false});
    }

    purchaseContinueHandler = ()=>{
       this.setState({loading:true});
        const order = {
            ingredients:this.state.ingredients,
            price:this.state.totalPrice,
            customer:{
                name:'Nadav Feldbaum',
                address: {
                    street:'emek dotan holon',
                    zipCode:'123456'
                } 
            }
        }
        axios.post('/orders.json',order)
        .then(response=>{
            this.setState({loading:false,purchasing:false});
        }).catch(error=>{
            this.setState({loading:false,purchasing:false});
        });
    }

    updatePurchase = (ingredients) =>{
        const sum = Object.keys(ingredients).map(igKey=>{
            return ingredients[igKey];
        }).reduce((sum,el)=>{
            return sum+el;
        },0);
        this.setState({purchaseable:sum>0})
    }

    lessHandler = (type) =>{
        if(this.state.ingredients[type]>0)
        {
            const updateIngredients = {...this.state.ingredients};
            updateIngredients[type]=updateIngredients[type]-1;
            const updatePrice =this.state.totalPrice- INGREDIENTS_PRICES[type];
            this.setState({ingredients:updateIngredients,totalPrice:updatePrice});
            this.updatePurchase(updateIngredients)
        }
        
    }

    moreHandler = (type) =>{
        const updateIngredients = {...this.state.ingredients};
        updateIngredients[type]=updateIngredients[type]+1;
        const updatePrice = INGREDIENTS_PRICES[type]+this.state.totalPrice;
        this.setState({ingredients:updateIngredients,totalPrice:updatePrice});
        this.updatePurchase(updateIngredients)
    }

    kosherHandler = ()=>{
        const updateIngredients = {...this.state.ingredients};
        const baconUpdate = updateIngredients['bacon']*INGREDIENTS_PRICES['bacon'];
        const cheeseUpdate = updateIngredients['cheese']*INGREDIENTS_PRICES['cheese'];
        const updatePrice = this.state.totalPrice - cheeseUpdate -baconUpdate;
        updateIngredients['cheese']=0;
        updateIngredients['bacon']=0;

        this.setState({ingredients:updateIngredients,totalPrice:updatePrice,isKosher:!this.state.isKosher});
        this.updatePurchase(updateIngredients)
    }

    render(){
        const disabledInfo = {...this.state.ingredients};
        for(let key in disabledInfo)
        {
            disabledInfo[key]  = disabledInfo[key] <=0;
        }
        let orderSummary =null;
        let burger =this.state.error ? <p>ingredients can't be loaded</p> : <Spinner />;
        if(this.state.ingredients){
            burger =  (
                <React.Fragment>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                 price={this.state.totalPrice} 
                isKosher={this.state.isKosher} 
                kosher={this.kosherHandler} 
                more={this.moreHandler} 
                less={this.lessHandler} 
                 disabled={disabledInfo}
                purchaseable={this.state.purchaseable}
                orderd={this.purchaseHandler}/>
                </React.Fragment>
          );
          orderSummary =  <OrderSummary price={this.state.totalPrice} cancel={this.purchaseCancelHandler} continue={this.purchaseContinueHandler}  ingredients={this.state.ingredients}/> ;
        }
        if(this.state.loading){
            orderSummary = <Spinner />;
        }
       
           
        return(
            <React.Fragment>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                 {orderSummary}
                </Modal>
                {burger}
            </React.Fragment>
        );
    }
}

export default withErrorHandler(BurgerBuilder,axios);