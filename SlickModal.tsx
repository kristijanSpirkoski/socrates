import {
    Modal,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback
} from "react-native";

type SlickModalProps = {
    title: string;
    body: string;
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
};

const SlickModal = (props: SlickModalProps) => {
    const { title, body, isVisible, setIsVisible } = props;
    return (
     <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isVisible}
          onRequestClose={() => {setIsVisible(false)}}
        >
          <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPressOut={() => {setIsVisible(false)}}
          >
            <ScrollView
              directionalLockEnabled={true}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <Text style={styles.content}>{title}</Text>
                  <Text style={styles.content}>{body}</Text>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </TouchableOpacity>
        </Modal>
     </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 20,
    backgroundColor: '#142ca4',
    borderRadius: 20,
    borderWidth: 2,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    color: '#ffffff',
    fontFamily: 'monospace',
    textAlign: 'center',
  }
 });

export default SlickModal;