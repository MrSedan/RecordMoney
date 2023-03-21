import { memo } from 'react';
import { Keyboard, Modal, TouchableWithoutFeedback, View } from 'react-native';
import BackArrowSvg from '../../assets/icon/BackArrow.svg';
import styled from 'styled-components/native';

const HeaderView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 20px 0 0 25px;
    max-width: 100%;
`;

const HeaderText = styled.Text`
    font-family: 'MainFont-Regular';
    font-size: 20px;
    margin-left: 17px;
`;

const ButtonTypeText = styled.Text`
    font-family: 'MainFont-Regular';
    font-size: 15px;
`;

const InputView = styled.View`
    display: flex;
    justify-content: center;
    height: auto;
    padding: 5% 0;
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
    border: 1px solid #c6c3c3;
`;

const ButtonLowRight = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 38%;
    border-radius: 5px;
    border: 1px solid #c6c3c3;
`;

const ModalWindowOneButton = memo(
    (props: {
        children: React.ReactNode;
        visible: boolean;
        setVisible: React.Dispatch<React.SetStateAction<boolean>>;
        windowName: string;
        functionSaveButton: Function;
        functionCancelButton: Function;
    }) => {
        return (
            <Modal
                animationType='slide'
                transparent={false}
                visible={props.visible}
                onRequestClose={() => props.setVisible(false)}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss();
                    }}
                >
                    <View>
                        <HeaderView>
                            <BackArrowSvg
                                width={25}
                                height={25}
                                onPress={() => {
                                    props.setVisible(false);
                                    props.functionCancelButton();
                                }}
                            />
                            <HeaderText>{props.windowName}</HeaderText>
                        </HeaderView>

                        <InputView>{props.children}</InputView>
                        <View style={{ borderBottomColor: '#C6C3C3', borderBottomWidth: 1 }} />
                        <ButtonLow>
                            <ButtonLowLeft
                                onPress={() => {
                                    props.functionSaveButton();
                                }}
                                style={{ backgroundColor: '#3EA2FF' }}
                            >
                                <ButtonTypeText style={{ color: 'white' }}>
                                    Сохранить
                                </ButtonTypeText>
                            </ButtonLowLeft>
                            <ButtonLowRight
                                onPress={() => {
                                    props.setVisible(false);
                                    props.functionCancelButton();
                                }}
                            >
                                <ButtonTypeText>Отмена</ButtonTypeText>
                            </ButtonLowRight>
                        </ButtonLow>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    },
);

export default ModalWindowOneButton;
