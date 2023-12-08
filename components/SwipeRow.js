import React, { PureComponent } from 'react';
import {
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';

export class SwipeRow extends PureComponent{

  constructor(props) {
    super(props);

    this.rightContentWidth = this.props.rightContentWidth || 0;
    this.lineHeigh = new Animated.Value(this.props.lineHeight);
    this.directionalDistanceChangeThreshold =
      this.props.directionalDistanceChangeThreshold || 2;
  }

  closeRow = () => {
    this._startAnimated(0);
  };

  deleteRow = (callbackFn) => {
    Animated.timing(this.lineHeigh, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start(callbackFn);
  };

  
  pan = new Animated.Value(0);

  rightContentWidth = 0;

  
  _onMoveShouldSet = (
    e,
    gestureState,
  ) => {
    const { dx } = gestureState;
    return Math.abs(dx) > this.directionalDistanceChangeThreshold;
  };

  
  _onPanResponderGrant = () => {
    this.props.onTouchStart && this.props.onTouchStart();
  };

  
  _onPanResponderMove = (
    e,
    gestureState
  ) => {
    const { dx, dy } = gestureState;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (
      absDx > this.directionalDistanceChangeThreshold ||
      absDy > this.directionalDistanceChangeThreshold
    ) {
      if (absDy > absDx) {
        return;
      } 

    
      if (dx > 0) {
        this._startAnimated(0);
      }
      
      else {
        if (dx < -this.rightContentWidth) {
          this._startAnimated(-this.rightContentWidth);
        } else {
          this._startAnimated(dx);
        }
      }
    }
  };

  
  _onPanResponderRelease = (e, gestureState) => {
    const { vx, dx } = gestureState;
    
    if (vx < 0.2 && dx < 0) {
      this._startAnimated(-this.rightContentWidth);
    } else {
      this._startAnimated(0);
    }
  };

 
  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: this._onMoveShouldSet,
    onPanResponderGrant: this._onPanResponderGrant,
    onPanResponderMove: this._onPanResponderMove,
    onPanResponderRelease: this._onPanResponderRelease,
  });

 
  _startAnimated = (num) => {
    Animated.spring(this.pan, {
      toValue: num,
      useNativeDriver: false,
    }).start();
  };

  _onRightPress = () => {
    this.props.onDelete && this.props.onDelete();
  };

  render() {
    return (
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            width: Dimensions.get('window').width + this.rightContentWidth,
            height: this.lineHeigh,
            transform: [{ translateX: this.pan }],
          },
        ]}
        {...this.panResponder.panHandlers}>
        {this.props.children}
        <TouchableOpacity
          style={
            this.props.rightContanierStyle ? this.props.rightContanierStyle : {}
          }
          onPress={this._onRightPress}>
          {this.props.rightContent || null}
        </TouchableOpacity>
      </Animated.View>
    );
  }
}