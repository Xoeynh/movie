import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { actorPhotos } from '@/api/actor';
import type { RouteProp } from '@react-navigation/native';
import type { ResponseType } from '@/types/index';

type Route = RouteProp<{ params: { id: number } }>;

function ActorPhotoDetail(): React.ReactElement {
  const route: Route = useRoute();

  const [tab] = useState([
    { title: '全部', type: 'all' },
    { title: '写真', type: 'portrait' },
    { title: '截图', type: 'cut' },
    { title: '其他', type: 'other' }
  ]);
  const [photo, setPhoto] = useState<Array<{ url?: string }>>([]);
  const [photoParams, setPhotoParams] = useState({
    page: 1,
    per_page: 11,
    type: 'all'
  });

  const getPhotos = () => {
    actorPhotos({
      id: route.params.id,
      ...photoParams
    })
      .then((res: ResponseType) => {
        if (res.code === 200) {
          setPhoto(res.data);
        }
      })
      .catch(() => ({}));
  };

  useEffect(() => {
    if (!route.params.id) {
      return;
    }

    getPhotos();
  }, [photoParams]);

  const toggleSort = (value: string) => {
    setPhotoParams({ ...photoParams, type: value });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.page}>
      <View style={styles.tab}>
        {tab.map((item, index) => {
          return (
            <Pressable
              key={index}
              onPress={() => toggleSort(item.type)}
              style={styles.tabItem}
            >
              <Text
                style={[
                  styles.itemText,
                  photoParams.type === item.type
                    ? styles.activeText
                    : styles.itemText
                ]}
              >
                {item.title}
              </Text>
              <View
                style={
                  photoParams.type === item.type ? styles.activeLine : null
                }
              />
            </Pressable>
          );
        })}
      </View>
      <View style={styles.list}>
        {photo.map((item, index) => {
          return (
            <View key={index} style={styles.item}>
              <Image
                source={{ uri: item.url }}
                resizeMode={'stretch'}
                style={[styles.itemImage]}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff'
  },
  tab: {
    display: 'flex',
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 0.5,
    borderStyle: 'solid',
    borderColor: '#eee'
  },
  tabItem: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  itemText: {
    fontSize: 12,
    color: '#7d7e80',
    textAlign: 'center'
  },
  activeText: {
    color: '#e54847'
  },
  activeLine: {
    position: 'absolute',
    left: '50%',
    bottom: 2.8,
    marginLeft: -12,
    width: 24,
    height: 4,
    backgroundColor: 'rgb(229, 72, 71)',
    borderRadius: 6
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: 10
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: 6,
    marginBottom: 10
  },
  itemImage: {
    width: 93,
    height: 124,
    borderRadius: 3
  }
});

export default ActorPhotoDetail;
