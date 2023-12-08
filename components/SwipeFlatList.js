import React, { Component } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { SwipeRow } from './SwipeRow';
import { View } from 'react-native';


export class SwipeFlatList extends Component{

  constructor(props) {
    super(props);

    this.rowMap = new Map();
    this.currentRow = undefined;
    console.log(this.props.data, 'this.props.data')
  }

  onGetRowRef = (item, ref) => {
    if (!!ref) this.rowMap.set(item, ref);
  };

  _onRightPress = (item) => {
    const clickRow = this.rowMap.get(item);
    if (!!this.props.onHiddenAreaPress)
      this.props.onHiddenAreaPress(item, clickRow);
    else if (clickRow) clickRow.closeRow();
  };

  _onTouchStart = (item) => {
    const touchedRow = this.rowMap.get(item);
    if (!this.currentRow) this.currentRow = touchedRow;
    else if (this.currentRow !== touchedRow) {
      this.currentRow.closeRow();
      this.currentRow = touchedRow;
    }
  };

  _renderItem = (items) => {
    const _rightContent = this.props.renderHiddenItem(items);
    const _renderItem = this.props.renderItem(items);
    const _key = 'r' + this.props.keyExtrator(items.item, items.index);
    const onGetRef = (ref) => this.onGetRowRef(items.item, ref);
    const onRightPress = () => this._onRightPress(items.item);
    const onTouchStart = () => this._onTouchStart(items.item);

    return (
      <SwipeRow
        rightContent={_rightContent}
        rightContentWidth={this.props.hiddenItemWidth}
        key={_key}
        onDelete={onRightPress}
        lineHeight={this.props.lineHeight}
        onTouchStart={onTouchStart}>
        {_renderItem}
      </SwipeRow>
    );
  };

  onScroll = () => {
    this.currentRow && this.currentRow.closeRow();
  };

  render() {
    return (
      <View style={{ width: Dimensions.get('window').width }}>
        <FlatList
          data={this.props.data}
          renderItem={this._renderItem}
          keyExtractor={this.props.keyExtrator}
          ListHeaderComponent={this.props.ListHeaderComponent || null}
          ListFooterComponent={this.props.ListFooterComponent || null}
          ListEmptyComponent={this.props.ListEmptyComponent || null}
          onLayout={this.props.onLayout}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          onScroll={this.onScroll}
          getItemLayout={this.props.getItemLayout}
          directionalLockEnabled={true}
        />
      </View>
    );
  }
}