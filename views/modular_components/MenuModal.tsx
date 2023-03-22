import { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import BurgerSvg from '../../assets/icon/Burger.svg';
import PlusSvg from '../../assets/icon/plus.svg';
import Account from '../accounts/Account';

const ViewHeader = styled.View`
    margin: 4px 35px 0;
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
    font-weight: 700;
`;
const ButtonHeader = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 35px;
    background-color: #fdfdfd;
    border-radius: 100px;
    border: 1px solid #aba5a5;
`;

export default function MenuModal(props: {
    isVisible?: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [accountVisible, setAccountVisible] = useState(false);

    return (
        <View>
            <Modal
                isVisible={props.isVisible}
                backdropColor='#fff'
                backdropOpacity={1}
                backdropTransitionInTiming={0}
                backdropTransitionOutTiming={0}
                animationInTiming={500}
                animationOutTiming={500}
                animationIn='fadeInLeftBig'
                style={{
                    flex: 1,
                    margin: 0,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                }}
                animationOut='fadeOutLeftBig'
            >
                <ViewHeader>
                    <PlusSvg
                        width={25}
                        height={25}
                        rotation={45}
                        onPress={() => {
                            props.setVisible(false);
                        }}
                    />
                    <TextHeader>Accounts</TextHeader>
                    <ButtonHeader
                        onPress={() => {
                            setAccountVisible(true);
                        }}
                        style={{ shadowColor: '#625E5E', elevation: 10 }}
                    >
                        <PlusSvg width={15} height={15} />
                    </ButtonHeader>
                </ViewHeader>
                <Account visible={accountVisible} setVisible={setAccountVisible} />
            </Modal>
        </View>
    );
}

MenuModal.defaultProps = {
    isVisible: false,
};
