import { Alert, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback, SetStateAction } from 'react';
import styled from 'styled-components/native';

import Header from '../modular_components/Header';
import ModalWindowOneButton from '../modular_components/ModalWindowOneButton';
import Input from '../modular_components/Input';
import CardSwipe from '../modular_components/CardSwipe';
import InputPG from '../piggybanks/InputPG';

import { emptyPiggyBank, piggyBank, account } from '../../models/interfaces';
import {
    getData,
    setData,
    abbrNum,
    editItem,
    addItem,
    delItem,
    replaceSpace,
} from '../tools/iosys';
import { addMoney, getAccounts } from '../tools/account';
import Account from '../accounts/Account';
import DropDownPicker from 'react-native-dropdown-picker';

//Button up ///////////////////////////////
const ButtonTypeView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin: 5px;
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
    font-size: 15px;
    font-family: 'MainFont-Regular';
`;
///////////////////////////////////////////

//Cards////////////////////////////////////
const Scroll = styled.ScrollView`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const CardView = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 100%;
    height: 100%;
    width: 100%;
    padding: 2px 5%;
`;

const CardHeader = styled.View`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const CardTitle = styled.Text`
    font-family: 'MainFont-Bold';
    font-weight: 400;
    font-size: 14px;
    color: #000000;
    letter-spacing: 1px;
    text-align: center;
`;

const CardMoney = styled.Text`
    font-family: 'MainFont-Regular';
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 1px;
    text-align: center;
`;

const CardMoreInfo = styled.Text`
    font-family: 'MainFont-Regular';
    font-size: 13px;
    text-align: center;
`;
///////////////////////////////////////////

//ProgresBar///////////////////////////////
const ProgressBarView = styled.View`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 12px;
    margin: 3px 0;
    background-color: #fff;
    border: 1px solid #e0dfdf;
    border-raduis: 16px;
`;

const ProgressBarCase = styled.View`
    border-radius: 16px;
    height: 100%;
    background-color: #3ea2ff;
`;

const ProgressBarText = styled.Text`
    position: absolute;
    text-align: center;
    width: 100%;
    font-size: 11px;
`;
///////////////////////////////////////////

//PickerBlock//////////////////////////////
const PickerBlock = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 15px 15px;
    max-width: 100%;
`;

const TextName = styled.Text`
    font-family: 'MainFont-Regular';
    text-align: center;
    width: 33%;
    margin-right: 1%;
    padding-bottom: 2px;
    font-size: 15px;
`;
/////////////////////////////////////////////

function ProgressBar(props: { value: number }) {
    return (
        <ProgressBarView>
            <ProgressBarCase
                style={{
                    width: `${props.value}%`,
                }}
            ></ProgressBarCase>
            <ProgressBarText>{Math.round(props.value)}%</ProgressBarText>
        </ProgressBarView>
    );
}

export default function PiggyBank() {
    const [state, setState] = useState(emptyPiggyBank());
    const [accs, setAccs] = useState<{ label: string; value: string }[]>([]);
    const [text, setText] = useState(['', '']);
    const [sumEdit, setSumEdit] = useState('');

    const [activeButtonType, setActiveButtonType] = useState(false);

    const [modalWindow, setModalWindow] = useState(false);
    const [holdActiveInput, setHoldActiveInput] = useState(false);
    const [openPicker, setOpenPicker] = useState(false);
    const [pickerValue, setPickerValue] = useState('');

    const [editing, setEditing] = useState({ editing: false, index: -1 });
    const [editSum, setEditSum] = useState({ editSum: false, index: -1 });

    const getItems = (accounts: account['accounts']) => {
        let data: { label: string; value: string }[] = [];
        accounts.map((item) => {
            data.push({ label: `${item.name} ${item.sum}`, value: item.id.toString() });
        });
        setAccs(data);
    };

    const search = async () => {
        setAccs([]);
        setState(emptyPiggyBank());
        let data: piggyBank = await getData({ fileName: 'PiggyBank' });
        if (data === null) {
            data = emptyPiggyBank();
            await setData({ fileName: 'PiggyBank', data: data });
        }
        await getItems(await getAccounts());
        setState(JSON.parse(JSON.stringify(data)));
    };

    useFocusEffect(
        useCallback(() => {
            search();
        }, []),
    );

    const onClick = async () => {
        let data: piggyBank = JSON.parse(JSON.stringify(state));
        let newData = {
            id: 0,
            name: replaceSpace(text[0]),
            sum_max: +text[1],
            sum_cur: 0,
            status: false,
        };

        if (editing.editing) {
            newData.id = data.piggyBanks[editing.index].id;
            newData.sum_cur = data.piggyBanks[editing.index].sum_cur;
            newData.status = data.piggyBanks[editing.index].status; ///нельзя редакт закрытую
            data.piggyBanks[editing.index] = newData;
            await editItem('piggyBanks', 'PiggyBank', editing.index, newData);
        } else if (editSum.editSum) {
            newData.id = data.piggyBanks[editSum.index].id;
            let value = 0;
            if (data.piggyBanks[editSum.index].sum_cur + Number(sumEdit) === newData.sum_max) {
                newData.sum_cur = data.piggyBanks[editSum.index].sum_cur + Number(sumEdit);
                newData.status = true;
                value = Number(sumEdit);
                Alert.alert(
                    'Поздравляю!',
                    'Вы закрыли свою цель! Вы можете отслеживать свои закрытые цели в разделе "закрытые". Вы можете удалить их в любое время',
                );
            } else if (newData.sum_max < data.piggyBanks[editSum.index].sum_cur + Number(sumEdit)) {
                let ost = newData.sum_max - data.piggyBanks[editSum.index].sum_cur;

                value = Number(ost);

                newData.sum_cur = newData.sum_max;
                newData.status = true;
                setSumEdit(String(ost));
                Alert.alert(
                    'Предупреждение!',
                    'Вы ввели сумму больше оставшейся, цель закрыта, остатки возвращены на счет',
                );
            } else {
                newData.sum_cur = data.piggyBanks[editSum.index].sum_cur + Number(sumEdit);
                value = Number(sumEdit);
            }
            data.piggyBanks[editSum.index] = newData;
            await editItem('piggyBanks', 'PiggyBank', editSum.index, newData);
            let res = await addMoneyAccount(+pickerValue, value);
            if (res === 'not-found') {
                Alert.alert('Ошибка!', 'Счет не найден');
                return;
            }
            if (res === 'no-money') {
                Alert.alert('Ошибка', 'Недостаточно средств');
                return;
            }
        } else {
            if (data.piggyBanks.length !== 0) {
                newData.id = data.piggyBanks[data.piggyBanks.length - 1].id + 1;
                data.piggyBanks.push(newData);
                await addItem('piggyBanks', 'PiggyBank', newData);
            } else {
                newData.id = 1;
                data.piggyBanks = [newData];
                await addItem('piggyBanks', 'PiggyBank', newData);
            }
        }

        setState(data);
        setText(['', '']);
        setPickerValue('');
        setEditing({ editing: false, index: -1 });
        setEditSum({ editSum: false, index: -1 });
        setSumEdit('');
    };

    const tryToSave = () => {
        if (replaceSpace(text[0]) === '') {
            Alert.alert('Не верные данные!', 'Вы ввели неверное название');
            return;
        } else if (
            !replaceSpace(text[1]).match(/^\d+$/) ||
            (editSum.editSum && !replaceSpace(sumEdit).match(/^\d+$/)) ||
            Number(text[1]) === 0 ||
            (editSum.editSum && Number(sumEdit) === 0)
        ) {
            Alert.alert('Не верные данные!', 'Вы ввели неверную сумму');
            return;
        } else if (editSum.editSum && pickerValue == '') {
            Alert.alert('Не верные данные!', 'Вы не ввели счет');
            return;
        } else if (editSum.editSum && pickerValue == '') {
            Alert.alert('Не верные данные!', 'Вы не ввели счет');
            return;
        } else if (editSum.editSum && pickerValue == '') {
            Alert.alert('Не верные данные!', 'Вы не ввели счет');
            return;
        } else {
            onClick();
            setModalWindow(false);
        }
    };

    const editMode = (index: number) => {
        if (state.piggyBanks[index].status) {
            Alert.alert('Внимание!', 'Вы уже закрыли цель!');
            return;
        }
        setText([state.piggyBanks[index].name, state.piggyBanks[index].sum_max.toString()]);
        setModalWindow(true);
        setEditing({ editing: true, index: index });
    };

    const editModeSum = (index: number) => {
        if (state.piggyBanks[index].status == false) {
            if (accs.length === 0) {
                Alert.alert('Внимание!', ' Счетов нет !');
                return;
            }
        } else {
            Alert.alert('Внимание!', 'Вы уже закрыли цель!');
            return;
        }

        setText([state.piggyBanks[index].name, state.piggyBanks[index].sum_max.toString()]);
        setModalWindow(true);
        setEditSum({ editSum: true, index: index });
    };

    const delMode = async (index: number) => {
        Alert.alert('Внимание', 'Вы уверены, что хотите удалить цель?', [
            {
                text: 'Да',
                onPress: async () => {
                    let data: piggyBank = JSON.parse(JSON.stringify(state));
                    data.piggyBanks.splice(index, 1);
                    await delItem('piggyBanks', 'PiggyBank', index);
                    setState(data);
                },
            },
            {
                text: 'Нет',
                onPress: () => {},
            },
        ]);
    };

    const addMoneyAccount = async (id_accound: number, value: number) => {
        let res = await addMoney(
            +value * -1,
            state.piggyBanks[editSum.index].id,
            id_accound,
            'piggyBank',
        );
        return res;
    };

    return (
        <View style={{ height: '100%', backgroundColor: '#fff' }}>
            <ModalWindowOneButton
                windowName={editing.editing ? 'Редактирование цели' : 'Добавить новую цель'}
                functionCancelButton={() => {
                    setText(['', '']);
                    setPickerValue('');
                    setEditing({ editing: false, index: -1 });
                    setEditSum({ editSum: false, index: -1 });
                    setSumEdit('');
                }}
                functionSaveButton={() => {
                    tryToSave();
                }}
                visible={modalWindow}
                setVisible={setModalWindow}
            >
                {!editSum.editSum ? (
                    <View>
                        <Input
                            textName='Название'
                            value={text[0].toString()}
                            setItems={setText}
                            index={0}
                            placeholder='Введите название цели'
                            keyboardType='default'
                            colorActiveInput={holdActiveInput ? '#3EA2FF' : '#FF6E6E'}
                        />
                        <Input
                            textName='Сумма'
                            value={text[1].toString()}
                            setItems={setText}
                            index={1}
                            placeholder='Введите сумму'
                            keyboardType='numeric'
                            colorActiveInput={holdActiveInput ? '#3EA2FF' : '#FF6E6E'}
                        />
                    </View>
                ) : (
                    <View>
                        <InputPG
                            textName='Сумма'
                            value={sumEdit}
                            setValue={setSumEdit}
                            placeholder='Введите сумму'
                            keyboardType='numeric'
                            colorActiveInput={holdActiveInput ? '#3EA2FF' : '#FF6E6E'}
                        />
                        <PickerBlock>
                            <TextName>Счет</TextName>
                            <DropDownPicker
                                open={openPicker}
                                value={pickerValue}
                                translation={{
                                    PLACEHOLDER: 'Выберите счёт!',
                                    NOTHING_TO_SHOW: 'Нет счетов для выбора!',
                                }}
                                setOpen={setOpenPicker}
                                setValue={setPickerValue}
                                items={accs}
                                setItems={setAccs}
                                containerStyle={{
                                    width: '66%',
                                    alignSelf: 'flex-end',
                                }}
                                dropDownDirection='TOP'
                            />
                        </PickerBlock>
                    </View>
                )}
            </ModalWindowOneButton>
            <Header
                name='PiggyBank'
                style='1'
                functionLeft={() => {}}
                functionRight={() => {
                    setText(['', '']);
                    setModalWindow(true);
                    setActiveButtonType(false);
                }}
                onModalHide={async () => {
                    await search();
                }}
            />
            <ButtonTypeView>
                <ButtonType
                    onPress={() => {
                        setActiveButtonType(false);
                        setText(['', '', ' ']);
                    }}
                    style={
                        !activeButtonType
                            ? {
                                  borderColor: '#3FDEAE',
                              }
                            : {
                                  borderColor: '#C9C9C9',
                              }
                    }
                >
                    <ButtonTypeText>Активные</ButtonTypeText>
                </ButtonType>
                <ButtonType
                    onPress={() => {
                        setActiveButtonType(true);
                        setText(['', '', ' ']);
                    }}
                    style={
                        activeButtonType
                            ? {
                                  borderColor: '#3FDEAE',
                              }
                            : {
                                  borderColor: '#C9C9C9',
                              }
                    }
                >
                    <ButtonTypeText>Закрытые</ButtonTypeText>
                </ButtonType>
            </ButtonTypeView>
            <Scroll>
                {state.piggyBanks &&
                    state.piggyBanks.map((item, index) => {
                        if (
                            (activeButtonType && item.status === true) ||
                            (!activeButtonType && item.status === false)
                        )
                            return (
                                <CardSwipe
                                    key={index}
                                    onDelete={() => {
                                        delMode(index);
                                    }}
                                    onEdit={() => {
                                        editMode(index);
                                    }}
                                    onDoubleClick={async () => {
                                        await getItems(await getAccounts());
                                        editModeSum(index);
                                    }}
                                >
                                    <CardView>
                                        <CardHeader>
                                            <CardTitle>{item.name}</CardTitle>
                                            <CardMoney>
                                                {`${item.sum_cur}`}/{`${item.sum_max}`}
                                            </CardMoney>
                                        </CardHeader>
                                        <ProgressBar
                                            value={(+item.sum_cur / +item.sum_max) * 100}
                                        />
                                        <CardMoreInfo>
                                            До цели осталось
                                            <CardMoreInfo style={{ fontFamily: 'MainFont-Bold' }}>
                                                {' '}
                                                {abbrNum(+item.sum_max - +item.sum_cur)}{' '}
                                            </CardMoreInfo>
                                            средств
                                        </CardMoreInfo>
                                    </CardView>
                                </CardSwipe>
                            );
                    })}
            </Scroll>
        </View>
    );
}
