import { StatusBar, Text, View } from 'react-native';
import styled from 'styled-components/native';

const ViewHeader = styled.View`
  margin: 40px 35px 0;
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
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  background-color: #FDFDFD;
  border-radius: 100px;
  border: 1px solid #ABA5A5;
`;

export default function Header (props: {name: string, style:string}) {
  return (
    <View>
      <ViewHeader>
        <IconHeader source={require('../../assets/icon/IconHeader.png')}/>
        <TextHeader>{props.name}</TextHeader>
        {(props.style == '1') ?
        <ButtonHeader 
          onPress={() => {}} 
          style={{shadowColor: '#625E5E',
            elevation: 10, 
        }}>
          <IconHeader source={require('../../assets/icon/plus.png')}/>
        </ButtonHeader>
        :
          <IconHeader source={require('../../assets/icon/Arrow.png')}/>
      }
      </ViewHeader>
    </View>
  );
}