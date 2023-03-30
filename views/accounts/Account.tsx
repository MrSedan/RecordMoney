import { Alert, Text, Modal, View } from 'react-native';
import styled from 'styled-components/native';

import { useCallback, useState } from 'react';
import { account, emptyAccount } from '../../models/interfaces';
import { useFocusEffect } from '@react-navigation/native';
import { addItem, editItem, getData, setData, borderBillionMillionThousand } from '../tools/iosys';
import ModalWindowOneButton from '../modular_components/ModalWindowOneButton';
import Input from '../modular_components/Input';
import { removeAccount } from '../tools/account';
import CardWithButtons from '../modular_components/CardWithButtons';
import PlusSvg from '../../assets/icon/plus.svg';

const getRandomColor = () => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const alpha = 0.5;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const ActiveIndicator = styled.View`
    background-color: ${getRandomColor};
    height: 20px;
    width: 20px;
`;

const Scroll = styled.ScrollView`
    margin: 0;
    height: 100%;
    max-height: 100%;
`;

const ModalInfo = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    background-color: #fff;
    width: 70%;
    height: 30%;
    margin: 50% 15%;
    border-radius: 10px;
    padding: 7%;
`;

const AlertTextContainer = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-bottom: 15%;
`;

const AlertInView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;

const AlertMessage = styled.Text`
    font-family: 'MainFont-Regular';
    font-size: 16px;
    margin-bottom: 10px;
    width: 30%;
`;

const AlertButtonCantainer = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 17%;
`;

const AlertButton = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    // border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    width: auto;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 3%;
`;

const AlertButtonText = styled.Text`
    font-family: 'MainFont-Regular';
    color: #000;
`;

export default function Account(props: {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onModalHide?: Function;
}) {
    const [state, setState] = useState(emptyAccount());
    const [text, setText] = useState(['', '']);
    const [touchItemIndex, setTouchItemIndex] = useState(-1);
    const [editing, setEditing] = useState({ editing: false, index: 0 });
    const [visible, setVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const onStart = async () => {
                let data: account = await getData({ fileName: 'Account' });
                if (data === null) {
                    data = emptyAccount();
                    await setData({ fileName: 'Account', data: data });
                }
                setState(data);
                console.log(data);
            };
            onStart();
        }, []),
    );

    const onClick = async () => {
        let newDat: account = JSON.parse(JSON.stringify(state));
        let dat = {
            id: 0,
            name: text[0].trim(),
            sum: Number(text[1].trim() != '' ? text[1].trim() : ''),
        };
        if (editing.editing) {
            dat.id = newDat.accounts[editing.index].id;
            newDat.accounts[editing.index] = dat;
            editItem('accounts', 'Account', editing.index, dat);
        } else {
            dat.id =
                newDat.accounts.length > 0 ? newDat.accounts[newDat.accounts.length - 1].id + 1 : 0;
            newDat.accounts.push(dat);
            addItem('accounts', 'Account', dat);
        }
        setState(newDat);
        setText(['', '']);
        setEditing({ editing: false, index: 0 });
        props.onModalHide && props.onModalHide();
    };

    const tryToSave = () => {
        if (text[0].trim() == '' || !text[1].trim().match(/^\d+$/)) {
            Alert.alert('Ошибка!', 'Пожалуйста, заполните все обязательные поля корректно.', [
                {
                    text: 'OK',
                    onPress: () => {},
                },
            ]);
        } else {
            onClick();
            props.setVisible(false);
        }
    };

    const del = async (index: number) => {
        Alert.alert(
            'Внимание!',
            'При удалении счета будет удалена вся с ним связанная история! Удалить?',
            [
                {
                    text: 'Да',
                    onPress: async () => {
                        let newDat: account = JSON.parse(JSON.stringify(state));
                        const id_acc = newDat.accounts[index].id;
                        newDat.accounts.splice(index, 1);
                        await removeAccount(id_acc);
                        setState(newDat);
                        props.onModalHide && props.onModalHide();
                    },
                },
                {
                    text: 'Нет',
                    onPress: () => {},
                    style: 'cancel',
                },
            ],
        );
    };

    const openEditModal = (index: number) => {
        setText([state.accounts[index].name, state.accounts[index].sum.toString()]);
        props.setVisible(true);
        setEditing({ editing: true, index: index });
    };

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <ModalWindowOneButton
                visible={props.visible}
                setVisible={props.setVisible}
                windowName={
                    editing.editing
                        ? `Редактирование счёта "${state.accounts[editing.index].name}"`
                        : 'Добавить новый счёт'
                }
                functionCancelButton={() => {
                    setText(['', '']);
                    setEditing({ editing: false, index: 0 });
                }}
                functionSaveButton={tryToSave}
            >
                <Input
                    textName='Название'
                    value={text[0].toString()}
                    index={0}
                    setItems={setText}
                    placeholder='Введите название счета'
                    keyboardType='default'
                    colorActiveInput='#3EA2FF'
                />
                <Input
                    textName='Начальная сумма'
                    value={text[1].toString()}
                    index={1}
                    setItems={setText}
                    placeholder='Введите начальную сумму'
                    keyboardType='numeric'
                    colorActiveInput='#3EA2FF'
                />
            </ModalWindowOneButton>
            <Modal
                animationType='fade'
                transparent={true}
                visible={visible}
                onRequestClose={() => {
                    setVisible(false);
                    setTouchItemIndex(-1);
                }}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                    <ModalInfo>
                        <PlusSvg
                            width={25}
                            height={25}
                            rotation={45}
                            onPress={() => {
                                setTouchItemIndex(-1);
                                setVisible(false);
                            }}
                            style={{ position: 'absolute', left: 13, top: 13 }}
                        />
                        <AlertTextContainer>
                            <AlertInView>
                                <AlertMessage style={{ textDecorationLine: 'underline' }}>
                                    Cчет:
                                </AlertMessage>
                                <AlertMessage style={{ width: '70%', textAlign: 'center' }}>
                                    {touchItemIndex !== -1
                                        ? state.accounts[touchItemIndex].name
                                        : ''}
                                </AlertMessage>
                            </AlertInView>
                            <AlertInView>
                                <AlertMessage style={{ textDecorationLine: 'underline' }}>
                                    Сумма:
                                </AlertMessage>
                                <AlertMessage style={{ width: '70%', textAlign: 'center' }}>
                                    {touchItemIndex !== -1
                                        ? borderBillionMillionThousand(
                                              state.accounts[touchItemIndex].sum,
                                          )
                                        : ''}{' '}
                                    руб
                                </AlertMessage>
                            </AlertInView>
                        </AlertTextContainer>
                        <AlertButtonCantainer>
                            <AlertButton
                                style={{ width: '60%' }}
                                onPress={() => {
                                    if (touchItemIndex !== -1) {
                                        openEditModal(touchItemIndex);
                                        setTouchItemIndex(-1);
                                        setVisible(false);
                                    }
                                }}
                            >
                                <AlertButtonText>Редактировать</AlertButtonText>
                            </AlertButton>
                            <AlertButton
                                style={{ backgroundColor: '#FF8484' }}
                                onPress={() => {
                                    if (touchItemIndex !== -1) {
                                        del(touchItemIndex);
                                        setTouchItemIndex(-1);
                                        setVisible(false);
                                    }
                                }}
                            >
                                <AlertButtonText style={{ color: '#fff' }}>Удалить</AlertButtonText>
                            </AlertButton>
                        </AlertButtonCantainer>
                    </ModalInfo>
                </View>
            </Modal>
            <Scroll>
                {state.accounts &&
                    state.accounts.map((item, index) => {
                        {
                            return (
                                <CardWithButtons
                                    key={index}
                                    func={() => {
                                        setTouchItemIndex(index);
                                        setVisible(true);
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            margin: 10,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <ActiveIndicator />
                                            <Text style={{ marginLeft: 10 }}>
                                                {item.name.length > 10
                                                    ? `${item.name.slice(0, 10)}...`
                                                    : item.name}
                                            </Text>
                                        </View>
                                        <Text>{borderBillionMillionThousand(item.sum)} руб</Text>
                                    </View>
                                </CardWithButtons>
                            );
                        }
                    })}
            </Scroll>
        </View>
    );
}

Account.defaultProps = { visible: false };
