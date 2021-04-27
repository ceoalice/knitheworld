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
      e.stopPropagation(); // prevent this.handleClick from firing
    }
    render () {
        // const iconMd5 = this.curIconMd5();
        const iconURL = this.props.iconRawURL;
        return (
            <ProjectItemComponent
                description={this.props.description}
                // disabled={this.props.disabled}
                hidden={this.props.hidden}
                iconURL={iconURL}
                icons={this.props.icons}
                id={this.props.id}
                insetIconURL={this.props.insetIconURL}
                name={this.props.name}
                onClick={this.handleClick}
                onClickClose={this.handleClickClose}
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
    iconRawURL: PropTypes.string,
    icons: PropTypes.arrayOf(
        PropTypes.shape({
            baseLayerMD5: PropTypes.string, // 2.0 library format, TODO GH-5084
            md5ext: PropTypes.string // 3.0 library format
        })
    ),
    id: PropTypes.number.isRequired,
    insetIconURL: PropTypes.string,
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    onDelete: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default ProjectItem
