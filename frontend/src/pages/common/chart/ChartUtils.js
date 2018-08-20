import { tsvParse } from 'd3-dsv';
import { timeParse, timeFormat } from 'd3-time-format';
import { format } from 'd3-format';

const parseDate = timeParse('%Y-%m-%d');
const dateFormat = timeFormat('%Y-%m-%d');
const numberFormat = format('.2f');

function parseData(parse) {
    return function(d) {
        d.date = parse(d.date);
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        d.volume = +d.volume;
        return d;
    };
}

export function getData() {
    return fetch('//rrag.github.io/react-stockcharts/data/MSFT.tsv')
        .then(response => response.text())
        .then(data => tsvParse(data, parseData(parseDate)));
}

export function tooltipContent(ys) {
    return ({ currentItem, xAccessor }) => {
        return {
            x: dateFormat(xAccessor(currentItem)),
            y: [
                {
                    label: 'open',
                    value: currentItem.open && numberFormat(currentItem.open)
                },
                {
                    label: 'high',
                    value: currentItem.high && numberFormat(currentItem.high)
                },
                {
                    label: 'low',
                    value: currentItem.low && numberFormat(currentItem.low)
                },
                {
                    label: 'close',
                    value: currentItem.close && numberFormat(currentItem.close)
                }
            ]
                .concat(
                    ys.map(each => ({
                        label: each.label,
                        value: each.value(currentItem),
                        stroke: each.stroke
                    }))
                )
                .filter(line => line.value)
        };
    };
}
