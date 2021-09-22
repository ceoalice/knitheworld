import {bindAll} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import ProjectItemComponent from '../components/project-item/project-item.js';

import {ImageAPI} from "../lib/api"

class ProjectItem extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state = {
          imageURL : ""
        }
        bindAll(this, [
            'handleClick',
            'handleClickClose',
            // 'handleUpdate'
        ]);
    }

    componentDidMount() {      
      if (this.props.isExample) {
        this.setState({imageURL : ImageAPI.getSampleImage(this.props.project.id)});
      } else {
        ImageAPI.getProjectImageURL(this.props.userID, this.props.project.id)
          .then(res => {
            if (res.status == 200) {
              this.setState({imageURL : res.data});
            }
          });
      }
    }

    // async handleUpdate() {
    // }

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
                iconURL={this.state.imageURL}
                {...this.props}
            />
        );
    }
}
// PropTypes.oneOfType([
ProjectItem.propTypes = {

    project: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      xml: PropTypes.string.isRequired,
      size: PropTypes.number,
      timestamp: PropTypes.object
    }).isRequired,

    hidden: PropTypes.bool,
    isExample: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  pixelCount: state.pixels.pixelCount,
  pixelColors: state.pixels.pixelColors,
  rowCount: state.pixels.rowCount,
  userID : state.user.uid
});


export default connect(
  mapStateToProps
)(ProjectItem);
