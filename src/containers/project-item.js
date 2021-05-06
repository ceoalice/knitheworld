import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

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
                description={this.props.description}
                // disabled={this.props.disabled}
                // isExample={this.props.isExample}
                hidden={this.props.hidden}
                iconURL={this.props.iconURL}
                id={this.props.id}
                name={this.props.name}
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

export default ProjectItem
