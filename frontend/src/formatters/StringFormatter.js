import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import { isDouble } from '../util/Commons';

export default function StringFormatter(props) {
    const title = props.titlePrefix + props.value;
    const val = props.value;
    return (
        <span className={props['color']} data-qa={props['data-qa']} title={title}>
            {isDouble(val) ? numeral(val).format('0,0.00') : val}
        </span>
    );
}

StringFormatter.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    color: PropTypes.string,
    'data-qa': PropTypes.string,
    titlePrefix: PropTypes.string
};

export function extendedFormatter(FormatterComponent, props) {
    function formatter({ value, dependentValues, column }) {
        const titlePrefix = column && column.name ? `${column.name.toUpperCase()}: ` : '';
        return (
            <FormatterComponent dependentValues={dependentValues} value={value} titlePrefix={titlePrefix} {...props} />
        );
    }

    formatter.propTypes = {
        dependentValues: PropTypes.object,
        value: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
        column: PropTypes.object
    };

    return formatter;
}
