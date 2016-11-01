importScripts('fe-constant.js');
importScripts('utils.js');
let workerManager = createMessageManager(self);

workerManager.on(MSG_TYPES.REQUEST_IMAGE_URL, requestImageUrlHandler);

function requestImageUrlHandler({ imageData: { data, width, height}, tile: { width: tileWidth, height: tileHeight } }) {
    const gen = getResult(data, width, height, tileWidth, tileHeight);
    fetchAllRow(gen);
}

function fetchAllRow(gen) {
    let next = gen.next();

    if (!next.value) {
        // stop when no value
        return;
    }

    let rgbList = next.value.data;
    let row = next.value.row;

    fetchRow(rgbList).then(urls => {
        workerManager.post(MSG_TYPES.REQUEST_IMAGE_URL_SUCCESS, {
            row, urls
        });
        if (!next.done) {
            fetchAllRow(gen);
        }
    });
}

/**
 * just fetch one row
 * @param rgbList
 * @returns {Promise.<*>}
 */
function fetchRow(rgbList) {
    let hexList = [];
    for (let i = 0; i < rgbList.length; i += 4) {
        hexList[Math.floor(i / 4)] = (rgbList[i] << 16) + (rgbList[i + 1] << 8) + rgbList[i + 2];
    }
    return Promise.all(hexList.map(hex => fetchImageBufferUrl(toHexColor(hex))));
}

function toHexColor(hex) {
    let str = hex.toString(16);
    if (str.length === 5) return '0' + str;
    if (str.length === 4) return '00' + str;
    if (str.length === 3) return '000' + str;
    if (str.length === 2) return '0000' + str;
    if (str.length === 1) return '00000' + str;
    return str;
}


function* getResult(data, width, height, tileWidth, tileHeight) {
    // how many pixel in this data
    const pixelCount = width * height;
    // how many pixel in one row of tiles
    const pixelCountForTileRow = width * tileHeight;
    // how many tiles in one row
    const rowLen = getRowLength(width, tileWidth);

    for (let i = 0; i < pixelCount;) {
        // set boundaries
        const max = Math.min(i + pixelCountForTileRow, pixelCount);
        // 3 digit as RGB, 1 digit as count, tile size must small then 625535
        const result = new Uint16Array(rowLen * 4);

        // sum
        for (;i < max; i++) {
            const rIndex = Math.floor(i % width / tileWidth) * 4;
            const dIndex = 4 * i;
            result[rIndex] += data[dIndex];
            result[rIndex + 1] += data[dIndex + 1];
            result[rIndex + 2] += data[dIndex + 2];
            result[rIndex + 3]++;
        }

        // avg
        for (let j = 0; j < result.length; j+= 4) {
            result[j] /= result[j + 3];
            result[j + 1] /= result[j + 3];
            result[j + 2] /= result[j + 3];
        }

        yield {
            row: Math.floor(i / pixelCountForTileRow),
            data: result,
        };
    }
}
