import React, { Component } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import { Form, Input, Button, notification, InputNumber } from 'antd';
import { observer, inject } from 'mobx-react';
import { reaction } from 'mobx';
import {
    validateName,
    validateUsername,
    validateEmail,
    validatePassword,
    validateSalary, validateBirthDate
} from '../../../util/ValidationUtils';
import { checkUsernameAvailability, checkEmailAvailability } from '../../../util/APIUtils';
import { LOGIN_ROUTE, SALARY_MAX, SALARY_MIN, SALARY_PRECISION, SALARY_STEP } from '../../../constants';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import DatePicker from 'react-datepicker';

const FormItem = Form.Item;

@inject('routingStore', 'signupStore')
@observer
export default class Signup extends Component {

    handleInputChange = (event, validationFun) => {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        if (moment.isMoment(inputValue)) {
            // eslint-disable-next-line no-console
            console.log('Generated onChange event:', inputValue.format('YYYY-MM-DD'));
        }

        this.props.signupStore[inputName] = {
            value: inputValue,
            ...validationFun(inputValue)
        };
    };

    componentDidMount() {
        this.responseReaction = reaction(
            () => this.props.signupStore.response,
            response => this.handleResponse(response)
        );
    }

    componentWillUnmount() {
        if (this.responseReaction) {
            this.responseReaction();
        }
        this.props.signupStore.clearFieldsState();
    }

    handleResponse(response) {
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
                        <FormItem
                            label="Birth date"
                            validateStatus={signupStore.birthDate.validateStatus}
                            help={signupStore.birthDate.errorMsg}
                        >
                            <DatePicker
                                customInput={
                                    <Input size="large"/>
                                }
                                selected={signupStore.birthDate.value}
                                dateFormat="YYYY-MM-DD"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                onChange={date => this.handleInputChange({
                                    target: {
                                        name: 'birthDate',
                                        value: date
                                    }
                                }, validateBirthDate)}
                            />
                        </FormItem>
                        <FormItem
                            label="Salary"
                            validateStatus={signupStore.salary.validateStatus}
                            help={signupStore.salary.errorMsg}
                        >
                            <InputNumber
                                size="large"
                                min={SALARY_MIN}
                                max={SALARY_MAX}
                                step={SALARY_STEP}
                                precision={SALARY_PRECISION}
                                value={signupStore.salary.value}
                                name="salary"
                                autoComplete="off"
                                style={{ width: '100%' }}
                                onChange={value => this.handleInputChange({
                                    target: {
                                        name: 'salary',
                                        value: value
                                    }
                                }, validateSalary)}/>
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                className="signup-form-button"
                                disabled={!signupStore.isFormValid()}
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
