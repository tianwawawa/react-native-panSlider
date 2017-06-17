/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Text,
  View
} from 'react-native';
import Slider from './src/Slider'
const {width, height} = Dimensions.get('window')

export default class sliderFix extends Component {

    onGetCurTime() {
        return this.refs.sliderfix.getCurChoose();
    }

   render() {
    return (
      <View style={styles.container}>
       <Slider ref="sliderfix"
           indexText={['0.5', '1', '1.5', '2', '3', '4', '5', '6']}
               style={{width:width - 40, height:14}}
               thresholdDis={2.5}
               changeDot={()=>{console.log('渲染')}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('sliderFix', () => sliderFix);
