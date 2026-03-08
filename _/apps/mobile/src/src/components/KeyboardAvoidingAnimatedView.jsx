import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

const KeyboardAvoidingAnimatedView = ({ children, style, ...props }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, style]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default KeyboardAvoidingAnimatedView;