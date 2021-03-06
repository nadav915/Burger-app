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
        error:false,
        user:{
            countryCode:'',
            currencies:{},
            exchangeRate:1

        }

    }

    componentDidMount(){
        axios.get('https://my-burger-ac371.firebaseio.com/ingredients.json')
        .then(response=>{
            this.setState({ingredients:response.data});
            console.log("%cYou Got Hacked!!!","color: blue; font-size:35px;  text-align: center;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;");
            console.log("%cSike!!!","font-size:30px; color:red;")
            console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here it is a scam and you will get Hacked","font-size:20px");
            this.updateCurrency();
        }).catch(error=>{
            this.setState({error:true});
        });

    }

    updateCurrency = ()=>{
        axios.get( 'http://ip-api.com/json/')
        .then(response=>{
            console.log(response.data.countryCode);
            const users = {countryCode:response.data.countryCode,currencies:{},exchangeRate:1};
            this.setState({user:users})
        }).then(()=>{
            axios.get('https://restcountries.eu/rest/v2/alpha/'+this.state.user.countryCode)
        .then(response=>{
        const user = {...this.state.user};
        console.log(response.data);
        user.currencies=response.data.currencies[0];
        this.setState({user:user});
        }).then(()=>{
            if(this.state.user.currencies.code!=='USD')
            {   
            axios.get('https://api.exchangeratesapi.io/latest?base=USD')
            .then(response=>{
            const user = {...this.state.user};
            if(response.data.rates[this.state.user.currencies.code]!==null)
            {
                user.exchangeRate=response.data.rates[this.state.user.currencies.code];
                this.setState({user:user});
            }
            else
            {
                const user = {...this.state.user};
                user.currencies.symbol="$";
                this.setState({user:user});
            }
        }).then(()=>{
            const price = this.state.totalPrice*this.state.user.exchangeRate;
            this.setState({totalPrice:price})
        })    
            }
        })
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
    const query = [];
        for(let i in this.state.ingredients)
        {
            query.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]))
        }
        query.push('price='+this.state.totalPrice);
        query.push('code='+this.state.user.currencies.code);
        const queryString = query.join('&');
        this.props.history.push({
            pathname:'/checkout',
            search: '?' + queryString

        });
    }
    //check if sum is not 0
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
            const updatePrice =this.state.totalPrice- (INGREDIENTS_PRICES[type]*this.state.user.exchangeRate);
            this.setState({ingredients:updateIngredients,totalPrice:updatePrice});
            this.updatePurchase(updateIngredients)
        }
        
    }

    moreHandler = (type) =>{
        const updateIngredients = {...this.state.ingredients};
        updateIngredients[type]=updateIngredients[type]+1;
        const updatePrice = INGREDIENTS_PRICES[type]*this.state.user.exchangeRate+this.state.totalPrice;
        this.setState({ingredients:updateIngredients,totalPrice:updatePrice});
        this.updatePurchase(updateIngredients)
    }

    kosherHandler = ()=>{
        const updateIngredients = {...this.state.ingredients};
        const baconUpdate = updateIngredients['bacon']*INGREDIENTS_PRICES['bacon']*this.state.user.exchangeRate;
        const cheeseUpdate = updateIngredients['cheese']*INGREDIENTS_PRICES['cheese']*this.state.user.exchangeRate;
        const updatePrice = this.state.totalPrice - cheeseUpdate -baconUpdate;
        updateIngredients['cheese']=0;
        updateIngredients['bacon']=0;

        this.setState({ingredients:updateIngredients,totalPrice:updatePrice,isKosher:!this.state.isKosher});
        this.updatePurchase(updateIngredients)
    }

    render(){
        //disable "Less" button if there is no ingredient
        const disabledInfo = {...this.state.ingredients};
        for(let key in disabledInfo)
        {
            disabledInfo[key]  = disabledInfo[key] <=0;
        }
        let orderSummary =null;
        //show error if ingredient cant be loaded
        let burger =this.state.error ? <p>ingredients can't be loaded</p> : <Spinner />;
        if(this.state.ingredients){
            burger =  (
                <React.Fragment>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                price={this.state.totalPrice}
                symbol={this.state.user.currencies.symbol} 
                isKosher={this.state.isKosher} 
                kosher={this.kosherHandler} 
                more={this.moreHandler} 
                less={this.lessHandler} 
                disabled={disabledInfo}
                purchaseable={this.state.purchaseable}
                orderd={this.purchaseHandler}/>
                </React.Fragment>
          );
          orderSummary =  <OrderSummary symbol={this.state.user.currencies.symbol} price={this.state.totalPrice} cancel={this.purchaseCancelHandler} continue={this.purchaseContinueHandler}  ingredients={this.state.ingredients}/> ;
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