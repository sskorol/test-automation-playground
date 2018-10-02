import React from 'react';
import { Spin, Icon } from 'antd';

export default function LoadingIndicator(props) {
    const antIcon = <Icon type="github" style={{ fontSize: 50 }} spin/>;
    return (
        <Spin
            indicator={antIcon}
            size="large"
            style={{
                zIndex: 99,
                width: '100%',
                height: '100%',
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        />
    );
}
