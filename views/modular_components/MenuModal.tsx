import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import BurgerSvg from '../../assets/icon/Burger.svg';
import Header from './Header';

const ViewHeader = styled.View`
    // margin: 40px 35px 0;
    max-width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid green;
`;

// TODO: Make it normal margin
export default function MenuModal(props: {
    isVisible?: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <View>
            <Modal
                isVisible={props.isVisible}
                backdropColor='#fff'
                backdropOpacity={1}
                backdropTransitionInTiming={0}
                backdropTransitionOutTiming={1000}
                animationInTiming={500}
                animationOutTiming={500}
                animationIn='fadeInLeftBig'
                style={{
                    borderColor: '#000',
                    borderWidth: 1,
                    flex: 1,
                    margin: 0,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                }}
                animationOut='fadeOutLeftBig'
            >
                <ViewHeader>
                    <BurgerSvg
                        width={25}
                        height={25}
                        onPress={() => {
                            props.setVisible(false);
                        }}
                    />
                    <Text>Hello</Text>
                </ViewHeader>
            </Modal>
        </View>
    );
}

MenuModal.defaultProps = {
    isVisible: false,
};
