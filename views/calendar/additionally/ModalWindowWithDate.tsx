import { memo, useState } from "react";
import { Keyboard, Modal, TouchableWithoutFeedback, View } from "react-native";
import BackArrowSvg from '../../assets/icon/BackArrow.svg'
import styled from "styled-components/native";
import DateTimePicker from "react-native-modal-datetime-picker";

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


const ModalWindow = memo((props: {children: React.ReactNode, visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>, buttonTextLeft: string, buttonTextRight: string, activeModalButton: boolean, setActiveModalButton: React.Dispatch<React.SetStateAction<boolean>>, colorActiveLeft: string, colorActiveRight: string,functionSaveButton: Function,functionCancelButton: Function}) => {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    const handleDateConfirm = (date: Date) => {
        setSelectedDate(date);
        setIsDatePickerVisible(false);
    };

    const handleDateCancel = () => setIsDatePickerVisible(false);

    const handleTextInputPress = () => setIsDatePickerVisible(true);

    return (
        <Modal animationType="slide" transparent={false} visible={props.visible} onRequestClose={() => props.setVisible(false)}>
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                <View>
                    <HeaderView>
                        <BackArrowSvg width={25} height={25} onPress={() => {props.setVisible(false)}}/>
                        <HeaderText onPress={() => Keyboard.dismiss()}>{(props.activeModalButton) ? `${props.buttonTextLeft}` : props.buttonTextRight}</HeaderText>
                    </HeaderView>
                    <ButtonTypeView>
                        <ButtonType onPress={() => props.setActiveModalButton(true)} style={(props.activeModalButton) ? {borderColor: `${props.colorActiveLeft}`} : {borderColor: '#C6C3C3'}}>
                            <ButtonTypeText style={(props.activeModalButton) ? {color: `${props.colorActiveLeft}`} : {color: '#C6C3C3'}}>{props.buttonTextLeft}</ButtonTypeText>
                        </ButtonType>
                        <ButtonType onPress={() => props.setActiveModalButton(false)} style={(props.activeModalButton) ? {borderColor: '#C6C3C3'} : {borderColor: `${props.colorActiveRight}`}}>
                            <ButtonTypeText style={(props.activeModalButton) ? {color: '#C6C3C3'} : {color: `${props.colorActiveRight}`}}>{props.buttonTextRight}</ButtonTypeText>
                        </ButtonType>
                    </ButtonTypeView>
                    <InputView>
                        {props.children}
                    </InputView>
                    <DateTimePicker
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleDateConfirm}
                        onCancel={handleDateCancel}
                    />
                    <View style={{borderBottomColor: '#C6C3C3', borderBottomWidth: 1}}/> 
                    <ButtonLow>
                        <ButtonLowLeft onPress={() => {props.setVisible(false); props.functionSaveButton()}} style={(props.activeModalButton) ? {backgroundColor: `${props.colorActiveLeft}`} : {backgroundColor: `${props.colorActiveRight}`}}>
                            <ButtonTypeText style={{color: 'white'}}>Сохранить</ButtonTypeText>
                        </ButtonLowLeft>
                        <ButtonLowRight onPress={() => {props.setVisible(false); props.functionCancelButton()}}>
                            <ButtonTypeText>Отмена</ButtonTypeText>    
                        </ButtonLowRight>                    
                    </ButtonLow>  
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
})

export default ModalWindow