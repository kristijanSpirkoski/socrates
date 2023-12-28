import React from "react";
import { SafeAreaView, FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

const pleasures = [
  {
	id: "1",
	title: "Instagram",
	image: require('./res/instagram.png'),
  },
  {
	id: "2",
	title: "YouTube",
	image: require('./res/youtube.png')
  },
  {
	id: "3",
	title: "TikTok",
	image: require('./res/tiktok.png')
  },
  {
	id: "4",
	title: "Reddit",
	image: require('./res/reddit.png')
  },
  {
	id: "5",
	title: "Facebook",
	image: require('./res/facebook.png')
  },
  {
	id: "6",
	title: "LinkedIn",
	image: require('./res/linkedin.png')
  },
  {
	id: "7",
	title: "X",
	image: require('./res/x.png')
  },
  {
	id: "8",
	title: "Netflix",
	image: require('./res/netflix.png')
  }
];

type ItemProps = {title: string, image: any};

const Item = ({title, image}: ItemProps) => (
  <View style={styles.item}>
    <Image key={title} source={image} style={styles.image}/>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonLabel}>Use</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {

  const myItemSeparator = () => {
    return <View style={{ height: 1, backgroundColor: "grey",marginHorizontal:10}} />;
    };

  const myListEmpty = () => {
    return (
      <View style={{ alignItems: "center" }}>
      <Text style={styles.item}>No data found</Text>
      </View>
    );
  };

return (
  <SafeAreaView style={styles.container}>
    <FlatList
      data={pleasures}
      renderItem={({ item }) => <Item title={item.title} image={item.image}/>}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={myItemSeparator}
      ListEmptyComponent={myListEmpty}
      ListHeaderComponent={() => (
        <Text style={styles.heading}>
          Pleasures
        </Text>
      )}
      ListFooterComponent={() => (
        <Text style={{ fontSize: 30, textAlign: "center",marginBottom:20,fontWeight:'bold' }}>{}</Text>
      )}
    />
  </SafeAreaView>
  );
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    backgroundColor: '#212121'
  },
  heading: {
   fontSize: 30,
   color: 'white',
   textAlign: "center",
   marginTop:20,
   fontWeight:'bold',
   textDecorationLine: 'underline'
  },
  item: {
    padding: 20,
    paddingEnd: 32,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    color: '#ffffff'
  },
  image: {
    width: 50,
    height: 50,
    marginEnd: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3d3d3d',
  },
  button: {
    marginLeft: 'auto',
    marginRight: '12',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderColor: '#121212',
    backgroundColor: '#3d3d3d',
    borderWidth: 1,
    alignSelf: 'flex-end',
    textAlign: 'center',
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  buttonLabel: {
    fontSize: 20,
    color: '#ffffff'
  }
});