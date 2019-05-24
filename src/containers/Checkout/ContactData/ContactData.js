import React,{Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/input';
class ContactData extends Component {
    state ={
        orderForm:{
            name:{
                elementType:'input',
                elementConfig:{
                    type:'input',
                    placeholder:'Your Name'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            street:{
                elementType:'input',
                elementConfig:{
                    type:'input',
                    placeholder:'Your Street'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            email:{
                elementType:'input',
                elementConfig:{
                    type:'input',
                    placeholder:'Your Email'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            zipCode:{
                elementType:'input',
                elementConfig:{
                    type:'input',
                    placeholder:'Your Postal code'
                },
                value:'',
                validation:{
                    required:true,
                    minLength:5,
                    maxLength:7
                },
                valid:false,
                touched:false
            },
        },
        formIsValid:false,
        loading:false
    }

    checkValidity =(value,rules)=>{
            let isValid = true;
            if(rules.required)
            {
                isValid = value.trim() !== ''&&isValid;
            }
            if(rules.minLength)
            {
                isValid= value.length >= rules.minLength&&isValid;
            }
            if(rules.maxLength)
            {
                isValid= value.length <= rules.maxLength&&isValid;
            }
            return isValid;
    }

    orderHandler =()=>{
        this.setState({loading:true});
        const formData = {};
        for (let formIdentifier in this.state.orderForm)
        {
            formData[formIdentifier] = this.state.orderForm[formIdentifier].value;
        }
        const order = {
            ingredients:this.props.ingredients,
            price:this.props.price,
            code:this.props.code,
            orderData:formData
        }
        axios.post('/orders.json',order)
        .then(response=>{
            this.setState({loading:false});
            this.props.history.push('/');
        }).catch(error=>{
            this.setState({loading:false});
        });
    }

    inputChangedHandler = (event,inputIdentifier) =>{

        const updateForm = {...this.state.orderForm};
        const updateFormElement ={...updateForm[inputIdentifier]};
        updateFormElement.value = event.target.value;
        updateFormElement.valid = this.checkValidity(updateFormElement.value,updateFormElement.validation);
        updateFormElement.touched=true;
        updateForm[inputIdentifier]=updateFormElement;
        let formIsValid =true;
        for(let inputIdentifiers in updateForm)
        {
            formIsValid=updateForm[inputIdentifiers].valid&&formIsValid;
        }
        this.setState({orderForm:updateForm,formIsValid:formIsValid});
    }

    render(){
        const formElement = [];
        for(let key in this.state.orderForm)
        {
            formElement.push({
                id:key,
                config:this.state.orderForm[key]
            });
        }
        let form =( <form onSubmit={this.orderHandler}>
            {formElement.map(formElement=>(
                <Input
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched} 
                elementType={formElement.config.elementType} 
                elementConfig={formElement.config.elementConfig} 
                key={formElement.id}
                value={formElement.config.value}
                onChanged={(event)=>this.inputChangedHandler(event,formElement.id)}/>
            ))}
        </form>);
        if(this.state.loading)
        {
            form=<Spinner />
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contant Data:</h4>
                {form}
                <Button btnType="Success" disabled={!this.state.formIsValid} clicked={this.orderHandler}>Order</Button>
            </div>
        );
    }

}

export default ContactData;