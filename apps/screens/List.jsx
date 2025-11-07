import {View, Text} from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { Button } from 'react-native/types_generated/index';

const List = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

    <Button title="Go to Details" onPress={() => NavigationActivation.navigate('details')} />
    <Button title="Sign Out" onPress={() => FIREBASE_AUTH.signOut()} />

    </View>
    );
    
};

export default List;