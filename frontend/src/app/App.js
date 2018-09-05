import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './App.css';
import { Route, withRouter, Switch } from 'react-router-dom';
import PrivateRoute from '../common/PrivateRoute';
import ChartComponent from '../pages/common/chart/CustomChart';
import GridComponent from '../pages/common/grid/CustomGrid';
import Login from '../pages/user/login/Login';
import Signup from '../pages/user/signup/Signup';
import Profile from '../pages/user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import { Layout, notification } from 'antd';
import { inject, observer } from 'mobx-react';
import { LOGIN_ROUTE, SIGNUP_ROUTE, GRID_ROUTE, CHART_ROUTE, ROOT_ROUTE } from '../constants';

const { Content } = Layout;

@inject('sessionStore', 'routingStore')
@observer
class App extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3
        });
    }

    handleLogout(
        redirectTo = ROOT_ROUTE,
        notificationType = 'success',
        description = "You're successfully logged out."
    ) {
        this.props.sessionStore.clearState();
        this.props.routingStore.push(redirectTo);

        notification[notificationType]({
            message: 'Test Automation Playground',
            description: description
        });
    }

    render() {
        return (
            <Layout className="app-container">
                <AppHeader onLogout={this.handleLogout} />
                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route exact path={ROOT_ROUTE}>
                                <Redirect to={GRID_ROUTE} />
                            </Route>
                            <Route path={LOGIN_ROUTE} component={Login} />
                            <Route path={SIGNUP_ROUTE} component={Signup} />
                            <PrivateRoute path="/users/:username" component={Profile} />
                            <PrivateRoute path={GRID_ROUTE} component={GridComponent} />
                            <PrivateRoute path={CHART_ROUTE} component={ChartComponent} />
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(App);
