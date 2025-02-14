import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { viewHeight } from '@/utils/screen';
import { movieTop } from '@/api/home';
import type { Navigation } from '@/types/index';
import ScrollRefresh from '@/components/scroll-refresh/ScrollRefresh';

type MovieItem = {
  id: number;
  title: string;
  poster: string;
  year: number;
  genres: string;
  countries: string;
  rating: string;
};

function HighScore(): React.ReactElement {
  const navigation: Navigation = useNavigation();

  const renderItem = ({ item, index }: { item: MovieItem; index: number }) => (
    <Pressable onPress={() => navigation.push('MovieDetail', { id: item.id })}>
      <View style={styles.item}>
        <View style={styles.itemCover}>
          <Image
            source={{ uri: item.poster }}
            resizeMode={'stretch'}
            style={[styles.itemImage]}
          />
          {index === 0 && (
            <View style={[styles.itemCoverBg, styles.coverBgColor1]} />
          )}
          {index === 1 && (
            <View style={[styles.itemCoverBg, styles.coverBgColor2]} />
          )}
          {index === 2 && (
            <View style={[styles.itemCoverBg, styles.coverBgColor3]} />
          )}
          {index > 2 && (
            <View style={[styles.itemCoverBg, styles.coverBgColor4]} />
          )}
          <Text style={styles.itemCoverText}>{index + 1}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitle}>
            {item.title}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemText}>
            {item.year}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemText}>
            {item.genres}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemText}>
            {item.countries}
          </Text>
        </View>
        {Number(item?.rating) > 0 && (
          <Text style={styles.itemRating}>
            <Text style={styles.itemRatingWeight}>{item?.rating}</Text> 分
          </Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.page}>
      <ScrollRefresh
        requestParams={{
          page: 1,
          pageSize: 10
        }}
        request={movieTop}
        renderItem={renderItem}
        initialNumToRender={6}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingBottom: Platform.OS !== 'web' ? 10 : 0,
    // web端需减去标题栏高度
    height: Platform.OS === 'web' ? viewHeight - 42 : viewHeight,
    backgroundColor: '#fff'
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 18,
    marginRight: -20,
    marginLeft: 16
  },
  itemCover: {
    position: 'relative',
    width: 93,
    height: 124,
    borderRadius: 3,
    overflow: 'hidden'
  },
  itemImage: {
    width: 93,
    height: 124
  },
  itemCoverBg: {
    position: 'absolute',
    top: -18,
    left: -14,
    width: 30,
    height: 48,
    transform: [{ rotate: '-135deg' }]
  },
  coverBgColor1: {
    backgroundColor: 'red'
  },
  coverBgColor2: {
    backgroundColor: '#ff4500'
  },
  coverBgColor3: {
    backgroundColor: '#f4a460'
  },
  coverBgColor4: {
    backgroundColor: '#adadad'
  },
  itemCoverText: {
    position: 'absolute',
    top: 1.6,
    left: 5,
    zIndex: 1,
    fontSize: 10,
    color: '#fff'
  },
  itemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingRight: 15,
    marginLeft: 13
  },
  itemTitle: {
    marginBottom: 1,
    fontSize: 14,
    color: '#333'
  },
  itemText: {
    marginTop: 8,
    fontSize: 11,
    color: '#999'
  },
  itemRating: {
    width: 68,
    fontSize: 8,
    color: '#f16c00'
  },
  itemRatingWeight: {
    fontSize: 12,
    fontWeight: '700'
  }
});

export default HighScore;
