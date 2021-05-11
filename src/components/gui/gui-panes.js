import React from 'react';
import styles from './gui.css';

import SplitPane from 'react-split-pane';


const GUIPanes = props => {
  return (
    <React.Fragment>
      <SplitPane
        className={styles.flexbox}
        defaultSize={
          localStorage.getItem('splitPos') 
          ? parseInt(localStorage.getItem('splitPos'), 10)
          : "50%"
        }
        minSize={400}
        maxSize={window.innerWidth-400}
        split="vertical"
        onChange={(size) => {
          window.dispatchEvent(new Event('resize'));
          localStorage.setItem('splitPos', size)
        }}
        onDragFinished={(size) => {
          window.dispatchEvent(new Event('resize'));
          localStorage.setItem('splitPos', size)
        }}
      >
        { props.children }

      </SplitPane>
   </React.Fragment>
  )
}

export default GUIPanes;