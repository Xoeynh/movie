import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { ListRenderItemInfo } from 'react-native';
import type { Navigation } from '@/types/index';

type Props = {
  movie?: ActorWorkItem[];
};

export type ActorWorkItem = {
  id: number;
  title: string;
  poster: string;
  category: string;
  rating: string;
  release_date: number;
};

function ActorWorks(props: Props): React.ReactElement {
  const navigation: Navigation = useNavigation();

  const renderItem = ({ item }: ListRenderItemInfo<ActorWorkItem>) => (
    <Pressable onPress={() => navigation.push('MovieDetail', { id: item.id })}>
      <View style={styles.item}>
        <Image
          source={{ uri: item.poster }}
          resizeMode={'stretch'}
          style={[styles.itemImage]}
        />
        {item?.category && item?.category !== '电影' && (
          <Text style={styles.itemTag}>{item?.category}</Text>
        )}
        {item?.rating !== null && Number(item?.rating) === 0 && (
          <Text style={styles.itemRating}>暂无评分</Text>
        )}
        {Number(item?.rating) > 0 && (
          <Text style={styles.itemRating}>{item?.rating}分</Text>
        )}
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemText}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.list}>
      <FlatList
        horizontal
        initialNumToRender={6}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderItem}
        data={props.movie}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 4
  },
  item: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 7,
    marginRight: 8
  },
  itemImage: {
    width: 94,
    height: 130,
    borderRadius: 3
  },
  itemTag: {
    position: 'absolute',
    top: 6,
    right: 5,
    paddingVertical: 0.3,
    paddingHorizontal: 1.8,
    backgroundColor: 'rgba(255, 165, 0, 0.7)',
    fontSize: 9,
    color: '#fff',
    textAlign: 'center',
    borderRadius: 2
  },
  itemRating: {
    position: 'absolute',
    right: 4,
    bottom: 34,
    fontSize: 10.5,
    color: 'orange'
  },
  itemText: {
    width: 94,
    marginTop: 5,
    color: '#333',
    fontSize: 12
  }
});

export default ActorWorks;
