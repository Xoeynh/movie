import React from 'react';
import { View, StyleSheet } from 'react-native';
import { viewHeight } from '@/utils/screen';

function HomeSkeleton(): React.ReactElement {
  return (
    <View style={styles.home}>
      <View style={styles.search} />
      <View style={styles.banner} />
      <View style={styles.nav}>
        {new Array(4).fill(0).map((item, index) => {
          return (
            <View key={index} style={styles.navItem}>
              <View style={styles.navItemIcon} />
              <View style={styles.navItemName} />
            </View>
          );
        })}
      </View>
      {new Array(3).fill(0).map((item, index) => {
        return (
          <View key={index} style={styles.panel}>
            <View style={styles.panelTitle} />
            <View style={styles.panelContent}>
              {new Array(10).fill(0).map((i, ind) => {
                return (
                  <View key={ind} style={styles.item}>
                    <View style={styles.itemImage} />
                    <View style={styles.itemTitle} />
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    height: viewHeight,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  search: {
    height: 29,
    marginHorizontal: 10,
    marginVertical: 11,
    backgroundColor: '#f5f5f5',
    borderRadius: 48
  },
  banner: {
    height: 190,
    marginHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 4
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
    height: 66,
    paddingTop: 30,
    paddingBottom: 10,
    marginHorizontal: 10,
    marginBottom: 40,
    borderRadius: 6
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    height: 66
  },
  navItemIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 6
  },
  navItemName: {
    width: 50,
    height: 12,
    marginTop: 6,
    backgroundColor: '#f5f5f5'
  },
  panel: {
    margin: 10,
    marginBottom: 28
  },
  panelTitle: {
    width: 94,
    height: 13,
    marginTop: 6,
    marginLeft: 10,
    backgroundColor: '#f5f5f5'
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 10
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: 10
  },
  itemImage: {
    width: 94,
    height: 130,
    backgroundColor: '#f5f5f5',
    borderRadius: 3
  },
  itemTitle: {
    width: 94,
    height: 13,
    marginTop: 5,
    backgroundColor: '#f5f5f5'
  }
});

export default HomeSkeleton;
