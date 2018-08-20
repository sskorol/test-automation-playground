import React, { Component } from 'react';
import { Avatar } from 'antd';
import { getAvatarColor } from '../../../util/Colors';
import './Profile.css';
import { observer, inject } from 'mobx-react';

@inject('sessionStore')
@observer
class Profile extends Component {
    render() {
        const { sessionStore } = this.props;
        return (
            <div className="profile">
                {sessionStore.userInfo ? (
                    <div className="user-profile">
                        <div className="user-details">
                            <div className="user-avatar">
                                <Avatar
                                    className="user-avatar-circle"
                                    style={{ backgroundColor: getAvatarColor(sessionStore.userInfo.name) }}
                                >
                                    {sessionStore.userInfo.name[0].toUpperCase()}
                                </Avatar>
                            </div>
                            <div className="user-summary">
                                <div className="full-name">{sessionStore.userInfo.name}</div>
                                <div className="username">@{sessionStore.userInfo.username}</div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Profile;
