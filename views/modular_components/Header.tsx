import { StatusBar, Text, View } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

const ViewHeader = styled.View`
  margin: 40px 35px;
  max-width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TextHeader = styled.Text`
  font-family: 'Montserrat';
  font-size: 20px;
  font-weight: 700;
`;

const IconHeader = styled.Image``;

const ButtonHeader = styled.TouchableOpacity`
  display: flex;
  height: 40px;
  width: 40px;
  background-color: #FDFDFD;
  border-radius: 100px;
  border: 1px solid #ABA5A5;
`;

const ButtonText = styled.Text`
  text-align: center;
  font-family: 'Montserrat';
  font-size: 30px;
  color: #625E5E;
`;

export default function Header (props: {name: string}) {
  return (
    <View>
      <ViewHeader>
        <IconHeader source={require('../../assets/icon/IconHeader.png')}/>
        <TextHeader>{props.name}</TextHeader>
        <ButtonHeader 
          onPress={() => {}} 
          style={{shadowColor: '#625E5E',
            elevation: 10, 
        }} >
          <ButtonText>+</ButtonText>
        </ButtonHeader>
      </ViewHeader>
    </View>
  );
}