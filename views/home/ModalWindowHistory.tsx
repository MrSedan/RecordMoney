import { memo } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import BackArrowSvg from '../../assets/icon/BackArrow.svg';
import styled from 'styled-components/native';

const HeaderView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 15px 0 0 25px;
    max-width: 100%;
`;

const HeaderText = styled.Text`
    font-size: 20px;
    margin-left: 17px;
`;

const InputView = styled.View``;

const ModalWindowHistory = memo(
    (props: {
        children: React.ReactNode;
        visible: boolean;
        type: boolean;
        setVisible: React.Dispatch<React.SetStateAction<boolean>>;
        functio?: Function;
    }) => {
        return (
            <Modal
                animationType='slide'
                transparent={false}
                visible={props.visible}
                onRequestClose={() => {
                    props.functio && props.functio();
                    props.setVisible(false);
                }}
            >
                <View style={{ height: '100%' }}>
                    <HeaderView>
                        <BackArrowSvg
                            width={25}
                            height={25}
                            onPress={() => {
                                props.functio && props.functio();
                                props.setVisible(false);
                            }}
                        />
                        <HeaderText>Statistics</HeaderText>
                    </HeaderView>
                    <ScrollView style={{ marginBottom: '5%' }}>
                        <InputView>{props.children}</InputView>
                    </ScrollView>
                </View>
            </Modal>
        );
    },
);

export default ModalWindowHistory;
