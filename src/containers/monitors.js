import React from 'react';
import {connect} from 'react-redux';

import MonitorsComponent from '../components/monitors/monitors.js'

class Monitors extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            value: 0,
            time: 0
        };
        this.updateAnimationState = this.updateAnimationState.bind(this);
        this.startTime = new Date().getTime();
    }

    componentDidMount() {
        this.rAF = requestAnimationFrame(this.updateAnimationState);
        // this.rAF = setTimeout(this.updateAnimationState, 20);
    }

    updateAnimationState() {
        const timestamp = new Date().getTime() - this.startTime;
        const time = Math.round(timestamp % 10000 / 10);
        this.setState({
            value: this.props.sensorValue,
            time: time,
            triggers: this.props.blockTriggers
        });
        // console.log(this.state.value);
        this.rAF = requestAnimationFrame(this.updateAnimationState);
        // this.rAF = setTimeout(this.updateAnimationState, 20);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
        // clearTimeout(this.rAF);
    }

    render () {
        return (
            <MonitorsComponent
                value={this.state.value}
                time={this.state.time}
                triggers={this.state.triggers}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        sensorValue: state.sensor.sensorValue,
        blockTriggers: state.trigger.blockTrigger
    };
};

export default connect(
    mapStateToProps
)(Monitors);
