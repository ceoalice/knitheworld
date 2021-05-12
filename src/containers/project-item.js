import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import ProjectItemComponent from '../components/project-item/project-item.js';


class ProjectItem extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'handleClickClose'
        ]);
    }
    handleClick (e) {
      if (!this.props.disabled) {
        this.props.onSelect(this.props.id);
      }
      e.preventDefault();
    }

    handleClickClose (e) {
      if (!this.props.disabled) {
        this.props.onDelete(this.props.id);
      }
      e.preventDefault();
      e.stopPropagation(); // prevent handleClick from firing
    }
    render () {
        return (
            <ProjectItemComponent
                onClick={this.handleClick}
                onClickClose={this.handleClickClose}
                {...this.props}
            />
        );
    }
}

ProjectItem.propTypes = {

    description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    size : PropTypes.number,
    hidden: PropTypes.bool,
    iconURL: PropTypes.string,
    id: PropTypes.number.isRequired,
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    isExample: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  pixelCount: state.pixels.pixelCount,
  pixelColors: state.pixels.pixelColors,
  rowCount: state.pixels.rowCount
});


export default connect(
  mapStateToProps
)(ProjectItem);
