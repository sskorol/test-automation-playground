import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './AppHeader.css';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import { observer, inject } from 'mobx-react';
import LoadingIndicator from './LoadingIndicator';
import { LOGIN_ROUTE, SIGNUP_ROUTE, CHART_ROUTE, GRID_ROUTE, ROOT_ROUTE, USERS_ROUTE } from '../constants';

const Header = Layout.Header;

@inject('sessionStore')
@observer
class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick({ key }) {
        if (key === 'logout') {
            this.props.onLogout();
        }
    }

    render() {
        const { sessionStore } = this.props;
        let menuItems;

        if (sessionStore.isLoading) {
            return <LoadingIndicator />;
        }

        if (sessionStore.isAuthorized && sessionStore.userInfo) {
            menuItems = [
                <Menu.Item key="/">
                    <Link to={ROOT_ROUTE} data-qa="menu-home">
                        <Icon type="home" className="nav-icon" />
                    </Link>
                </Menu.Item>,
                <Menu.Item key="user" className="profile-menu">
                    <ProfileDropdownMenu onClick={this.handleMenuClick} userInfo={sessionStore.userInfo} />
                </Menu.Item>
            ];
        } else {
            menuItems = [
                <Menu.Item key="login">
                    <Link to={LOGIN_ROUTE} data-qa="menu-login">
                        Login
                    </Link>
                </Menu.Item>,
                <Menu.Item key="signup">
                    <Link to={SIGNUP_ROUTE} data-qa="menu-signup">
                        Signup
                    </Link>
                </Menu.Item>
            ];
        }

        return (
            <Header className="app-header">
                <div className="container">
                    <div className="app-title">
                        <Link to={ROOT_ROUTE} data-qa="home">
                            Test Automation Playground
                        </Link>
                    </div>
                    <Menu
                        className="app-menu"
                        mode="horizontal"
                        selectedKeys={[this.props.location.pathname]}
                        style={{ lineHeight: '64px' }}
                    >
                        {menuItems}
                    </Menu>
                </div>
            </Header>
        );
    }
}

function ProfileDropdownMenu(props) {
    const dropdownMenu = (
        <Menu onClick={props.onClick} className="profile-dropdown-menu">
            <Menu.Item key="user-info" className="dropdown-item" disabled>
                <div className="user-full-name-info" data-qa="full-name">
                    {props.userInfo.name}
                </div>
                <div className="username-info" data-qa="username">
                    @{props.userInfo.username}
                </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="profile" className="dropdown-item">
                <Link to={`${USERS_ROUTE}/${props.userInfo.username}`} data-qa="menu-profile">
                    Profile
                </Link>
            </Menu.Item>
            <Menu.Item key="chart" className="dropdown-item">
                <Link to={CHART_ROUTE} data-qa="menu-chart">
                    Chart
                </Link>
            </Menu.Item>
            <Menu.Item key="grid" className="dropdown-item">
                <Link to={GRID_ROUTE} data-qa="menu-grid">
                    Grid
                </Link>
            </Menu.Item>
            <Menu.Item key="logout" className="dropdown-item" data-qa="menu-logout">
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown
            overlay={dropdownMenu}
            trigger={['click']}
            getPopupContainer={() => document.getElementsByClassName('profile-menu')[0]}
        >
            <a className="ant-dropdown-link">
                <Icon type="user" className="nav-icon" style={{ marginRight: 0 }} data-qa="menu-user" />{' '}
                <Icon type="down" />
            </a>
        </Dropdown>
    );
}

export default withRouter(AppHeader);
