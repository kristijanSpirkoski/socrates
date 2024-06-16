import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ToastAndroid,
    Platform,
    AlertIOS
} from "react-native";
import {
  Grayscale,
} from 'react-native-color-matrix-image-filters'

import SlickModal from './SlickModal';

const DEFAULT_UUID = 0
const HOST = '178-79-134-180.ip.linodeusercontent.com'; // sokrat.xyz
const PORT = '5000';

const appImages = {
    "instagram": require('./res/instagram.png'),
    "youtube": require('./res/youtube.png'),
    "tiktok": require('./res/tiktok.png'),
    "reddit": require('./res/reddit.png'),
    "facebook": require('./res/facebook.png'),
    "linkedin": require('./res/linkedin.png'),
    "x": require('./res/x.png'),
    "netflix": require('./res/netflix.png')
}

type AppInfo = {
    appId: string,
    appName: string
};

type AppModeration = {
    daysPerWeek: number,
    minutesPerDay: number,
}

type DayStatus = {
    status: 'used' | 'usable' | 'unusable',
    usage: number
};

type AppHistory = {
    thisWeek: {
        monday?: DayStatus,
        tuesday?: DayStatus,
        wednesday?: DayStatus,
        thursday?: DayStatus,
        friday?: DayStatus,
        saturday?: DayStatus,
        sunday?: DayStatus,
    }
}

type AppItemProps = {
    id: number,
    app: AppInfo,
    disabled: boolean,
    moderation: AppModeration,
    history: AppHistory,
    useApp: (appInfo: AppInfo) => void;
    checkoutApp: (
        appInfo: AppInfo,
        appModeration: AppModeration,
        appHistory: AppHistory,
    ) => void;
};

const AppItem = (props: AppItemProps) => {
  const {id, app, disabled, moderation, history, useApp, checkoutApp} = props;
  const { appId, appName } = app;
  const disabledStyle = {opacity: (disabled) ? 0.3 : 1};
  // create image component
  const image = appImages[appId];
  const imageComp = (
    <React.Fragment>
        <Image key={appId} source={image} style={[styles.image, disabledStyle]}/>
    </React.Fragment>
  );
  const activeImageComp = (
    disabled ? <Grayscale>{imageComp}</Grayscale> : imageComp
  )

  return (
    <TouchableWithoutFeedback onPress={ () => checkoutApp(app, moderation, history)}>
        <View style={styles.item}>
          {activeImageComp}
          <Text style={[styles.title, disabledStyle]}>{appName}</Text>
          <TouchableOpacity
            style={[styles.button, disabledStyle]}
            disabled={disabled}
            onPress={() => useApp({appId, appName})}>
            <Text style={styles.buttonLabel}>Use</Text>
          </TouchableOpacity>
        </View>
    </TouchableWithoutFeedback>
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
    fetch(`https://${HOST}:${PORT}/users/${DEFAULT_UUID}/apps`, {
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
                "app": {
                    "appId": app,
                    "appName": data["apps"][app]["app_name"],
                },
                "moderation": {
                    "minutesPerDay": data["apps"][app]["moderation"]["minutes_per_day"],
                    "daysPerWeek": data["apps"][app]["moderation"]["days_per_week"],
                },
                "history": {"thisWeek": data["apps"][app]["this_week"]},
                "disabled": !(data["apps"][app]["today"]["status"] === "usable")
            };
        })
        setApps(user_apps);
    }).catch(console.err);
  }, [])

  const useApp = (appInfo: AppInfo) => {
    const {appId, appName} = appInfo;
    console.log("Using app ", appId);

    const updatedApps = apps.map((app) => {
        if (app['app']['appId'] === appId) {
            return {
                ...app,
                disabled: true,
            }
        }
        return app;
    });
    setApps(updatedApps);


    const url = `https://${HOST}:${PORT}/users/${DEFAULT_UUID}/apps/${appId}`

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(() => {
        const notification = `You can now use ${appName}`;
        if (Platform.OS === 'android') {
          ToastAndroid.show(notification, ToastAndroid.LONG);
        } else {
          AlertIOS.alert(notification);
        }
    }).catch(console.err);
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  return (
  <SafeAreaView style={styles.container}>
    <View>
    <SlickModal title={modalTitle} body={modalBody} isVisible={modalVisible} setIsVisible={setModalVisible}>
    </SlickModal>
    </View>
    <FlatList
      data={apps}
      renderItem={({ item }) => <AppItem
       checkoutApp={(appInfo: AppInfo, appModeration: AppModeration, appHistory: AppHistory) => {
            const {appId, appName} = appInfo;
            const {minutesPerDay, daysPerWeek} = appModeration;

            const thisWeek = appHistory['thisWeek'];
            let historyLabel = '';
            historyLabel += thisWeek['monday'] ? `Monday: ${thisWeek['monday']['status']}\n` : '';
            historyLabel += thisWeek['tuesday'] ? `Tuesday: ${thisWeek['tuesday']['status']}\n` : '';
            historyLabel += thisWeek['wednesday'] ? `Wednesday: ${thisWeek['wednesday']['status']}\n` : '';
            historyLabel += thisWeek['thursday'] ? `Thursday: ${thisWeek['thursday']['status']}\n` : '';
            historyLabel += thisWeek['friday'] ? `Friday: ${thisWeek['friday']['status']}\n` : '';
            historyLabel += thisWeek['saturday'] ? `Saturday: ${thisWeek['saturday']['status']}\n` : '';
            historyLabel += thisWeek['sunday'] ? `Sunday: ${thisWeek['sunday']['status']}\n` : '';

            setModalVisible(true);
            setModalTitle(appName + '\n');
            const body =
            `================================\n` +
            `+          Moderation          +\n` +
            `================================\n` +
            `Your configuration for ${appName} is:\n`  +
            `${minutesPerDay} minutes per day\n` +
            `${daysPerWeek} days per week\n\n` +
            `================================\n` +
            `+          This Week           +\n` +
            `================================\n` +
            `${historyLabel}`;
            setModalBody(body);
       }}
       useApp={useApp}
       disabled={item.disabled}
       id={item.id}
       app={item.app}
       moderation={item.moderation}
       history={item.history}/>
      }
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
    fontFamily: 'monospace',
    fontSize: 22,
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
    color: '#ffffff',
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
    opacity: 0.5,
    fontFamily: 'monospace'
  }
});