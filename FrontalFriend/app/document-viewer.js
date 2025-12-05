import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function DocumentViewer({ route }) {
  const { url, name } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.header}>{name}</Text>
      <WebView source={{ uri: url }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold"
  }
});
