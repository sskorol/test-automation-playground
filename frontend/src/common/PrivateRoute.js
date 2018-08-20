import React from 'react';
import pt from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { LOGIN_ROUTE } from '../constants';

const mapStore = stores => {
    return {
        isAuthorized: stores.sessionStore.isAuthorized,
        redirectTo: LOGIN_ROUTE
    };
};

const PrivateRoute = ({ component: Component, isAuthorized, redirectTo, ...privateProps }) => {
    return (
        <Route
            {...privateProps}
            render={routeProps =>
                isAuthorized ? (
                    <Component {...routeProps} />
                ) : (
                    <Redirect
                        to={{
                            pathname: redirectTo,
                            state: { from: routeProps.location }
                        }}
                    />
                )
            }
        />
    );
};

PrivateRoute.propTypes = {
    isAuthorized: pt.bool,
    redirectTo: pt.string,
    component: pt.func
};

export default inject(mapStore)(observer(PrivateRoute));
