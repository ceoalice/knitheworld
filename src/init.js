import {setAppElement} from "react-modal";
setAppElement(document.getElementById('root'));

/**
 * -----------------------------------------------------------------------------
 * Console warning
 * -----------------------------------------------------------------------------
 */
(() => {
    window.onload = function () {
        /* eslint-disable no-console */
        console.log('%cStop!', 'color: #F00; font-size: 35px; -webkit-text-stroke: 1px black; font-weight:bold');
        console.log(
            'This is part of your browser intended for developers. ' +
            'If someone told you to copy-and-paste something here, ' +
            'don\'t do it! It could allow them to take over your ' +
            'KnitheWorld account, delete all of your projects, or do many ' +
            'other harmful things. If you don\'t understand what exactly ' +
            'you are doing here, you should close this window without doing ' +
            'anything.'
        );
        /* eslint-enable no-console */
    };
})();