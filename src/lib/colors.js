const colorTable = [
  0xFF0000, 0xFF0D00, 0xFF1A00, 0xFF2600, 0xFF3300, 0xFF4000, 0xFF4D00, 0xFF5900, 0xFF6600, 0xFF7300,
  0xFF8000, 0xFF8C00, 0xFF9900, 0xFFA600, 0xFFB300, 0xFFBF00, 0xFFCC00, 0xFFD900, 0xFFE600, 0xFFF200,
  0xFFFF00, 0xE6FF00, 0xCCFF00, 0xB3FF00, 0x99FF00, 0x80FF00, 0x66FF00, 0x4DFF00, 0x33FF00, 0x1AFF00,
  0x00FF00, 0x00FF0D, 0x00FF1A, 0x00FF26, 0x00FF33, 0x00FF40, 0x00FF4D, 0x00FF59, 0x00FF66, 0x00FF73,
  0x00FF80, 0x00FF8C, 0x00FF99, 0x00FFA6, 0x00FFB3, 0x00FFBF, 0x00FFCC, 0x00FFD9, 0x00FFE6, 0x00FFF2,
  0x00FFFF, 0x00F2FF, 0x00E6FF, 0x00D9FF, 0x00CCFF, 0x00BFFF, 0x00B3FF, 0x00A6FF, 0x0099FF, 0x008CFF,
  0x0080FF, 0x0073FF, 0x0066FF, 0x0059FF, 0x004DFF, 0x0040FF, 0x0033FF, 0x0026FF, 0x001AFF, 0x000DFF,
  0x0000FF, 0x0D00FF, 0x1A00FF, 0x2600FF, 0x3300FF, 0x4000FF, 0x4D00FF, 0x5900FF, 0x6600FF, 0x7300FF,
  0x8000FF, 0x8C00FF, 0x9900FF, 0xA600FF, 0xB300FF, 0xBF00FF, 0xCC00FF, 0xD900FF, 0xE600FF, 0xF200FF,
  0xFF00FF, 0xFF00E6, 0xFF00CC, 0xFF00B3, 0xFF0099, 0xFF0080, 0xFF0066, 0xFF004D, 0xFF0033, 0xFF001A,
  0xFF0000
];

const randomColor = function() {
    const index = Math.floor(Math.random() * Math.floor(colorTable.length));
    return colorTable[index];
};

const getColor = index => colorTable[index];
const getColorHex = index => {
    let hex = colorTable[index].toString(16);
    while (hex.length < 6) hex = '0' + hex;
    return `#${hex}`
};

const getRGBfromHex = index => {
    let hex = index;
    let r = hex[0];
    let g = hex[1];
    let b = hex[2];
    return "rgb(" + r + "," + g + "," + b + ")";
};

export {
    randomColor,
    getColor,
    getColorHex,
    getRGBfromHex
};
