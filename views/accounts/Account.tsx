import { Alert, Text, View } from 'react-native';
import styled from 'styled-components/native';

import Header from '../modular_components/Header';
import Card from '../modular_components/Card';
import { useCallback, useEffect, useState } from 'react';
import { account, emptyAccount } from '../../models/interfaces';
import { useFocusEffect } from '@react-navigation/native';
import { getData, setData } from '../tools/iosys';
import ModalWindowOneButton from '../modular_components/ModalWindowOneButton';
import Input from '../modular_components/Input';

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

export default function Account() {
    const [state, setState] = useState(emptyAccount());
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState(['', '']);
    const [editing, setEditing] = useState({ editing: false, index: 0 });

    const curData = {
        id: 1,
        name: 'Account name',
        sum: 123,
    };

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
            dat.id = editing.index;
            newDat.accounts[editing.index] = dat;
        } else {
            dat.id =
                newDat.accounts.length > 0 ? newDat.accounts[newDat.accounts.length - 1].id + 1 : 0;
            newDat.accounts.push(dat);
        }
        await setData({ fileName: 'Account', data: newDat });
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
            setVisible(false);
        }
    };

    const del = async (index: number) => {
        let newDat: account = JSON.parse(JSON.stringify(state));
        newDat.accounts.splice(index, 1);

        await setData({ fileName: 'Account', data: newDat });
        setState(newDat);
    };

    const openEditModal = (index: number) => {
        setText([state.accounts[index].name, state.accounts[index].sum.toString()]);
        setVisible(true);
        setEditing({ editing: true, index: index });
    };
    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <ModalWindowOneButton
                visible={visible}
                setVisible={setVisible}
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
            <Header
                name='Accounts'
                style='1'
                functionLeft={() => {}}
                functionRight={() => {
                    setVisible(true);
                }}
            />
            <Scroll>
                <Container>
                    {state.accounts &&
                        state.accounts.map((item, index) => {
                            return (
                                <Card
                                    key={index}
                                    onPress={() => {
                                        openEditModal(index);
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
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
                                            <Text style={{ marginLeft: 10 }}>
                                                {item.name} {`${item.id}`}
                                            </Text>
                                        </View>
                                        <Text>{`${item.sum}`} руб.</Text>
                                    </View>
                                </Card>
                            );
                        })}
                </Container>
            </Scroll>
        </View>
    );
}
