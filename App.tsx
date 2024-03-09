import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList, StyleSheet, Text, View, Image, TouchableOpacity} from "react-native";
import {
  Grayscale,
} from 'react-native-color-matrix-image-filters'

const DEFAULT_UUID = 0

const app_images = {
    "instagram": require('./res/instagram.png'),
    "youtube": require('./res/youtube.png'),
    "tiktok": require('./res/tiktok.png'),
    "reddit": require('./res/reddit.png'),
    "facebook": require('./res/facebook.png'),
    "linkedin": require('./res/linkedin.png'),
    "x": require('./res/x.png'),
    "netflix": require('./res/netflix.png')
}

type AppItemProps = {id: number, appId: string, appName: string, disabled: boolean, image: any};

function useApp(appId: string) {
    console.log("Using app ", appId);
    const url = "http://sokrat.xyz:5000/apps"
    const data = { uuid: DEFAULT_UUID, app: appId }

    const params = new URLSearchParams(data).toString();
    const fullUrl = url + "?" + params;

    fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
    }).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data)
    }).catch(console.err);
}

const AppItem = (props: AppItemProps) => {
  const {id, appId, appName, disabled, image} = props;
  const disabledStyle = {opacity: (disabled) ? 0.3 : 1};
  const imageComp = (
    <Image key={appId} source={image} style={[styles.image, disabledStyle]}/>
  )
  const activeImageComp = (
    disabled ? <Grayscale>{imageComp}</Grayscale> : imageComp
  )


  return (
    <View style={styles.item}>
      {activeImageComp}
      <Text style={[styles.title, disabledStyle]}>{appName}</Text>
      <TouchableOpacity style={[styles.button, disabledStyle]} disabled={disabled} onPress={() => useApp(appId)}>
        <Text style={styles.buttonLabel}>Use</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Application() {

  const [apps, setApps] = useState<AppItemProps>([]);

  const itemSeparator = () => {
    return <View style={{ height: 1, backgroundColor: "grey",marginHorizontal:10}} />;
    };

  const listEmpty = () => {
    return (
      <View style={{ alignItems: "center" }}>
      <Text style={styles.item}>No data found</Text>
      </View>
    );
  };

  useEffect(() => {
    fetch("http://sokrat.xyz:5000/apps", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    }).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(JSON.stringify(data, null, 4));
        const user_apps = Object.keys(data["apps"]).map((app, index) => {
            return {
                "id": index,
                "appId": app,
                "appName": data["apps"][app]["app_name"],
                "image": app_images[app],
                "disabled": !data["apps"][app]["today"]["allowed"]
            };
        })
        setApps(user_apps);
    }).catch(console.err);
  }, [])

  return (
  <SafeAreaView style={styles.container}>
    <FlatList
      data={apps}
      renderItem={({ item }) => <AppItem disabled={item.disabled} id={item.id} appId={item.appId} appName={item.appName} image={item.image}/>}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={itemSeparator}
      ListEmptyComponent={listEmpty}
      ListHeaderComponent={() => (
        <Text style={styles.heading}>
          Apps
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
    opacity: 0.3
  },
  button: {
    marginLeft: 'auto',
    marginRight: '12',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderColor: '#121212',
    backgroundColor: '#142ca4', // #3d3d3d
    borderWidth: 1,
    alignSelf: 'flex-end',
    textAlign: 'center',
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    opacity: 0.3
  },
  buttonLabel: {
    fontSize: 20,
    color: '#ffffff',
    opacity: 0.5
  }
});