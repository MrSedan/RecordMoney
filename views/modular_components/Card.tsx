import { View, Text } from 'react-native';
import styled from 'styled-components/native'

const CardView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    max-height: 60px;
    margin: 20px 52px; 
    border: 1px solid #CECCCC;
    padding: 10px;
    border-radius: 10px;
`;

export default function Card ({children}: {children: React.ReactNode}) {
  return (
    <View>
      <CardView>
        {children}
      </CardView>
    </View>
  );
}