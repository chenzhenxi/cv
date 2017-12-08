function getImageData(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function loadImageFile(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function(event){
            getImage(event.target.result).then(resolve, reject);
        };
        reader.readAsDataURL(file);
    });
}

function getRowLength(width, tileWidth){
    return Math.ceil(width / tileWidth);
}


/**
 * fetch image from sever by hex code, client
 */
const fetchImageBufferUrl = hex => {
    var svgTemplate = [
      `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="${TILE_WIDTH}" height="${TILE_HEIGHT}">`,
        `<ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="#${hex}"></ellipse>`,
      '</svg>'
    ].join('');
    return Promise.resolve(encodeOptimizedSVGDataUri(svgTemplate));
    
};

function encodeOptimizedSVGDataUri(svgString) {
  var uriPayload = encodeURIComponent(svgString) // encode URL-unsafe characters
    .replace(/%0A/g, '') // remove newlines
    .replace(/%20/g, ' ') // put spaces back in
    .replace(/%3D/g, '=') // ditto equals signs
    .replace(/%3A/g, ':') // ditto colons
    .replace(/%2F/g, '/') // ditto slashes
    .replace(/%22/g, "'"); // replace quotes with apostrophes (may break certain SVGs)
  return 'data:image/svg+xml,' + uriPayload;
}

/**
 * fetch image from sever by hex code, //server
 */
// const fetchImageBufferUrl = (() => {
//     const cache = new Map();
//     return hex => {
//         if (cache.has(hex)) {
//             return cache.get(hex);
//         }
//         const promise = fetch(`/color/${hex}`)
//             .then(res => res.blob())
//             .then(blob => URL.createObjectURL(blob));

//         cache.set(hex, promise);
//         return promise;
//     }
// })();

/**
 * get a image promise
 * @param src
 * @returns {Promise}
 */
function getImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = function() { reject.apply(this, arguments) };
    });
}

/**
 * helper for worker
 * @param worker
 * @returns {{post: (function(*, *, *=)), on: (function(*=, *=))}}
 */
function createMessageManager(worker) {
    let handlers = new Map();
    worker.addEventListener('message', function(e) {
        let data = e.data;
        handlers.get(data.type)(data.payload);
    }, false);

    return {
        /**
         * post message
         * @param type
         * @param payload
         * @param transferList
         */
        post: (type, payload, transferList = []) => {
            worker.postMessage({
                type, payload
            }, transferList);
        },
        /**
         * on message
         * @param type
         * @param handler
         */
        on: (type, handler) => {
            handlers.set(type, handler);
        }
    }
}