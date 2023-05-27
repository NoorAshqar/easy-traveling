import React from 'react';
import {View, Modal, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';

const LoadingPopup = ({isVisible}) => {
  return (
    <Modal 
        visible={isVisible} 
        transparent={true} 
        animationType="fade">
        <View View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    </Modal>
  );
};

LoadingPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

const styles = {
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

export default LoadingPopup;
