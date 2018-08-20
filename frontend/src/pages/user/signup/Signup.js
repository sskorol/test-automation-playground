import React, { Component } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import { Form, Input, Button, DatePicker, notification } from 'antd';
import { observer, inject } from 'mobx-react';
import { reaction } from 'mobx';
import { validateName, validateUsername, validateEmail, validatePassword } from '../../../util/ValidationUtils';
import { checkUsernameAvailability, checkEmailAvailability } from '../../../util/APIUtils';
import { LOGIN_ROUTE } from '../../../constants';

const FormItem = Form.Item;

@inject('routingStore', 'signupStore')
@observer
class Signup extends Component {
    onChange(date, dateString) {
        // eslint-disable-next-line no-console
        console.log(date, dateString);
    }

    handleInputChange = (event, validationFun) => {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.props.signupStore[inputName] = {
            value: inputValue,
            ...validationFun(inputValue)
        };
    };

    componentDidMount() {
        this.responseReaction = reaction(
            () => this.props.signupStore.response,
            response => this.handleReponse(response)
        );
    }

    componentWillUnmount() {
        if (this.responseReaction) {
            this.responseReaction();
        }
        this.props.signupStore.clearFieldsState();
    }

    handleReponse(response) {
        const statusDetails = {
            message: response.message,
            description: response.description
        };

        if (response.code === 200) {
            notification.success(statusDetails);
            this.props.routingStore.push(LOGIN_ROUTE);
        } else {
            notification.error(statusDetails);
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        this.props.signupStore.handleSubmit();
    };

    validateUsernameAvailability = () => {
        this.props.signupStore.validateAvailability('username', validateUsername, checkUsernameAvailability);
    };

    validateEmailAvailability = () => {
        this.props.signupStore.validateAvailability('email', validateEmail, checkEmailAvailability);
    };

    render() {
        const { signupStore } = this.props;
        return (
            <div className="signup-container">
                <h1 className="page-title">Sign Up</h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem
                            label="Full Name"
                            validateStatus={signupStore.name.validateStatus}
                            help={signupStore.name.errorMsg}
                        >
                            <Input
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder="Type full name"
                                value={signupStore.name.value}
                                onChange={event => this.handleInputChange(event, validateName)}
                            />
                        </FormItem>
                        <FormItem
                            label="Username"
                            hasFeedback
                            validateStatus={signupStore.username.validateStatus}
                            help={signupStore.username.errorMsg}
                        >
                            <Input
                                size="large"
                                name="username"
                                autoComplete="off"
                                placeholder="Type unique username"
                                value={signupStore.username.value}
                                onBlur={this.validateUsernameAvailability}
                                onChange={event => this.handleInputChange(event, validateUsername)}
                            />
                        </FormItem>
                        <FormItem
                            label="Email"
                            hasFeedback
                            validateStatus={signupStore.email.validateStatus}
                            help={signupStore.email.errorMsg}
                        >
                            <Input
                                size="large"
                                name="email"
                                type="email"
                                autoComplete="off"
                                placeholder="Type unique email"
                                value={signupStore.email.value}
                                onBlur={this.validateEmailAvailability}
                                onChange={event => this.handleInputChange(event, validateEmail)}
                            />
                        </FormItem>
                        <FormItem
                            label="Password"
                            validateStatus={signupStore.password.validateStatus}
                            help={signupStore.password.errorMsg}
                        >
                            <Input
                                size="large"
                                name="password"
                                type="password"
                                autoComplete="off"
                                placeholder="Type password"
                                value={signupStore.password.value}
                                onChange={event => this.handleInputChange(event, validatePassword)}
                            />
                        </FormItem>
                        <FormItem label="Birth date">
                            <DatePicker onChange={this.onChange()}/>
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                className="signup-form-button"
                                disabled={signupStore.isFormInvalid()}
                            >
                                Sign up
                            </Button>
                            Already registed?{' '}
                            <Link to={LOGIN_ROUTE}>
                                Login now!
                            </Link>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Signup;
