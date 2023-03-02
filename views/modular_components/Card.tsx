import { View, Text } from 'react-native';
import styled from 'styled-components/native'

const CardView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    max-height: 60px;
    margin: 30px 52px; 
    border: 1px solid #CECCCC;
    padding: 10px;
    border-radius: 10px;
`;

export default function Card () {
  return (
    <View>
      <CardView>
        
      </CardView>
    </View>
  );
}