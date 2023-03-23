import { Alert, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

import { useCallback, useState } from 'react';
import { account, emptyAccount } from '../../models/interfaces';
import { useFocusEffect } from '@react-navigation/native';
import { addItem, editItem, getData, setData } from '../tools/iosys';
import ModalWindowOneButton from '../modular_components/ModalWindowOneButton';
import Input from '../modular_components/Input';
import { removeAccount } from '../tools/account';
import CardWithButtons from '../modular_components/CardWithButtons';

const ActiveIndicator = styled.View`
    background-color: #6fe6c2;
    height: 20px;
    width: 20px;
`;
const InactiveIndicator = styled.View`
    background-color: #d9d9d9;
    height: 20px;
    width: 20px;
`;

const Scroll = styled.ScrollView`
    margin: 0;
    height: 100%;
    max-height: 100%;
`;
const Container = styled.View`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;

export default function Account(props: {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [state, setState] = useState(emptyAccount());
    const [text, setText] = useState(['', '']);
    const [editing, setEditing] = useState({ editing: false, index: 0 });

    useFocusEffect(
        useCallback(() => {
            const onStart = async () => {
                let data: account = await getData({ fileName: 'Account' });
                if (data === null) {
                    data = emptyAccount();
                    await setData({ fileName: 'Account', data: data });
                }
                setState(data);
            };
            onStart();
        }, []),
    );

    const onClick = async () => {
        let newDat: account = JSON.parse(JSON.stringify(state));
        let dat = {
            id: 0,
            name: text[0],
            sum: Number(text[1] != '' ? text[1] : ''),
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
    };

    const tryToSave = () => {
        if (text[0] == '') {
            Alert.alert('Ошибка!', 'Пожалуйста, заполните все обязательные поля.', [
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
            <Scroll>
                <Container>
                    {state.accounts &&
                        state.accounts.map((item, index) => {
                            return (
                                <CardWithButtons
                                    key={index}
                                    editModal={() => openEditModal(index)}
                                    del={() => del(index)}
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
                                            {index == 0 ? (
                                                <ActiveIndicator />
                                            ) : (
                                                <InactiveIndicator />
                                            )}
                                            <Text style={{ marginLeft: 10 }}>{item.name}</Text>
                                        </View>
                                        <Text>{`${item.sum}`} руб.</Text>
                                    </View>
                                </CardWithButtons>
                            );
                        })}
                </Container>
            </Scroll>
        </View>
    );
}

Account.defaultProps = { visible: false };
