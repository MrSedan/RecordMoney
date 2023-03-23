import { Alert, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import Header from '../modular_components/Header';
import { emptyPiggyBank, piggyBank, emptyAccount, account } from '../../models/interfaces';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getData, setData } from '../tools/iosys';
import ModalWindowOneButton from '../modular_components/ModalWindowOneButton';
import Input from '../modular_components/Input';
import CardSwipe from '../modular_components/CardSwipe';
import DropDownPicker from 'react-native-dropdown-picker';
import { addMoney, getAccounts } from '../tools/account';

const Scroll = styled.ScrollView`
    heigth: 100%;
`;

const ButtonType = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 47%;
    border-radius: 5px;
    border: 1px solid #c6c3c3;
`;

const ButtonTypeText = styled.Text`
    font-size: 19px;
    font-family: 'MainFont-Bold';
`;

const ButtonTypeView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin: 5px 1px 0px 1px;
    max-width: 100%;
`;

const KTitle = styled.Text`
    font-family: 'MainFont-Bold';
    font-weight: 400;
    font-size: 15px;
    color: #000000;
    letter-spacing: 1px;
`;

const KMoney = styled.Text`
    font-family: 'MainFont-Bold';
    font-weight: 400;
    font-size: 15px;
    letter-spacing: 1px;
    color: #000000;
`;

const Kopilka = styled.View`
    flex: 1;
    background: #ffffff;
    border: 1px solid #cecccc;
    box-shadow: 0px 2px 48px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    flex-direction: column;
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
    margin: 8px 20px 0 20px;
`;

const FullBar = styled.View`
    width: 90%;
    margin: 0 auto;
    border-radius: 16px;
    align-items: flex-start;
    justify-content: center;
    height: 10px;
    background-color: #7d85fd;
`;

const PickerBlock = styled.View`
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 20px;
    flex-direction: row;
    margin-bottom: 20px;
`;

const Content = styled.View`
    border-radius: 16px;
    height: 10px;
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
    const [editing, setEditing] = useState({ editing: false, index: 0 });
    const [editsum, setEditsum] = useState({ editsum: false, index: 0 });
    const [svisible, setSVisible] = useState(false);
    const [openPicker, setOpenPicker] = useState(false);
    const [pickerValue, setPickerValue] = useState('');
    const [items, setItems] = useState<{ label: string; value: string }[]>([]);

    function getItems(accounts: account['accounts']) {
        let data: { label: string; value: string }[] = [];
        accounts.map((item) => {
            data.push({ label: `${item.name}     ${item.sum} руб.`, value: item.id.toString() });
        });
        setItems(data);
    }

    const curData = {
        id: 1,
        id_account: +pickerValue,
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

    const addMoneyAccount = async (value: number, id_operat: number) => {
        let dat = curData;
        dat.id_account = +pickerValue;
        let res = '';
        res = await addMoney(value, id_operat, dat.id_account, 'piggyBank');
        if (res === 'not-found') Alert.alert('Ошибка!', 'Счет не найден');
        if (res === 'no-money') Alert.alert('Ошибка', 'Недостаточно средств');
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
                await getItems(await getAccounts());
            };
            search();
        }, []),
    );

    const click = async () => {
        if (text[0] == '' || text[1] == '') {
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
            dat.id_account = +pickerValue;
            dat.sum_max = +text[1];
            dat.sum_cur = +text[2];
            dat.status = false;
            if (editing.editing) {
                dat.id = editing.index;
                NewDat.piggyBanks[editing.index] = dat;
                dat.id_account = Number(pickerValue);
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
            setPickerValue('');
        }
    };

    const clicksum = async () => {
        if (!text[2].match(/^\d+$/)) {
            Alert.alert('Не верные данных!', 'Вы ввели неверную сумму');
            return;
        } else {
            if (pickerValue == '') {
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
                dat.id_account = +pickerValue;
                dat.sum_max = +text[1];
                dat.sum_cur = +(state.piggyBanks[editsum.index].sum_cur + +text[2]);
                let res = dat.sum_max - dat.sum_cur;
                console.log('ААААААААААААААААААААААААААААААААААААА');
                console.log(res);
                if (dat.sum_cur > dat.sum_max) {
                    Alert.alert(
                        'Предупреждение!',
                        'Вы ввели сумму больше оставшейся, цель закрыта, остатки возвращены на счет',
                        [
                            {
                                text: 'OK',
                                onPress: () => {},
                            },
                        ],
                    );
                    let itog = +text[2] - -res;
                    console.log('ААААААААААААААААААААААААААААААААААААА');
                    console.log(itog);
                    addMoneyAccount(-itog, editsum.index);
                    dat.sum_cur = dat.sum_max;
                    dat.status = true;
                    editsum.editsum = false;
                    dat.id = editsum.index;
                    NewDat.piggyBanks[editsum.index] = dat;
                    setSVisible(false);
                    await setData({ fileName: 'PiggyBank', data: NewDat });
                    setText(['', '', ' ']);
                    setState(NewDat);
                    setCounter(counter + 1);
                    setPickerValue('');
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
                        addMoneyAccount(-+text[2], editsum.index);
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
                    setPickerValue('');
                }
            }
        }
    };

    const del = async (index: number) => {
        Alert.alert('Внимание', 'Вы уверены, что хотите удалить цель?', [
            {
                text: 'Да',
                onPress: async () => {
                    let newDat: piggyBank = JSON.parse(JSON.stringify(state));
                    newDat.piggyBanks.splice(index, 1);
                    await setData({ fileName: 'PiggyBank', data: newDat });
                    setState(newDat);
                    Alert.alert('Цель успешно удалена!');
                },
            },
            {
                text: 'Нет',
                onPress: () => {},
            },
        ]);
    };

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <ModalWindowOneButton
                functionCancelButton={() => {
                    setText(['', '', ' ']);
                    setEditing({ editing: false, index: 0 });
                    setPickerValue('');
                }}
                functionSaveButton={() => {
                    click(), setVisible(false);
                }}
                visible={visible}
                setVisible={setVisible}
                windowName={editing.editing ? `Редактирование цели ` : 'Добавить новую цель'}
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
                    keyboardType='numeric'
                    colorActiveInput={activeModalButton ? '#3EA2FF' : '#FF6E6E'}
                />
                <PickerBlock>
                    <Text
                        style={{
                            fontSize: 15,
                            textAlign: 'center',
                            width: 'auto',
                            marginLeft: 55,
                            textAlignVertical: 'center',
                            fontFamily: 'MainFont-Regular',
                        }}
                    >
                        Счёт
                    </Text>
                    <DropDownPicker
                        open={openPicker}
                        value={pickerValue}
                        translation={{
                            PLACEHOLDER: 'Выберите счёт!',
                            NOTHING_TO_SHOW: 'Нет счетов для выбора!',
                        }}
                        setOpen={setOpenPicker}
                        setValue={setPickerValue}
                        items={items}
                        setItems={setItems}
                        containerStyle={{ width: '66%', alignSelf: 'flex-end' }}
                        dropDownDirection='TOP'
                    />
                </PickerBlock>
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
                                    <CardSwipe
                                        key={index}
                                        onDelete={() => {
                                            del(index);
                                        }}
                                        onEdit={() => {
                                            setText([
                                                state.piggyBanks[index].name,
                                                state.piggyBanks[index].sum_max.toString(),
                                                state.piggyBanks[index].sum_cur.toString(),
                                            ]);
                                            setVisible(true);
                                            setEditing({ editing: true, index: index });
                                            setPickerValue(`${state.piggyBanks[index].id_account}`);
                                        }}
                                        onDoubleClick={() => {
                                            setText([
                                                state.piggyBanks[index].name,
                                                state.piggyBanks[index].sum_max.toString(),
                                                state.piggyBanks[index].sum_cur.toString(),
                                            ]);
                                            setSVisible(true);
                                            setEditsum({ editsum: true, index: index });
                                            setPickerValue(`${state.piggyBanks[index].id_account}`);
                                        }}
                                    >
                                        <Kopilka>
                                            <KDetails>
                                                <KTitle>{item.name}</KTitle>
                                                <KMoney>
                                                    {`${item.sum_cur}`}/{`${item.sum_max}`}
                                                </KMoney>
                                            </KDetails>
                                            <ProgressBar
                                                weight1={`${
                                                    (+item.sum_cur / +item.sum_max) * 100
                                                }%`}
                                            />
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    marginTop: 8,
                                                    marginBottom: -30,
                                                    fontFamily: 'MainFont-Regular',
                                                }}
                                            >
                                                До цели осталось{' '}
                                                <Text style={{ fontFamily: 'MainFont-Bold' }}>
                                                    {+item.sum_max - +item.sum_cur}
                                                </Text>{' '}
                                                средств
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setText([
                                                        state.piggyBanks[index].name,
                                                        state.piggyBanks[index].sum_max.toString(),
                                                        state.piggyBanks[index].sum_cur.toString(),
                                                    ]);
                                                    setSVisible(true);
                                                    setEditsum({ editsum: true, index: index });
                                                    setPickerValue(
                                                        `${state.piggyBanks[index].id_account}`,
                                                    );
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'MainFont-Bold',
                                                        fontSize: 30,
                                                        textAlign: 'right',
                                                        marginRight: 10,
                                                        marginTop: 3,
                                                    }}
                                                >
                                                    +
                                                </Text>
                                            </TouchableOpacity>
                                        </Kopilka>
                                    </CardSwipe>
                                );
                        })}
                </Container>
            </Scroll>
        </View>
    );
}
