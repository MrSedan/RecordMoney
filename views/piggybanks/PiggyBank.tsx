import { Alert, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import Header from '../modular_components/Header';
import { emptyPiggyBank, piggyBank } from '../../models/interfaces';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getData, setData } from '../tools/iosys';
import Card from '../modular_components/Card';
import ModalWindowOneButton from '../modular_components/ModalWindowOneButton';
import Input from '../modular_components/Input';

const Scroll = styled.ScrollView`
    heigth: 100%;
`;

const ButtonType = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 48%;
    border-radius: 5px;
    border: 1px solid #c6c3c3;
`;

const ButtonTypeText = styled.Text`
    font-size: 15px;
`;

const ButtonTypeView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin: 44px 0;
    max-width: 100%;
`;

const KTitle = styled.Text`
    font-weight: 400;
    font-size: 15px;
    color: #000000;
    letter-spacing: 1px;
`;

const KMoney = styled.Text`
    font-weight: 400;
    font-size: 15px;
    letter-spacing: 1px;
    color: #000000;
`;

const Kopilka = styled.View`
    display: flex;
    margin: 0 auto;
    margin-bottom: 5%;
    width: 90%;
    background: #ffffff;
    border: 1px solid #cecccc;
    box-shadow: 0px 2px 48px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    padding: 5px;
`;

const Container = styled.View`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const KDetails = styled.View`
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 10px 10px 10px 10px;
`;

const FullBar = styled.View`
    width: 100%;
    border-radius: 16px;
    align-items: flex-start;
    justify-content: center;
    height: 20px;
    background-color: #7d85fd;
`;

const Content = styled.View`
    border-radius: 16px;
    height: 20px;
    background-color: #0413e7;
    width: 40%;
`;

function ProgressBar(props: { weight1: string }) {
    return (
        <FullBar>
            <Content style={{ width: ` ${props.weight1}` }} />
        </FullBar>
    );
}

export default function PiggyBank() {
    const [state, setState] = useState(emptyPiggyBank());
    const [counter, setCounter] = useState(0);
    const [active, setActive] = useState(false);
    const [visible, setVisible] = useState(false);
    const [activeModalButton, setActiveModalButton] = useState(true);
    const [text, setText] = useState(['', '', '0']);
    const [sumcar, setSumcar] = useState([' ']);
    const [editing, setEditing] = useState({ editing: false, index: 0 });
    const [editsum, setEditsum] = useState({ editsum: false, index: 0 });
    const [svisible, setSVisible] = useState(false);

    const curData = {
        id: 1,
        id_account: 1,
        name: 'Билет в Москву',
        sum_max: 30000,
        sum_cur: 20000,
        status: false,
    };

    const openEdit = (index: number) => {
        setText([state.piggyBanks[index].name, state.piggyBanks[index].sum_max.toString()]);
        setVisible(true);
        setEditing({ editing: true, index: index });
    };

    useFocusEffect(
        useCallback(() => {
            const search = async () => {
                let data: piggyBank = await getData({ fileName: 'PiggyBank' });

                if (data === null) {
                    await setData({ fileName: 'PiggyBank', data: emptyPiggyBank() });
                    data = emptyPiggyBank();
                }
                setState(data);
                setCounter(data.piggyBanks.length);
            };
            search();
        }, []),
    );

    const click = async () => {
        if (text[0] == '') {
            Alert.alert('Ошибка!', 'Пожалуйста, заполните все обязательные поля.', [
                {
                    text: 'OK',
                    onPress: () => {},
                },
            ]);
        } else {
            let NewDat: piggyBank = await getData({ fileName: 'PiggyBank' });
            let dat = curData;
            dat.name = text[0];
            dat.sum_max = +text[1];
            dat.sum_cur = +text[2];
            dat.status = false;
            if (editing.editing) {
                dat.id = editing.index;
                NewDat.piggyBanks[editing.index] = dat;
            } else {
                dat.id =
                    NewDat.piggyBanks.length > 0
                        ? NewDat.piggyBanks[NewDat.piggyBanks.length - 1].id + 1
                        : 0;
                NewDat.piggyBanks.push(curData);
            }
            await setData({ fileName: 'PiggyBank', data: NewDat });
            setText(['', '', ' ']);
            setState(NewDat);
            setCounter(counter + 1);
            setVisible(false);
        }
    };

    const clicksum = async () => {
        if (text[2] == '') {
            Alert.alert('Ошибка!', 'Пожалуйста, заполните все обязательные поля.', [
                {
                    text: 'OK',
                    onPress: () => {},
                },
            ]);
        } else {
            let NewDat: piggyBank = await getData({ fileName: 'PiggyBank' });
            let dat = curData;
            dat.name = text[0];
            dat.sum_max = +text[1];
            dat.sum_cur = +(state.piggyBanks[editsum.index].sum_cur + +text[2]);
            if (dat.sum_cur > dat.sum_max) {
                Alert.alert(
                    'Ошибка!',
                    'Вы ввели сумму больше оставшейся, пожалуйста заполните корректную сумму',
                    [
                        {
                            text: 'OK',
                            onPress: () => {},
                        },
                    ],
                );

                dat.status = false;
                editsum.editsum = false;
            } else {
                if (dat.sum_cur === dat.sum_max) {
                    Alert.alert(
                        'Поздравляю!',
                        'Вы закрыли свою цель! Вы можете отслеживать свои закрытые цели в разделе "закрытые". Вы можете удалить их в любое время',
                        [
                            {
                                text: 'OK',
                                onPress: () => {},
                            },
                        ],
                    );
                    dat.status = true;
                } else {
                    dat.status = false;
                }
                if (editsum.editsum) {
                    dat.id = editsum.index;
                    NewDat.piggyBanks[editsum.index] = dat;
                } else {
                    dat.id =
                        NewDat.piggyBanks.length > 0
                            ? NewDat.piggyBanks[NewDat.piggyBanks.length - 1].id + 1
                            : 0;
                    NewDat.piggyBanks.push(curData);
                }
                await setData({ fileName: 'PiggyBank', data: NewDat });
                setText(['', '', ' ']);
                setState(NewDat);
                setCounter(counter + 1);
                setVisible(false);
            }
        }
    };

    const del = async (index: number) => {
        let newDat: piggyBank = JSON.parse(JSON.stringify(state));
        newDat.piggyBanks.splice(index, 1);
        await setData({ fileName: 'PiggyBank', data: newDat });
        setState(newDat);
    };

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <ModalWindowOneButton
                functionCancelButton={() => {
                    setText(['', '']);
                    setEditing({ editing: false, index: 0 });
                }}
                functionSaveButton={() => {
                    click(), setVisible(false);
                }}
                visible={visible}
                setVisible={setVisible}
                windowName={
                    editing.editing
                        ? `Редактирование цели "${state.piggyBanks[editing.index].name}"`
                        : 'Добавить новую цель'
                }
            >
                <Input
                    textName='Название'
                    value={text[0].toString()}
                    setItems={setText}
                    index={0}
                    placeholder='Введите название долга'
                    keyboardType='default'
                    colorActiveInput={activeModalButton ? '#3EA2FF' : '#FF6E6E'}
                />
                <Input
                    textName='Сумма'
                    value={text[1].toString()}
                    setItems={setText}
                    index={1}
                    placeholder='Введите сумму'
                    keyboardType='numeric'
                    colorActiveInput={activeModalButton ? '#3EA2FF' : '#FF6E6E'}
                />
            </ModalWindowOneButton>
            <ModalWindowOneButton
                functionCancelButton={() => {
                    setText(['', '', ' ']);
                    setEditsum({ editsum: false, index: 0 });
                }}
                functionSaveButton={() => {
                    clicksum(), setSVisible(false);
                }}
                visible={svisible}
                setVisible={setSVisible}
                windowName='Редактирование суммы'
            >
                <Input
                    textName='Текущая сумма'
                    value={text[2].toString()}
                    setItems={setText}
                    index={2}
                    placeholder='Введите сумму'
                    keyboardType='default'
                    colorActiveInput={activeModalButton ? '#3EA2FF' : '#FF6E6E'}
                />
            </ModalWindowOneButton>
            <Header
                name='PyggyBank'
                style='1'
                functionLeft={() => {}}
                functionRight={() => {
                    setVisible(true);
                    setActiveModalButton(true);
                }}
            />
            <Scroll>
                <Container>
                    <ButtonTypeView>
                        <ButtonType
                            onPress={() => setActive(false)}
                            style={
                                !active ? { borderColor: '#3FDEAE' } : { borderColor: '#C9C9C9' }
                            }
                        >
                            <ButtonTypeText
                                style={!active ? { color: '#3FDEAE' } : { color: '#C9C9C9' }}
                            >
                                Активные
                            </ButtonTypeText>
                        </ButtonType>
                        <ButtonType
                            onPress={() => setActive(true)}
                            style={active ? { borderColor: '#3FDEAE' } : { borderColor: '#C9C9C9' }}
                        >
                            <ButtonTypeText style={{ color: active ? '#3FDEAE' : '#C9C9C9' }}>
                                Закрытые
                            </ButtonTypeText>
                        </ButtonType>
                    </ButtonTypeView>
                    {state.piggyBanks &&
                        state.piggyBanks.map((item, index) => {
                            if (
                                (active && item.status == true) ||
                                (item.status == false && !active)
                            )
                                return (
                                    <Kopilka key={index}>
                                        <KDetails>
                                            <KTitle>{item.name}</KTitle>
                                            <KMoney>
                                                {`${item.sum_cur}`}/{`${item.sum_max}`}
                                            </KMoney>
                                        </KDetails>
                                        <ProgressBar
                                            weight1={`${(+item.sum_cur / +item.sum_max) * 100}%`}
                                        />
                                        <Text style={{ textAlign: 'center', marginTop: 8 }}>
                                            До цели осталось {+item.sum_max - +item.sum_cur} средств
                                        </Text>
                                        <KDetails>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    del(index);
                                                }}
                                            >
                                                <Text>УДАЛИТЬ</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setText([
                                                        state.piggyBanks[index].name,
                                                        state.piggyBanks[index].sum_max.toString(),
                                                        state.piggyBanks[index].sum_cur.toString(),
                                                    ]);
                                                    setSVisible(true);
                                                    setEditsum({ editsum: true, index: index });
                                                }}
                                            >
                                                <Text>ДОБАВИТЬ</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setText([
                                                        state.piggyBanks[index].name,
                                                        state.piggyBanks[index].sum_max.toString(),
                                                    ]);
                                                    setVisible(true);
                                                    setEditing({ editing: true, index: index });
                                                }}
                                            >
                                                <Text>РЕДАКТИРОВАТЬ</Text>
                                            </TouchableOpacity>
                                        </KDetails>
                                    </Kopilka>
                                );
                        })}
                </Container>
            </Scroll>
        </View>
    );
}
