const SET_PIXEL = 'setPixel';
const NEXT_PIXEL = 'nextPixel';
const PREV_PIXEL = 'previousPixel';
const CHANGE_PIXEL_COLOR = 'changePixelColor';
const SET_PIXEL_COLOR = 'setPixelColor';
const SET_ALL_PIXEL_COLOR = 'setAllPixelColor';
const ADD_PIXEL = 'addPixel';
const REMOVE_PIXEL = 'removePixel';
const SET_PIXEL_TYPE = 'setPixelType';
const FORWARD_PIXEL = 'forwardPixel';
const BACK_PIXEL = 'backPixel';
const DOWNLOAD_PIXELS = 'downloadPixels';
const DOWNLOAD_CODE = 'downloadCode';
const NEXT_ROW = 'nextRow';
const KNIT_STITCHES = 'knitStitches';
const PURL_STITCHES = 'purlStitches';
const KNIT_UNTIL_END_OF_ROW = 'knitUntilEndOfRow'
const PURL_UNTIL_END_OF_ROW = 'purlUntilEndOfRow'
const CAST_ON_STITCHES = 'castOnStitches';
const CAST_OFF_STITCHES = 'castOffStitches';
const CHANGE_YARN_COLOR = 'changeColorTo';
const UNTIL_END_OF_ROW = 'untilEndOfRow';
const REMOVE_ROW = 'removeRow';
const HSB_COLOR = 'hsbColor';
const CLEAR_PIXELS = 'clearPixels';

const randomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
};

const randomColorInts = count => {
    const colors = [];
    const random = randomInt(100);
    for (let i=0; i<count; i++) {
        colors.push(random);
    }
    return colors;
};

const grayedSquares = count => {
    const colors = [];
    for (let i=0; i<count; i++) {
      colors.push('rgba(255,255,255,0)');
    }
    return colors;
}

const randomColorRGB = count => {
    const colors = [];

    // https://stackoverflow.com/questions/23095637/how-do-you-get-random-rgb-in-javascript
    const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);

    const rgb = `rgb(${r},${g},${b})`;
    for (let i=0; i<count; i++){
        colors.push(rgb);
    }

    return colors;
}

const initialState = {
    pixelType: 'knit',
    selectedPixel: 0,
    pixelCount: 25,
    rowCount: 12,
    pixelColors: grayedSquares(300),
    currentColor: "rgb(169,169,169)",
    knitDelay: 200,
    downloadingPixels: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch(action.type) {
    case SET_PIXEL:
        return Object.assign({}, state, {
            selectedPixel: action.selectedPixel
        });
    case NEXT_PIXEL: {
        let select = state.selectedPixel+1;
        if (select >= state.pixelCount*state.rowCount) select = 0;
        console.log("currently selected pixel is" + select);
        return Object.assign({}, state, {
            selectedPixel: select
        });
    }
    case PREV_PIXEL: {
        let select = state.selectedPixel-1;
        if (select < 0) select = (state.pixelCount*state.rowCount)-1;
        console.log("currently selected pixel is" + select);
        return Object.assign({}, state, {
            selectedPixel: select
        });
    }
    case CHANGE_PIXEL_COLOR: {
        const newColors = [...state.pixelColors];
        newColors[state.selectedPixel] += action.value;
        if (newColors[state.selectedPixel] >= 100) newColors[state.selectedPixel] %= 100;
        else if (newColors[state.selectedPixel] < 0) newColors[state.selectedPixel] += 100;
        return Object.assign({}, state, {
            pixelColors: newColors
        });
    }
    case SET_PIXEL_COLOR: {
        const newColors = [...state.pixelColors];
        newColors[state.selectedPixel] = action.value;
        return Object.assign({}, state, {
            pixelColors: newColors
        });
    }
    case SET_ALL_PIXEL_COLOR: {
        const newColors = [];
        const color = action.value % 100;
        for (let i=0; i<(state.pixelCount*state.rowCount); i++) {
            newColors.push(color);
        }
        return Object.assign({}, state, {
            pixelColors: newColors
        });
    }
    case ADD_PIXEL: {
        const newColors = [...state.pixelColors];
        for (let i=0; i<state.rowCount; i++){
            newColors.push('rgba(255,255,255,0)');
        }
        if (state.pixelCount < 25){
          console.log("adding column...");
          return Object.assign({}, state, {
              pixelCount: state.pixelCount+1,
              pixelColors: newColors
          });
        }
        else {
          console.log("max stitch width reached!");
          return state;
        }

    }
    case REMOVE_PIXEL: {
        if (state.pixelCount === 1) return;
        const newColors = [...state.pixelColors];
        newColors.pop();
        return Object.assign({}, state, {
            pixelCount: state.pixelCount-1,
            pixelColors: newColors
        });
    }
    case SET_PIXEL_TYPE: {
        return Object.assign({}, state, {
            pixelType: action.value
        });
    }
    case FORWARD_PIXEL: {
        let select = (state.selectedPixel + action.value) % (state.pixelCount*state.rowCount);
        console.log(select);
        return Object.assign({}, state, {
            selectedPixel: select
        });
    }
    case BACK_PIXEL: {
        let select = (state.selectedPixel - action.value) % (state.pixelCount*state.rowCount);
        if (select < 0) select = state.pixelCount + select;
        console.log(select);
        return Object.assign({}, state, {
            selectedPixel: select
        });
    }
    case DOWNLOAD_PIXELS: {
        console.log("logged download pixels!");

        // This might work, maybe probably?
        // https://stackoverflow.com/questions/8215021/create-svg-tag-with-javascript
        // https://dinbror.dk/blog/how-to-download-an-inline-svg-as-jpg-or-png/
        // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        // var path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        //
        // svg.setAttribute('width', state.pixelCount);
        // svg.setAttribute('height', state.rowCount);
        // svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")
        //
        // path1.setAttribute('d', 'M0 0h24v24H0z');
        // path1.setAttribute('fill', 'none');
        //
        // path2.setAttribute('d', 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z');
        // path2.setAttribute('fill', '#2962ff');
        //
        // svg.appendChild(path1);
        // svg.appendChild(path2);
        // document.body.appendChild(svg);
        // 
        // var canvas = document.createElement('canvas');
        // var ctx = canvas.getContext("2d");
        // var image = new Image();
        //
        // image.onload = function () {
        //   ctx.drawImage(image, 0, 0, state.pixelCount, state.rowCount);
        //
        //   canvas.toBlob(function (blob) {
        //     var newImg = document.createElement("img"),
        //     url = URL.createObjectURL(blob);
        //     newImg.onload = function() {
        //       URL.revokeObjectURL(url);
        //     };
        //     newImg.src = url;
        //   }, "image/jpeg", 0.8);
        //
        //   var event = new MouseEvent('click', {
        //     'view': window,
        //     'bubbles': true,
        //     'cancelable': true
        //   });
        //
        //   var a = document.createElement('a');
        //   var downloadAttrSupport = typeof a.download !== "undefined";
        //   a.setAttribute('download', 'image.jpg');
        //   a.setAttribute('href', url);
        //   a.setAttribute('target', '_blank');
        //   a.dispatchEvent(event);
        //
        //   var opened = window.open();
        //   if (opened) {
        //     opened.document.write(svg);
        //     opened.document.close();
        //     opened.focus();
        //   }
        // }
        // image.src = "data:image/svg+xml;base64," + window.btoa(svg);
        // image.onload();

        return state;
    }
    case DOWNLOAD_CODE: {
        console.log("logged download code!");
        return state;
    }
    case NEXT_ROW: {
        console.log("logged next row!");
        const newColors = [...state.pixelColors];
        for (let i=0; i<state.pixelCount; i++){
            newColors.push('rgba(255,255,255,0)');
        }
        if (state.rowCount < 12){
          console.log("adding row...");
          return Object.assign({}, state, {
              rowCount: state.rowCount+1,
              pixelColors: newColors
          });
        }
        else{
          console.log("max row limit reached!");
          return state;
        }

    }
    case KNIT_STITCHES: {
        console.log("logged knit stitches!");
        // let select = (state.selectedPixel) % (state.pixelCount*state.rowCount);
        let select = state.selectedPixel
        const newColors = [...state.pixelColors];

        // console.log("should be knitting " + action.value + " stitch(es)");

        for (let i=0; i<action.value; i++){
            newColors[select+i] = state.currentColor;
        }

        return Object.assign({}, state, {
            pixelColors: newColors,
            selectedPixel: select+action.value
        });
    }
    case PURL_STITCHES: {
        console.log("logged purl stitches!");
        const newColors = [...state.pixelColors];
        newColors[2] = randomColorRGB(1)[0];
        return Object.assign({}, state, {
            pixelColors: newColors
        });
    }
    case KNIT_UNTIL_END_OF_ROW: {
        console.log("logged knit until end of row");
        let select = state.selectedPixel;
        let nextRow = Math.floor(select/state.pixelCount)+1;
        const newColors = [...state.pixelColors];

        let toKnit = (state.pixelCount*nextRow)-select;
        // console.log("knit " + toKnit + " from " + select + " to " + state.pixelCount*nextRow);

        for (let i=0; i<toKnit; i++){
            newColors[select+i] = state.currentColor;
        }

        return Object.assign({}, state, {
            pixelColors: newColors,
            selectedPixel: select+toKnit
        });
    }
    case PURL_UNTIL_END_OF_ROW: {
        console.log("logged purl until end of row");
        return state;
    }
    case CAST_ON_STITCHES: {
        let select = state.selectedPixel;
        let nextRow = Math.floor(select/state.pixelCount)+1;
        const newColors = [...state.pixelColors];

        let toKnit = (state.pixelCount*nextRow*action.value)-select;

        for (let i=0; i<toKnit; i++){
          newColors[select+i] = state.currentColor;
        }

        if (nextRow === 1){
          console.log("casting on..." + toKnit + " stitches");
          return Object.assign({}, state, {
            pixelColors: newColors,
            selectedPixel: select+toKnit
          });
        }
        else{
          console.log("not the first row!");
          return state;
        }
    }
    case CAST_OFF_STITCHES: {
        let select = state.selectedPixel;
        let nextRow = Math.floor(select/state.pixelCount)+1;
        const newColors = [...state.pixelColors];

        let toKnit = (state.pixelCount*nextRow)-select;

        for (let i=0; i<toKnit; i++){
          newColors[select+i] = state.currentColor;
        }

        if (select+toKnit === state.pixelCount*state.rowCount){
          console.log("casting off..." + toKnit + " stitches");
          return Object.assign({}, state, {
            pixelColors: newColors,
            selectedPixel: select+toKnit
          });
        }
        else{
          console.log("can't cast off yet!");
          return state;
        }
    }
    case CHANGE_YARN_COLOR: {
        const newColor = "rgb(" + action.value[0] + "," + action.value[1] + "," + action.value[2] + ")";
        console.log("logged change color to " + newColor);
        return Object.assign({}, state, {
            currentColor: newColor
        });
    }
    case UNTIL_END_OF_ROW: {
        console.log("logged until end of row!");
        let select = state.selectedPixel;
        let nextRow = Math.floor(select/state.pixelCount)+1;
        // const newColors = [...state.pixelColors];
        let toKnit = (state.pixelCount*nextRow)-select;
        // for (let i=0; i<toKnit; i++){
        //     newColors[select+i] = state.currentColor;
        // }
        // console.log("knit " + toKnit + " from " + select + " to " + state.pixelCount*nextRow);
        // return Object.assign({}, state, {
        //     pixelColors: newColors,
        //     selectedPixel: state.pixelCount*nextRow
        // });

        // return Object.assign({}, action, {
        //     type: KNIT_STITCHES,
        //     value: toKnit
        // });

        return state;
    }
    case REMOVE_ROW: {
        console.log("logged remove row!");
        const newColors = [...state.pixelColors];
        for (let i=0; i<state.pixelCount; i++){
            newColors.pop();
        }
        return Object.assign({}, state, {
            rowCount: state.rowCount-1,
            pixelColors: newColors
        });
    }
    case HSB_COLOR: {
        console.log("logged hsb color!");
        return state;
    }
    case CLEAR_PIXELS: {
        console.log("logged clear pixels!");
        let newColors = grayedSquares(state.rowCount * state.pixelCount);
        return Object.assign({}, state, {
            pixelColors: newColors,
            selectedPixel: 0
        });
    }
    default:
        return state;
    }
};

const setSelectedPixel = function (pixel) {
    return {
        type: SET_PIXEL,
        selectedPixel: pixel
    };
};

const moveNextPixel = function () {
    return {
        type: NEXT_PIXEL
    };
};

const movePreviousPixel = function () {
    return {
        type: PREV_PIXEL
    };
};

const changePixelColor = function (value) {
    return {
        type: CHANGE_PIXEL_COLOR,
        value: value
    };
};

const setPixelColor = function (value) {
    return {
        type: SET_PIXEL_COLOR,
        value: value
    };
};

const setAllPixelColor = function (value) {
    return {
        type: SET_ALL_PIXEL_COLOR,
        value: value
    };
};

const addPixelNode = function () {
    return {
        type: ADD_PIXEL
    };
};

const removePixelNode = function () {
    return {
        type: REMOVE_PIXEL
    };
};

const setPixelType = function (type) {
    return {
        type: SET_PIXEL_TYPE,
        value: type
    };
};

const moveForwardPixels = function (value) {
    return {
        type: FORWARD_PIXEL,
        value: value
    };
};

const moveBackPixels = function (value) {
    return {
        type: BACK_PIXEL,
        value: value
    };
};

const downloadThePixels = function () {
    return {
        type: DOWNLOAD_PIXELS
    };
};

const downloadTheCode = function () {
    return {
        type: DOWNLOAD_CODE
    };
};

const goToNextRow = function () {
    return {
        type: NEXT_ROW
    };
}

const knitXStitches = function (value) {
    return {
        type: KNIT_STITCHES,
        value: value
    };
}

const purlXStitches = function (value) {
    return {
        type: PURL_STITCHES,
        value: value
    };
}

const knitUntilEndOfTheRow = function () {
    return {
        type: KNIT_UNTIL_END_OF_ROW
    }
}

const purlUntilEndOfTheRow = function () {
    return {
        type: PURL_UNTIL_END_OF_ROW
    };
}

const castOnXStitches = function (value) {
    return {
        type: CAST_ON_STITCHES,
        value: value
    };
}

const castOffXStitches = function () {
    return {
        type: CAST_OFF_STITCHES,
    };
}

const changeYarnColor = function (value) {
    return {
        type: CHANGE_YARN_COLOR,
        value: value
    };
}

const untilEndOfTheRow = function () {
    return {
        type: UNTIL_END_OF_ROW
    };
}

const removeLastRow = function () {
    return {
        type: REMOVE_ROW
    };
}

const hsbColorOut = function () {
    return {
        type: HSB_COLOR
    };
}

const clearThePixels = function () {
    return {
        type: CLEAR_PIXELS
    };
}

export {
    reducer as default,
    initialState as pixelInitialState,
    setSelectedPixel,
    moveNextPixel,
    movePreviousPixel,
    changePixelColor,
    setPixelColor,
    addPixelNode,
    removePixelNode,
    setPixelType,
    moveForwardPixels,
    moveBackPixels,
    setAllPixelColor,
    downloadThePixels,
    downloadTheCode,
    goToNextRow,
    knitXStitches,
    purlXStitches,
    knitUntilEndOfTheRow,
    purlUntilEndOfTheRow,
    castOnXStitches,
    castOffXStitches,
    changeYarnColor,
    untilEndOfTheRow,
    removeLastRow,
    hsbColorOut,
    clearThePixels
};
