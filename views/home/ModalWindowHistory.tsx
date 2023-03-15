import { memo } from "react";
import { Keyboard, Modal, TouchableWithoutFeedback, View } from "react-native";
import BackArrowSvg from '../../assets/icon/BackArrow.svg'
import styled from "styled-components/native";
import PlusSvg from '../../assets/icon/plus.svg';
 
const HeaderView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 0 0 0 25px;
    max-width: 100%;
 
`;
 
const HeaderText = styled.Text`
    font-size: 20px;
    margin-left: 17px;
`;
 
const ButtonTypeView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin: 44px 0;
    max-width: 100%;
`;
 
const ButtonType = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 48%;
    border-radius: 5px;
    border: 1px solid #C6C3C3;
`;
 
const ButtonTypeText = styled.Text`
    font-size: 15px;
`;
 
const InputView = styled.View`
 
`;
 
const ButtonLow = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin: 14px 0;
    max-width: 100%;
`;
 
const ButtonLowLeft = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 58%;
    border-radius: 5px;
    border: 1px solid #C6C3C3;
`;
 
const ButtonLowRight = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 38%;
    border-radius: 5px;
    border: 1px solid #C6C3C3;
`;
const ButtonHeader = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 35px;
  background-color: #FDFDFD;
  border-radius: 100px;
  margin-left: 60%;
  border: 1px solid #ABA5A5;
`;
 
/** 
@param props
@example
@param KeyboardType
*/
 
 
 
 
const ModalWindowHistory= memo((props: 
    {children: React.ReactNode, 
    visible: boolean, 
    setVisible: React.Dispatch<React.SetStateAction<boolean>>, 
    }) => {
    return (
        <Modal animationType="slide" transparent={false} visible={props.visible} onRequestClose={() => props.setVisible(false)}>
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                <View>
                    <HeaderView>
                        <BackArrowSvg width={25} height={25} onPress={() => {props.setVisible(false)}}/>
                        <HeaderText>Statistics</HeaderText>
 
                    </HeaderView>
 
                    <InputView>
                        {props.children}
                    </InputView>
 
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
})
 
export default ModalWindowHistory