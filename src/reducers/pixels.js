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
const NEXT_ROW = 'nextRow';
const KNIT_STITCHES = 'knitStitches';
const KNIT_UNTIL_END_OF_ROW = 'knitUntilEndOfRow'
const CAST_ON_STITCHES = 'castOnStitches';
const CAST_OFF_STITCHES = 'castOffStitches';
const CHANGE_YARN_COLOR = 'changeColorTo';
const UNTIL_END_OF_ROW = 'untilEndOfRow';
const REMOVE_ROW = 'removeRow';
const HSB_COLOR = 'hsbColor';
const DOWNLOAD_PIXELS = 'downloadPixels';
const DOWNLOAD_CODE = 'downloadCode';
const CLEAR_PIXELS = 'clearPixels';
const DOWNLOAD_STITCHES = 'downloadStitches';
const DOWNLOAD_STITCHES_NAME = 'downloadStitchesName';

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
    pixelCount: 50,
    rowCount: 35,
    pixelColors: grayedSquares(1750),
    currentColor: "rgb(169,169,169)",
    knitDelay: 200,
    downloadingPixels: false,
    downloadingStitches: false,
    downloadingStitchesName: ""
};
// note pixelCount is a legacy variable from pixelplay,
// it refers to the number of columns in the pattern as
// as set by the user.

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
//        console.log("currently selected pixel is" + select);
        return Object.assign({}, state, {
            selectedPixel: select
        });
    }
    case PREV_PIXEL: {
        let select = state.selectedPixel-1;
        if (select < 0) select = (state.pixelCount*state.rowCount)-1;
//        console.log("currently selected pixel is" + select);
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
        // if (state.pixelCount < 25){
          // console.log("adding column...");
          return Object.assign({}, state, {
              pixelCount: state.pixelCount+1,
              pixelColors: newColors
          });
        // }
        // else {
        //   console.log("max stitch width reached!");
        //   return state;
        // }
    }
    case REMOVE_PIXEL: {
        if (state.pixelCount === 1) return;
        const newColors = [...state.pixelColors];
        newColors.pop();

        if (state.pixelCount > 1){
          return Object.assign({}, state, {
              pixelCount: state.pixelCount-1,
              pixelColors: newColors

          });
        } else {
          console.log("min stitch width reached!");
          return state;
        }
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
    case NEXT_ROW: {
        // console.log("logged next row!");
        const newColors = [...state.pixelColors];
        for (let i=0; i<state.pixelCount; i++){
            newColors.push('rgba(255,255,255,0)');
        }
        // if (state.rowCount < 12){
          // console.log("adding row...");
          return Object.assign({}, state, {
              rowCount: state.rowCount+1,
              pixelColors: newColors
          });
        // }
        // else{
        //   console.log("max row limit reached!");
        //   return state;
        // }
    }
    case KNIT_STITCHES: {
        // console.log("logged knit stitches!");
        let select = state.selectedPixel
        const newColors = [...state.pixelColors];

        for (let i=0; i<action.value; i++){
            newColors[select+i] = state.currentColor;
        }

        let increase = action.value <= 0 ? 0 : action.value;

        return Object.assign({}, state, {
            pixelColors: newColors,
            selectedPixel: select+increase
        });
    }
    case KNIT_UNTIL_END_OF_ROW: {
        // console.log("logged knit until end of row");
        let select = state.selectedPixel;
        let nextRow = Math.floor(select/state.pixelCount)+1;
        const newColors = [...state.pixelColors];

        let toKnit = (state.pixelCount*nextRow)-select;

        for (let i=0; i<toKnit; i++){
            newColors[select+i] = state.currentColor;
        }

        return Object.assign({}, state, {
            pixelColors: newColors,
            selectedPixel: select+toKnit
        });
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
          // console.log("casting on..." + toKnit + " stitches");
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

        // uncomment if else if you want to limit the bind off functionality
        // to the last row of the canvasRef

        // if (select+toKnit === state.pixelCount*state.rowCount){
          // console.log("casting off..." + toKnit + " stitches");
          return Object.assign({}, state, {
            pixelColors: newColors,
            selectedPixel: select+toKnit
          });
        // }
        // else{
        //   console.log("can't cast off yet!");
        //   return state;
        // }
    }
    case CHANGE_YARN_COLOR: {
        const newColor = "rgb(" + action.value[0] + "," + action.value[1] + "," + action.value[2] + ")";
        // console.log("logged change color to " + newColor);
        return Object.assign({}, state, {
            currentColor: newColor
        });
    }
    case REMOVE_ROW: {
        // console.log("logged remove row!");
        const newColors = [...state.pixelColors];
        for (let i=0; i<state.pixelCount; i++){
            newColors.pop();
        }

        if (state.rowCount > 1) {
          return Object.assign({}, state, {
              rowCount: state.rowCount-1,
              pixelColors: newColors
          });
        } else {
          console.log("min row count reached!");
          return state;
        }
    }
    case CLEAR_PIXELS: {
        //console.log("logged clear pixels!");
        let newColors = grayedSquares(state.rowCount * state.pixelCount);
        return Object.assign({}, state, {
            pixelColors: newColors,
            selectedPixel: 0
        });
    }
    case DOWNLOAD_PIXELS: {
        console.log("logged download pixels!");

        return Object.assign({}, state, {
            downloadingPixels: action.value
        });
    }
    case DOWNLOAD_STITCHES: {
        console.log("logged download stitches!");

        return Object.assign({}, state, {
            downloadingStitches: action.value
        });
    }
    case DOWNLOAD_STITCHES_NAME: {
      console.log("changed name to: ", action.value);
      return Object.assign({}, state, {
        downloadingStitchesName: action.value
      }); 
    }
    case DOWNLOAD_CODE: {
        console.log("logged download code!");
        return state;
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

const knitUntilEndOfTheRow = function () {
    return {
        type: KNIT_UNTIL_END_OF_ROW
    }
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

const removeLastRow = function () {
    return {
        type: REMOVE_ROW
    };
}

const clearThePixels = function () {
    return {
        type: CLEAR_PIXELS
    };
}

const downloadThePixels = function (value) {
    return {
        type: DOWNLOAD_PIXELS,
        value: value
    };
};

const downloadTheStitches = function (value) {
    return {
        type: DOWNLOAD_STITCHES,
        value: value
    };
};

const changeDownloadName = function (value) {
  return {
    type: DOWNLOAD_STITCHES_NAME,
    value: value
  }
}

const downloadTheCode = function () {
    return {
        type: DOWNLOAD_CODE
    };
};

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
    goToNextRow,
    knitXStitches,
    knitUntilEndOfTheRow,
    castOnXStitches,
    castOffXStitches,
    changeYarnColor,
    removeLastRow,
    clearThePixels,
    downloadThePixels,
    downloadTheStitches,
    downloadTheCode,
    changeDownloadName
};
