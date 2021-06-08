import React from 'react';
import styles from "./project-name.css";
import classNames from 'classnames';
import {connect} from 'react-redux';

const ProjectName = props => {
  return (
    <div> 
    {props.projectSaved
      ? <div className={classNames(styles.projectName, styles.saved)}> {props.currentProjectName} </div>
      : <div className={classNames(styles.projectName, styles.unsaved)}> {props.currentProjectName} </div>
    }
    </div>
  );
} 

ProjectName.propTypes = {
 
};

ProjectName.defaultProps = {

};

const mapStateToProps = state => ({
  currentProjectName: state.projectState.currentProjectName,
  projectSaved : state.projectState.projectSaved
});

export default connect(
  mapStateToProps
)(ProjectName);
