import React from 'react';

class err extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong while rendering the chart.</h2>;
        }
        return this.props.children;
    }
}

export default err;