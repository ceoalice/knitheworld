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
        colors.push('rgb(189, 195, 199)');
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
    pixelCount: 10,
    rowCount: 8,
    pixelColors: grayedSquares(80),
    currentColor: "rgb(169,169,169)",
    knitDelay: 200
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
            newColors.push('rgb(189, 195, 199)');
        }
        return Object.assign({}, state, {
            pixelCount: state.pixelCount+1,
            pixelColors: newColors
        });
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
        console.log("logged download!");
        return state;
    }
    case NEXT_ROW: {
        console.log("logged next row!");
        const newColors = [...state.pixelColors];
        for (let i=0; i<state.pixelCount; i++){
            newColors.push('rgb(189, 195, 199)');
        }
        return Object.assign({}, state, {
            rowCount: state.rowCount+1,
            pixelColors: newColors
        });
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
        console.log("logged cast on stitches!");
        return state;
    }
    case CAST_OFF_STITCHES: {
        console.log("logged cast off stitches!");
        return state;
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

const purlUntilEndOfTheRow = function () {{
    return {
        type: PURL_UNTIL_END_OF_ROW
    }
}}

const castOnXStitches = function (value) {
    return {
        type: CAST_ON_STITCHES,
        value: value
    };
}

const castOffXStitches = function (value) {
    return {
        type: CAST_OFF_STITCHES,
        value: value
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
