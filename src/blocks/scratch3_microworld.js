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
            knit_purlstitches: this.purlStitches,
            knit_knituntilendofrow: this.knitUntilEndOfRow,
            knit_purluntilendofrow: this.purlUntilEndOfRow,
            knit_castonstitches: this.castOnStitches,
            knit_castoffstitches: this.castOffStitches,
            knit_changecolorto: this.changeColorTo,
            knit_untilendofrow: this.untilEndOfRow,
            knit_removerow: this.removeRow,
            knit_hsbcolor: this.hsbColor
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
        console.log("test next row :)")
    }

    knitStitches (args) {
        const value = Cast.toNumber(args.VALUE);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'knitStitches',
            value: value
        });
        console.log("test knit stitches")
    }

    purlStitches (args) {
        const value = Cast.toNumber(args.VALUE);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'purlStitches',
            value: value
        });
        console.log("test purl stitches")
    }

    knitUntilEndOfRow () {
        this.runtime.emit('PIXEL_EVENT', {
          type: 'knitUntilEndOfRow',
        });
        console.log("test knit until end of row");
    }

    purlUntilEndOfRow () {
        return new Promise (res => {
            this.runtime.emit('PIXEL_EVENT', {
                type: 'purlUntilEndOfRow',
            });
            setTimeout(res, 1000);
        });
        console.log("test purl until end of row");
    }

    castOnStitches (args) {
        const value = Cast.toNumber(args.VALUE);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'castOnStitches',
            value: value
        });
        console.log("test cast on stitches")
    }

    castOffStitches (args) {
        const value = Cast.toNumber(args.VALUE);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'castOffStitches',
            value: value
        });
        console.log("test cast off stitches")
    }

    changeColorTo (args) {
        const color = Cast.toRgbColorList(args.COLOR);
        this.runtime.emit('PIXEL_EVENT', {
            type: 'changeColorTo',
            value: color
        });
        console.log("test change color to " + color)
    }

    untilEndOfRow (){
        this.runtime.emit('PIXEL_EVENT', {
            type: 'untilEndOfRow'
        });
        console.log("test until end of row")
    }

    removeRow (){
        this.runtime.emit('PIXEL_EVENT', {
            type: 'removeRow'
        });
        console.log("test remove row")
    }

    hsbColor (args){
        const h = Cast.toNumber(args.HUE);
        const s = Cast.toNumber(args.SATURATION);
        const b = Cast.toNumber(args.BRIGHTNESS);

        const color = [h, s, b];

        this.runtime.emit('PIXEL_EVENT', {
            type: 'hsbColor',
            value: color
        });
        console.log("test hsb color " + color)
    }
}

module.exports = Scratch3MicroworldBlocks;
