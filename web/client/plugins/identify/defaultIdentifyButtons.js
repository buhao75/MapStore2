
/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = ({
    showHighlightFeatureButton,
    currentFeature,
    highlight,
    toggleHighlightFeature = () => {},
    zoomToFeature = () => {},
    ...props
}) => [
    {
        glyph: 'arrow-left',
        tooltipId: 'wizard.prev',
        visible: !props.viewerOptions.header && props.validResponses.length > 1 && props.index > 0,
        onClick: () => {
            props.onPrevious();
        }
    },
    {
        glyph: 'info-sign',
        tooltipId: 'identifyRevGeocodeSubmitText',
        visible: props.latlng && props.enableRevGeocode && props.lngCorrected,
        onClick: () => {
            props.showRevGeocode({lat: props.latlng.lat, lng: props.lngCorrected});
        }
    },
    {
        glyph: 'search-coords',
        tooltipId: props.showCoordinateEditor ? 'identifyHideCoordinateEditor' : 'identifyShowCoordinateEditor',
        visible: props.enabledCoordEditorButton,
        bsStyle: (props.showCoordinateEditor) ? "success" : "primary",
        onClick: () => {
            props.onToggleShowCoordinateEditor(props.showCoordinateEditor);
        }
    }, {
        glyph: 'map-filter',
        visible: showHighlightFeatureButton,
        tooltipId: highlight ? "identifyStopHighlightingFeatures" : "identifyHighlightFeatures",
        bsStyle: highlight ? "success" : "primary",
        onClick: () => toggleHighlightFeature(!highlight)
    }, {
        glyph: 'zoom-to',
        visible:
            highlight
            && !!currentFeature
            && currentFeature.length > 0
            // has at least 1 geometry
            && currentFeature.reduce((hasGeometries, { geometry } = {}) => hasGeometries || !!geometry, false),
        tooltipId: "identifyZoomToFeature",
        onClick: zoomToFeature
    }, {
        glyph: 'arrow-right',
        tooltipId: 'wizard.next',
        visible: !props.viewerOptions.header && props.validResponses.length > 1 && props.index < props.validResponses.length - 1,
        onClick: () => {
            props.onNext();
        }
    }
].filter(btn => btn && btn.visible);
