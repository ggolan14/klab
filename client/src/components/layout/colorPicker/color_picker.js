import React from "react";
import {SketchPicker} from "react-color";
import reactCSS from 'reactcss';

class ColorPicker extends React.Component {
    constructor(props){
        super(props);

        // this.setSetting = props.setSetting;

        this.state = {
            displayColorPicker: false,
            color: props.defaultValue || {
                r: 0,g:0,b:0,a:0.8
            }
        };
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.defaultValue !== prevProps.defaultValue) {
            this.setState({
                color: this.props.defaultValue
            });
        }
    }

    handleClick = () => {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.setState({ color: color.rgb });
        this.props.setSetting(color.rgb);
    };

    render() {

        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
                    border: '1px solid'
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '-50px',
                    right: '-30px',
                    bottom: '50px',
                    left: '30px',
                },
            },
        });

        return (
            <div>
                <div style={ styles.swatch } onClick={ this.handleClick }>
                    <div style={ styles.color } />
                </div>
                { this.state.displayColorPicker ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleClose }/>
                    <SketchPicker color={ {r:this.state.color.r, g:this.state.color.g, b:this.state.color.b, a: this.state.color.a} } onChange={ this.handleChange } />
                </div> : null }

            </div>
        )
    }
}

export default ColorPicker;
