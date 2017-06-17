import React, { Component, PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    Platform,
    View,
    Dimensions,
    Animated,
    PanResponder,
    ART
} from 'react-native'

const DISTANCE_CHANGE_THRESHOLD = 2
const {width: width} = Dimensions.get('window')
class Slider extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            translateX: new Animated.Value(props.thresholdDis),
            curIndex:0
        }

        this.positionX = null
        this.maxLength = props.style && props.style.width? props.style.width:0
        this.subDistance = props.indexText.length>1? (this.maxLength - props.thresholdDis*2)/(props.indexText.length-1):0
        this.leftThreshold = (this.props.dragWidth - this.maxLength + 8)*0.5 //右边距

    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (e, gs) => this.handleOnStartShouldSetPanResponder(e, gs),
            onStartShouldSetPanResponderCapture: (e, gs) => true,

            onPanResponderGrant: (e, gs)=> this.handleOnResponderGrant(e, gs),
            // onMoveShouldSetPanResponder: (e, gs) => this.handleOnMoveShouldSetPanResponder(e, gs),
            // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderMove: (e, gs) => this.handlePanResponderMove(e, gs),
            // onPanResponderRelease: (e, gs) => this.handlePanResponderEnd(e, gs),

            // Another component has become the responder, so this gesture
            // should be cancelled
            onPanResponderTerminationRequest: (e, gs) => true,
            // onPanResponderTerminate: (e, gs) => this.handlePanResponderEnd(e, gs),

            // Returns whether this component should block native components from becoming the JS
            // responder. Returns true by default. Is currently only supported on android.
            onShouldBlockNativeResponder: _ => false,
        });
    }
    handleOnStartShouldSetPanResponder(e, gs) {
        const { nativeEvent } = e;
        this.positionX = nativeEvent.locationX
        this.setPosition(nativeEvent.locationX)
        return true
    }

    // The gesture has started. Show visual feedback so the user knows
    // what is happening!
    handleOnResponderGrant(e, gs) {
        const { nativeEvent } = e
        console.log('handleOnStartShouldSetPanResponder', nativeEvent.locationX)
        this.positionX = nativeEvent.locationX
        this.setPosition(nativeEvent.locationX)

    }

    handleOnMoveShouldSetPanResponder(e, gs) {
        // console.log('handleOnResponderGrant', e,gs)
        console.log(gs)
        const { dx } = gs
        return Math.abs(dx) > DISTANCE_CHANGE_THRESHOLD;
    }

    //dx - accumulated distance of the gesture since the touch started
    //dy - accumulated distance of the gesture since the touch started
    handlePanResponderMove(e, gs) {
        const { dx } = gs;
        if (this.positionX === null) {
            this.positionX = this.state.translateX._value
        }
        let newDX = this.positionX + dx
        this.setPosition(newDX)
    }

    // handlePanResponderEnd(e, gs) {
    //     const { dx } = gs;
    //     console.log('---end======', dx)
    // }

    setPosition(x) {
        let newIndex = Math.floor(x/this.subDistance)
        if (this.state.curIndex != newIndex) {
            this.props.changeDot && this.props.changeDot(this.props.indexText[newIndex])
            this.setState({
                translateX: new Animated.Value(newIndex*this.subDistance),
                curIndex:newIndex
            });
        }
    }

    render() {
        if (this.props.indexText.length == 0 && this.props.style) {
            return null;
        }
        let posX = this.maxLength;//this.state.translateX._value
        const path = new ART.Path()
            .moveTo(1,1)
            .lineTo(1, posX)
            .lineTo(posX, posX)
            .lineTo(posX,1)
            .close();

        /*  on android it doesn't work
         * <ART.Surface width={this.maxLength-2} height={this.props.style.height}>
         <ART.Shape d={path} stroke="#00000000" fill={new ART.LinearGradient({'0': 'rgba(56, 163, 246)','1': 'rgba(195, 229, 255)'},"300","0","0","0")} strokeWidth={1}/>
         </ART.Surface>
         * */
        return (
            <View {...this._panResponder.panHandlers}
                  style={[{width:this.props.dragWidth, height:this.props.dragHeight, justifyContent:'center', backgroundColor:'transparent', alignItems:'center'}, this.props.containerStyle]}
                  pointerEvents="box-only"
            >

                <View style={[{backgroundColor:'transparent'}, this.props.style, {height:this.props.dragHeight, alignItems:'center', justifyContent:'center'}]} >
                    <Image source={require('./Liner@2x.png')}  style={{width:this.maxLength - 10, height:5}}/>
                    <View style={[{position:'absolute', top:0, flexDirection:'row', backgroundColor:'transparent', justifyContent:'space-between',
                        alignItems:'center', width:this.maxLength, height:this.props.dragHeight},this.props.containerStyle]}>
                        {this.props.indexText.map((row,i)=>{return this.renderNodeDot(row, i)})}
                    </View>
                </View>

                <View style={[{position:'absolute', top:0, flexDirection:'row', backgroundColor:'transparent', alignItems:'center',marginLeft: (width - this.maxLength) / 2 - 15 + 4,
                    width:this.maxLength + 30, height:this.props.dragHeight},this.props.containerStyle]}>
                    {this.props.indexText.map((row,i)=>{return this.renderView(row, i)})}
                </View>

                <Animated.View
                    style={{
                        width:this.props.style.height,
                        height:this.props.dragHeight,
                        backgroundColor:'transparent',
                        justifyContent:'center',
                        alignItems:'center',
                        top:0,
                        position:'absolute',

                        marginLeft: (width - this.maxLength) / 2 - 4,
                        transform: [
                            {translateX: this.state.translateX} //平移
                        ]
                    }}
                >
                    <Image source={require('./shijian@2x.png')}  style={{width:14, height:14}}/>
                </Animated.View>


            </View>
        )
    }

    renderNodeDot(row, i) {
        if (this.props.renderNodeDot)
            return this.props.renderNodeDot()
        return (
            <View key={i}>
                <View style={{width: 8, height: 8, backgroundColor: 'rgba(124, 204, 251, 255)', borderRadius: 4}}>
                </View>
            </View>

        )
    }

    renderView (row, i) {
        if (this.props.renderView)
            return this.props.renderView()
        return (
            <View  key={i}>
                <View style={{
                    position: 'absolute',
                    borderRadius: 5,
                    bottom: 15,
                    height: 16,
                    backgroundColor: this.state.curIndex == i ? 'rgba(248, 84, 50, 255)' : 'transparent',
                    width: 30,
                    marginLeft: (this.maxLength - 7.5) / 7 * i,
                    justifyContent: 'center'
                }}>
                    <Text style={[{
                        textAlign: 'center',
                        fontSize: this.state.curIndex == i ? 14 : 12,
                        color: this.state.curIndex == i ? '#ffffff' : '#787878',
                        backgroundColor: 'transparent'
                    }]}>
                        {row}
                    </Text>
                </View>
            </View>

        )
    }

    //外部调用
    getCurChoose() {
        if (this.state.curIndex < this.props.indexText.length && this.state.curIndex>=0) {
            return this.props.indexText[this.state.curIndex]
        }
        return null
    }
}
Slider.propTypes = {
    maxValue: PropTypes.number,
    minValue: PropTypes.number,
    indexText: PropTypes.array,
    renderDot: PropTypes.func,
    renderNodeDot: PropTypes.func,
    containerStyle: PropTypes.object,
    thresholdDis:PropTypes.number,
    dragHeight:PropTypes.number,
    dragWidth:PropTypes.number,
    changeDot:PropTypes.func
}
Slider.defaultProps = {
    minValue:0,
    maxValue:0,
    indexText:[],
    thresholdDis:0,
    dragHeight:60,
    dragWidth:Dimensions.get('window').width,
}
module.exports = Slider
