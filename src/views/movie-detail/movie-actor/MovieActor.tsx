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
  movie: ActorItem[];
};

export type ActorItem = {
  union_id: number;
  id: number;
  avatar: string;
  name: string;
  profession: string;
  act: string;
};

function MovieActor(props: Props): React.ReactElement {
  const navigation: Navigation = useNavigation();

  const renderItem = ({ item }: ListRenderItemInfo<ActorItem>) => (
    <Pressable onPress={() => navigation.push('ActorDetail', { id: item.id })}>
      <View style={styles.item}>
        <Image
          source={{ uri: item.avatar }}
          resizeMode={'stretch'}
          style={[styles.itemImage]}
        />
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemText}>
          {item.name}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.labelText}>
          {item?.profession === '导演' ? item?.profession : ''}
          {item?.act ? `饰: ${item?.act}` : ''}
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
    borderRadius: 4
  },
  item: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: 94,
    paddingBottom: 7,
    marginRight: 8
  },
  itemImage: {
    height: 130,
    borderRadius: 3
  },
  itemText: {
    marginTop: 5,
    color: '#fff',
    fontSize: 12
  },
  labelText: {
    color: 'hsla(0,0%,96.1%,.75)',
    fontSize: 10
  }
});

export default MovieActor;
