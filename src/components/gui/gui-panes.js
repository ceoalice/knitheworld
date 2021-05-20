import React from 'react';
import styles from './gui.css';

import SplitPane from 'react-split-pane';


const GUIPanes = props => {
  const [windowWidth, setWindowWith] = React.useState(window.innerWidth);
  const [splitPos, setSplitPos] = React.useState(
    localStorage.getItem('splitPos') 
    ? Number(localStorage.getItem('splitPos'))
    : Math.round(window.innerWidth/2)
  );

  const LIMIT = 0.25; // min percent of screen width that splitpane can shrink to 

  const updateSplitPos = (size) => {
    // dispatches resize event so Blockly Window resizes 
    window.dispatchEvent(new Event('resize'));
    localStorage.setItem('splitPos', size);
    setSplitPos(size);
  }

  // https://www.pluralsight.com/guides/re-render-react-component-on-window-resize
  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth != windowWidth) {
        setWindowWith(window.innerWidth);
      }
    }

    window.addEventListener('resize', handleResize)

    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <React.Fragment>
      <SplitPane
        className={styles.flexbox}
        defaultSize={splitPos}
        minSize={Math.round(windowWidth*LIMIT)}
        maxSize={Math.round(windowWidth*(1-LIMIT))}
        split="vertical"
        onChange={updateSplitPos}
        onDragFinished={updateSplitPos}
      >
        { props.children }
      </SplitPane>
   </React.Fragment>
  )
}

export default GUIPanes;