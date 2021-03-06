import arrayClean from 'd2-utilizr/lib/arrayClean';
import objectClean from 'd2-utilizr/lib/objectClean';
import isNumeric from 'd2-utilizr/lib/isNumeric';
import isString from 'd2-utilizr/lib/isString';
import getAxisTitle from '../getAxisTitle';
import { CHART_TYPE_GAUGE } from '..';
import getGauge from './gauge';

const DEFAULT_MIN_VALUE = 0;

const DEFAULT_GRIDLINE_COLOR = '#E1E1E1';

const DEFAULT_PLOTLINE = {
    color: '#000',
    width: 2,
    zIndex: 4
};

const DEFAULT_PLOTLINE_LABEL = {
    y: -7,
    style: {
        fontSize: 13,
        textShadow: '0 0 6px #FFF'
    }
};

function getMinValue(layout) {
    return isNumeric(layout.rangeAxisMinValue) ? layout.rangeAxisMinValue : DEFAULT_MIN_VALUE;
}

function getMaxValue(layout) {
    return isNumeric(layout.rangeAxisMaxValue) ? layout.rangeAxisMaxValue : undefined;
}

function getSteps(layout) {
    return isNumeric(layout.rangeAxisSteps) ? layout.rangeAxisSteps : undefined;
}

function getTargetLine(layout) {
    return isNumeric(layout.targetLineValue) ? Object.assign({}, DEFAULT_PLOTLINE, objectClean({
        value: layout.targetLineValue,
        label: isString(layout.targetLineTitle) ? Object.assign({}, DEFAULT_PLOTLINE_LABEL, {
            text: layout.targetLineTitle
        }) : undefined
    })) : undefined;
}

function getBaseLine(layout) {
    return isNumeric(layout.baseLineValue) ? Object.assign({}, DEFAULT_PLOTLINE, objectClean({
        value: layout.baseLineValue,
        label: isString(layout.baseLineTitle) ? Object.assign({}, DEFAULT_PLOTLINE_LABEL, {
            text: layout.baseLineTitle,
        }) : undefined
    })) : undefined;
}

function getFormatter(layout) {
    return {
        formatter: function () {
            return this.value.toFixed(layout.rangeAxisDecimals);
        }
    };
}

function getLabels(layout) {
    return isNumeric(layout.rangeAxisDecimals) ? getFormatter(layout) : undefined;
}

function getDefault(layout) {
    return objectClean({
        min: getMinValue(layout),
        max: getMaxValue(layout),
        tickAmount: getSteps(layout),
        title: getAxisTitle(layout.rangeAxisTitle),
        plotLines: arrayClean([getTargetLine(layout), getBaseLine(layout)]),
        gridLineColor: DEFAULT_GRIDLINE_COLOR,
        labels: getLabels(layout)
    });
}

export default function (layout, extraOptions) {
    let series;

    switch(layout.type) {
        case CHART_TYPE_GAUGE:
            series = getGauge(layout, extraOptions.legendSet);
            break;
        default:
            series = getDefault(layout);
    }

    return series;
}
