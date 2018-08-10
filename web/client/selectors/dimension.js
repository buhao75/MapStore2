/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const { layersSelector } = require('./layers');
const { createSelector } = require('reselect');
const {get, find} = require('lodash');

const layerDimensionDataSelectorCreator = (layerId, dimension) => (state) => get(state, `dimension.data[${dimension}][${layerId}]`);

const getLayerStaticDimension = (layer = {}, dimension) => {
    return find(layer.dimensions || [], { name: dimension });
};
const layerDimensionSelectorCreator = (layer, dimension) => (state) => {
    return layerDimensionDataSelectorCreator(layer.id, dimension)(state) || getLayerStaticDimension(layer, dimension);

};
const timeDataSelector = state => layersSelector(state).reduce((timeDataMap, layer) => {
    const timeData = layerDimensionSelectorCreator(layer, "time")(state);
    if (timeData) {
        return {
            ...timeDataMap,
            [layer.id]: timeData
        };
    }
}, []);

/**
 * Returns a list of layers with time data
 * @param {object} state application state
 */
const layersWithTimeDataSelector = state => layersSelector(state).filter(l => getLayerStaticDimension(l, "time"));
const currentTimeSelector = state => get(state, 'dimension.currentTime');

// get times sorted by date
const timeSequenceSelector = createSelector(
    timeDataSelector,
    data => Object.keys(data)
        .reduce((acc, cur) =>
            [
                ...acc,
                ...data[cur] && data[cur].values || []
            ],
            [])
        .sort() || []);

module.exports = {
    layerDimensionDataSelectorCreator,
    timeSequenceSelector,
    currentTimeSelector,
    layersWithTimeDataSelector,
    timeDataSelector
};