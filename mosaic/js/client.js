"use strict";
let imageWorker = new Worker('/js/image-worker.js');
let imageWorkerManager = createMessageManager(imageWorker);

let actions = [];

imageWorkerManager.on(MSG_TYPES.REQUEST_IMAGE_URL_SUCCESS, ({urls}) => {
    Promise.all(urls.map(getImage)).then(imgs => {
        actions.push(store => {
            const {tile: {matrix}} = store;
            matrix.push.apply(matrix, imgs);
            return store;
        });
    });
});

function update(canvas, ctx, store, actions, rAF = requestAnimationFrame) {
    if (actions.length) {
        while (actions.length) {
            store = actions.pop()(store);
        }
        /**
         * when have changes render
         */
        render(ctx, store);
    }
    rAF(() => update(canvas, ctx, store, actions, rAF));
}

/**
 * render
 * @param ctx
 * @param store
 */
function render(ctx, store) {
    const { width, tile: { width: tileWidth, height: tileHeight, matrix, startAt } } = store;
    const rowLen = getRowLength(width, tileWidth);
    let i = startAt;
    for (; i < matrix.length; i++ ) {
        const dx = (i % rowLen) * tileWidth;
        const dy = Math.floor(i / rowLen) * tileHeight;
        ctx.drawImage(matrix[i], dx, dy, tileWidth, tileHeight);
    }
    if (i !== startAt) {
        actions.push(store => {
            store.tile.startAt = i;
            return store;
        });
    }
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('main-canvas');
    const ctx = canvas.getContext('2d');
    const input = document.getElementById('uploader');
    input.addEventListener('change', e =>
        loadImageFile(e.target.files[0])
        .then(getImageData)
        .then(imageData => {
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            ctx.clearRect(0, 0, imageData.width, imageData.height);

            imageWorkerManager.post(
                MSG_TYPES.REQUEST_IMAGE_URL,
                {
                    imageData,
                    tile: {
                        width: TILE_WIDTH,
                        height: TILE_HEIGHT
                    }
                },
                [imageData.data.buffer]
            );
            actions.push(() => {
                return Object.assign(getInitStore(), {
                    width: imageData.width,
                    height: imageData.height
                });
            });
        }));
    update(canvas, ctx, getInitStore(), actions);
});


