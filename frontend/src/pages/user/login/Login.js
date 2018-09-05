import React, { Component } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Input, Button, Icon, notification } from 'antd';
import { GRID_ROUTE } from '../../../constants';

const FormItem = Form.Item;

class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm);
        return (
            <div className="login-container">
                <h1 className="page-title">Login</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.props.onLogin}/>
                </div>
            </div>
        );
    }
}

@inject('loginStore', 'routingStore')
@observer
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleResponse() {
        let status = this.props.loginStore.status;
        if (status.code === 200) {
            this.props.routingStore.push(GRID_ROUTE);
        } else {
            notification.error({
                message: status.message,
                description: status.description
            });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.loginStore.handleSubmit(values).then(() => this.handleResponse());
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('usernameOrEmail', {
                        rules: [{ required: true, message: 'Please type your username or email!' }]
                    })(
                        <Input
                            prefix={<Icon type="user"/>}
                            size="large"
                            name="usernameOrEmail"
                            placeholder="Username or Email"
                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please type your password!' }]
                    })(
                        <Input
                            prefix={<Icon type="lock"/>}
                            size="large"
                            name="password"
                            type="password"
                            placeholder="Password"
                        />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">
                        Login
                    </Button>
                    Or <Link to="/signup">register now!</Link>
                </FormItem>
            </Form>
        );
    }
}

export default Login;
