import { StatusBar, Text, View } from 'react-native';
import styled from 'styled-components/native';
import PlusSvg from '../../assets/icon/plus.svg';
import BurgerSvg from '../../assets/icon/Burger.svg';
import ArrowSvg from '../../assets/icon/Arrow.svg';

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
  font-family: 'MainFont-Bold';
  font-size: 20px;
`;

const ButtonHeader = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 35px;
  background-color: #FDFDFD;
  border-radius: 100px;
  border: 1px solid #ABA5A5;
`;

/** 
 * Компонент для отрисовки шапки с функционированием левой и правой кнопки
 * @param props - name - название, style - стиль отображения (1 - стрелка, 2 - плюсик), functionLeft - функционирование левой кнопки шапки, functionRight - функционирование правой кнопки шапки
 * @example ```ts
 * <Header name='Debt' style='1' functionLeft={() => {click()}} functionRight={() => {}}/>
 * ```
*/

export default function Header (props: {name: string, style:string, functionLeft: Function, functionRight: Function}) {
  return (
    <View>
      <ViewHeader>
        <BurgerSvg width={25} height={25} onPress={() => {props.functionLeft()}}/>
        <TextHeader>{props.name}</TextHeader>
        {(props.style == '1') ?
        <ButtonHeader 
          onPress={() => {props.functionRight()}} 
          style={{shadowColor: '#625E5E',
            elevation: 10, 
        }}>
          <PlusSvg width={15} height={15}/>
        </ButtonHeader>
        :
          <ArrowSvg width={25} height={25} onPress={() => {props.functionRight()}}/>
      }
      </ViewHeader>
    </View>
  );
}