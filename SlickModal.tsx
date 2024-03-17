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
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
};

const SlickModal = (props: SlickModalProps) => {
    const { isVisible, setIsVisible } = props;
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
                  <Text>HELLO</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '75%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cdd2c9',
    backgroundColor: '#cdd2c9',
    alignSelf: 'baseline',
  }
 });

export default SlickModal;