const Cast = require('../util/cast');

class Scratch3MicroworldBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            looks_nextpixel: this.nextPixel,
            looks_previouspixel: this.previousPixel,
            looks_changecolor: this.changeColor,
            looks_setcolor: this.setColor,
            control_waitms: this.waitForMs,
            looks_forwardpixel: this.forwardPixels,
            looks_backpixel: this.backPixels,
            looks_setallcolors: this.setAllPixels,
            knit_nextrow: this.nextRow,
            knit_knitstitches: this.knitStitches,
            knit_knituntilendofrow: this.knitUntilEndOfRow,
            knit_castonstitches: this.castOnStitches,
            knit_castoffstitches: this.castOffStitches,
            knit_changecolorto: this.changeColorTo,
            knit_removerow: this.removeRow,
        };
    }

    getHats () {
        return {
            event_whenstarted: {
                restartExistingThreads: true
            }
        };
    }

    nextPixel () {
        this.runtime.emit('PIXEL_EVENT', {
            type: 'nextPixel'
        });
    }

    previousPixel () {
        this.runtime.emit('PIXEL_EVENT', {
            type: 'previousPixel'
        });
    }

    changeColor (args) {
        const value = Cast.toNumber(args.VALUE);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'changeColor',
            value: value
        });
    }

    setColor (args) {
        const value = Cast.toNumber(args.VALUE);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'setColor',
            value: value
        });
    }

    waitForMs (args) {
        const duration = Cast.toNumber(args.VALUE);
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    forwardPixels (args) {
        const value = Cast.toNumber(args.VALUE);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'forwardPixel',
            value: value
        });
    }

    backPixels (args) {
        const value = Cast.toNumber(args.VALUE);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'backPixel',
            value: value
        });
    }

    setAllPixels (args) {
        const value = Cast.toNumber(args.VALUE);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'setAllPixels',
            value: value
        });
    }

    nextRow () {
        this.runtime.emit('PIXEL_EVENT', {
            type: 'nextRow'
        });
//        console.log("test next row :)")
    }

    knitStitches (args) {
        const value = Cast.toNumber(args.VALUE);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'knitStitches',
            value: value
        });
//        console.log("test knit stitches")
    }

    knitUntilEndOfRow () {
        this.runtime.emit('PIXEL_EVENT', {
          type: 'knitUntilEndOfRow',
        });
//        console.log("test knit until end of row");
    }

    castOnStitches (args) {
        const value = Cast.toNumber(args.VALUE);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'castOnStitches',
            value: value
        });
//        console.log("test cast on stitches")
    }

    castOffStitches () {
        this.runtime.emit('PIXEL_EVENT', {
            type: 'castOffStitches'
        });
//        console.log("test cast off")
    }

    changeColorTo (args) {
        const color = Cast.toRgbColorList(args.COLOR);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'changeColorTo',
            value: color
        });
//        console.log("test change color to " + color)
    }

    removeRow (){
        this.runtime.emit('PIXEL_EVENT', {
            type: 'removeRow'
        });
//        console.log("test remove row")
    }
}

module.exports = Scratch3MicroworldBlocks;
