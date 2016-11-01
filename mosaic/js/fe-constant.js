const MSG_TYPES = {
    REQUEST_IMAGE_URL: 'REQUEST_IMAGE_URL',
    REQUEST_IMAGE_URL_SUCCESS: 'REQUEST_IMAGE_URL_SUCCESS'
};

/**
 * wrapper with function for prevent changes;
 * @returns {{width: number, height: number, tile: {width, height, matrix: Array, startAt: number}}}
 */
function getInitStore() {
    return {
        width: 0,
        height: 0,
        tile: {
            width: TILE_WIDTH,
            height: TILE_HEIGHT,
            matrix: [],
            startAt: 0,
        }
    };
}