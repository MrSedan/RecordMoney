  import React, { useState } from 'react';
  import { ScrollView, View, Text } from 'react-native';
  import { category, history } from '../../models/interfaces';

  const MyComponent = ({categories, history}: {categories: category, history: history}) => {
    const [categoryID, setCategoryID] = useState<number>(1);

    const filteredHistory = history.history.filter(item => item.category === categoryID);

    return (
      <ScrollView>
        <View style={{backgroundColor: categories.categories.filter(item => item.id=== categoryID)[0].color}}>
          <Text>
            {categories.categories.filter(item => item.id === categoryID)[0].name}
          </Text>
        </View>
        {filteredHistory.map(item => (
          <View key={item.id}>
            <Text>{item.date}</Text>
            <Text>{item.sum}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };


  export default MyComponent
