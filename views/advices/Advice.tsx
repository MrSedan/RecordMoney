// import { Text, View } from 'react-native';

// export default function Advice() {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>This is Advices screen!</Text>
//         </View>
//     )
// }
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { removeAllData } from '../tools/iosys';

export default function CardSwipe() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
                style={{ width: 100, height: 100, backgroundColor: 'red' }}
                onPress={() => {
                    removeAllData();
                }}
            />
        </View>
    );
}
