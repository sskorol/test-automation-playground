import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GenericComponent from 'react-stockcharts/lib/GenericComponent';
import { sum } from 'd3-array';

import { first, last, isNotDefined, isDefined } from 'react-stockcharts/lib/utils';

class CustomHoverTooltip extends Component {
    constructor(props) {
        super(props);
        this.renderSVG = this.renderSVG.bind(this);
    }

    render() {
        return <GenericComponent svgDraw={this.renderSVG} drawOn={['mousemove', 'pan']}/>;
    }

    renderSVG(moreProps) {
        const pointer = helper(this.props, moreProps);

        if (isNotDefined(pointer)) return null;

        const { bgFill, bgOpacity, backgroundShapeSVG, tooltipSVG } = this.props;
        const { bgheight, bgwidth } = this.props;
        const { height } = moreProps;

        const { x, y, content, centerX, pointWidth, bgSize } = pointer;

        const bgShape = isDefined(bgwidth) && isDefined(bgheight) ? { width: bgwidth, height: bgheight } : bgSize;

        return (
            <g>
                <rect
                    x={centerX - pointWidth / 2}
                    y={0}
                    width={pointWidth}
                    height={height}
                    fill={bgFill}
                    opacity={bgOpacity}
                />
                <g className="react-stockcharts-tooltip-content" transform={`translate(${x}, ${y})`}>
                    {backgroundShapeSVG(this.props, bgShape)}
                    {tooltipSVG(this.props, content)}
                </g>
            </g>
        );
    }
}

CustomHoverTooltip.propTypes = {
    chartId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    yAccessor: PropTypes.func,
    tooltipSVG: PropTypes.func,
    backgroundShapeSVG: PropTypes.func,
    bgwidth: PropTypes.number,
    bgheight: PropTypes.number,
    bgFill: PropTypes.string.isRequired,
    bgOpacity: PropTypes.number.isRequired,
    tooltipContent: PropTypes.func.isRequired,
    origin: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.number
};

CustomHoverTooltip.contextTypes = {
    margin: PropTypes.object.isRequired,
    ratio: PropTypes.number.isRequired
};

CustomHoverTooltip.defaultProps = {
    tooltipSVG: tooltipSVG,
    origin: origin,
    fill: '#D4E2FD',
    bgFill: '#D4E2FD',
    bgOpacity: 0.5,
    stroke: '#9B9BFF',
    fontFill: '#000000',
    opacity: 0.8,
    backgroundShapeSVG: backgroundShapeSVG,
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: 12
};

const PADDING = 5;
const X = 10;
const Y = 10;

/* eslint-disable react/prop-types */
function backgroundShapeSVG({ fill, stroke, opacity }, { height, width }) {
    return <rect height={height} width={width} fill={fill} opacity={opacity} stroke={stroke}/>;
}

function tooltipSVG({ fontFamily, fontSize, fontFill }, content) {
    const tspans = [];
    const startY = Y + fontSize * 0.9;

    for (let i = 0; i < content.y.length; i++) {
        const y = content.y[i];
        const textY = startY + fontSize * (i + 1);

        tspans.push(
            <tspan key={`L-${i}`} x={X} y={textY} fill={y.stroke}>
                {y.label}
            </tspan>
        );
        tspans.push(<tspan key={i}>: </tspan>);
        tspans.push(
            <tspan data-qa={y.label} key={`V-${i}`}>
                {y.value}
            </tspan>
        );
    }
    return (
        <text data-qa="react-stockcharts-tooltip" fontFamily={fontFamily} fontSize={fontSize} fill={fontFill}>
            <tspan data-qa="time" x={X} y={startY}>
                {content.x}
            </tspan>
            {tspans}
        </text>
    );
}

/* eslint-enable react/prop-types */

function calculateTooltipSize({ fontFamily, fontSize, fontFill }, content, ctx) {
    if (isNotDefined(ctx)) {
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
    }

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = fontFill;
    ctx.textAlign = 'left';

    const measureText = str => ({
        width: ctx.measureText(str).width,
        height: fontSize
    });

    const { width, height } = content.y
        .map(({ label, value }) => measureText(`${label}: ${value}`))
        // Sum all y and x sizes (begin with x label size)
        .reduce((res, size) => sumSizes(res, size), measureText(String(content.x)));

    return {
        width: width + 2 * X,
        height: height + 2 * Y
    };
}

function sumSizes(...sizes) {
    return {
        width: Math.max(...sizes.map(size => size.width)),
        height: sum(sizes, d => d.height)
    };
}

function normalizeX(x, bgSize, pointWidth, width) {
    // return x - bgSize.width - pointWidth / 2 - PADDING * 2 < 0
    return x < width / 2 ? x + pointWidth / 2 + PADDING : x - bgSize.width - pointWidth / 2 - PADDING;
}

function normalizeY(y, bgSize) {
    return y - bgSize.height <= 0 ? y + PADDING : y - bgSize.height - PADDING;
}

function origin(props, moreProps, bgSize, pointWidth) {
    const { chartId, yAccessor } = props;
    const { mouseXY, xAccessor, currentItem, xScale, chartConfig, width } = moreProps;
    let y = last(mouseXY);

    const xValue = xAccessor(currentItem);
    let x = Math.round(xScale(xValue));

    if (isDefined(chartId) && isDefined(yAccessor) && isDefined(chartConfig) && isDefined(chartConfig.findIndex)) {
        const yValue = yAccessor(currentItem);
        const chartIndex = chartConfig.findIndex(x => x.id === chartId);

        y = Math.round(chartConfig[chartIndex].yScale(yValue));
    }

    x = normalizeX(x, bgSize, pointWidth, width);
    y = normalizeY(y, bgSize);

    return [x, y];
}

function helper(props, moreProps, ctx) {
    const { show, xScale, currentItem, plotData } = moreProps;
    const { origin, tooltipContent } = props;
    const { xAccessor, displayXAccessor } = moreProps;

    if (!show || isNotDefined(currentItem)) return;

    const xValue = xAccessor(currentItem);

    if (!show || isNotDefined(xValue)) return;

    const content = tooltipContent({ currentItem, xAccessor: displayXAccessor });
    const centerX = xScale(xValue);
    const pointWidth =
        Math.abs(xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData)))) / (plotData.length - 1);

    const bgSize = calculateTooltipSize(props, content, ctx);

    const [x, y] = origin(props, moreProps, bgSize, pointWidth);

    return { x, y, content, centerX, pointWidth, bgSize };
}

export default CustomHoverTooltip;
