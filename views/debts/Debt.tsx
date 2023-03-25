import { Text, View, Alert, Button, TouchableOpacity } from 'react-native';
import Header from '../modular_components/Header';
import styled from 'styled-components/native';
import { useCallback, useState } from 'react';
import { account, debt, emptyAccount, emptyDebt } from '../../models/interfaces';
import { useFocusEffect } from '@react-navigation/native';
import { addItem, delItem, editItem, getData, setData } from '../tools/iosys';
import ModalWindow from '../modular_components/ModalWindow';
import Input from '../modular_components/Input';
import DropDownPicker from 'react-native-dropdown-picker';
import { addMoney, getAccounts } from '../tools/account';
import InputDate from '../calendar/additionally/InputDate';
import DateTimePicker from 'react-native-modal-datetime-picker';
import InputContact from '../modular_components/InputContact';
import * as Contacts from 'expo-contacts';
import CardSwipe from '../modular_components/CardSwipe';

const TextName = styled.Text`
    font-family: 'MainFont-Regular';
    text-align: center;
    width: 33%;
    margin-right: 1%;
    padding-bottom: 2px;
    font-size: 15px;
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
const DebtToMe = styled.TouchableOpacity`
    border-width: 1px;
    border-style: solid;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-start: 0;
    width: 48%;
    border-radius: 5px;
`;
const DebtFromMe = styled.TouchableOpacity`
    border-width: 1px;
    border-style: solid;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-start: 0;
    width: 48%;
    border-radius: 5px;
`;

const PickerBlock = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 15px 15px;
    max-width: 100%;
`;

const monthNames = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
];

export default function Debt() {
    const [state, setState] = useState(emptyDebt());
    const [debtTome, setDebt] = useState(true);
    const [text, setText] = useState(['', '', '', '', '']);
    const [visible, setVisible] = useState(false);
    const [activeModalButton, setActiveModalButton] = useState(true);
    const [items, setItems] = useState<{ label: string; value: string }[]>([]);
    const [openPicker, setOpenPicker] = useState(false);
    const [pickerValue, setPickerValue] = useState('');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedContact, setSelectedContact] = useState('');
    const [accs, setAccs] = useState(emptyAccount().accounts);
    const [editing, setEditing] = useState({ editing: false, index: 0 });

    function getItems(accounts: account['accounts']) {
        if (accounts.length > 0) {
            let data: { label: string; value: string }[] = [];
            accounts.map((item) => {
                data.push({ label: `${item.name} ${item.sum}`, value: item.id.toString() });
            });
            setItems(data);
        }
    }

    const onStart = async () => {
        setItems([]);
        setState(emptyDebt());
        let data: debt = await getData({ fileName: 'Debt' });
        if (data === null) {
            data = emptyDebt();
            await setData({ fileName: 'Debt', data: data });
        }
        setAccs(await getAccounts());
        await getItems(await getAccounts());
        data.debts.map((item) => {
            if (item.date != '') {
                const [year, month, day] = item.date.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                item.date = `${date.getDate()}  ${
                    monthNames[date.getMonth()]
                }  ${date.getFullYear()}`;
            }
        });
        setState(data);
    };

    useFocusEffect(
        useCallback(() => {
            onStart();
        }, []),
    );

    const onClick = async () => {
        let newDat: debt = JSON.parse(JSON.stringify(state));
        console.log(pickerValue);

        let dateS: string = '';
        let dateP: string = '';
        if (selectedDate == '') {
            dateS = '';
        } else {
            const [year, month, day] = text[4].split('-').map(Number);
            const date = new Date(year, month, day);
            dateS = `${year}-${month.toString().padStart(2, '0')}-${day
                .toString()
                .padStart(2, '0')}`;

            dateP = selectedDate;
        }
        let dat = {
            id: 0,
            id_account: 0,
            name: text[0],
            type: activeModalButton ? '1' : '2',
            sum: Number(text[1]),
            contact: selectedContact,
            date: dateS,
            comment: text[3],
        };
        if (editing.editing) {
            dat.id = state.debts[editing.index].id;
            dat.id_account = Number(pickerValue);
            newDat.debts[editing.index] = dat;
            await editItem('debts', 'Debt', editing.index, dat);
        } else {
            dat.id = state.debts.length > 0 ? state.debts[state.debts.length - 1].id + 1 : 0;
            newDat.debts.push(dat);
            await addItem('debts', 'Debt', dat);
        }
        newDat.debts[newDat.debts.length - 1].date = dateS != '' ? dateP : '';
        setState(newDat);
        setText(['', '', '', '', '']);
        setPickerValue('');
        setSelectedContact('');
        setSelectedDate('');
        setOpenPicker(false);
        setDebt(activeModalButton);
        setEditing({ editing: false, index: 0 });
    };

    const tryToSave = () => {
        if (text[0] == '' || text[1] == '' || pickerValue == '') {
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
        let newDat: debt = JSON.parse(JSON.stringify(state));
        newDat.debts.splice(index, 1);
        delItem('debts', 'Debt', index);
        setState(newDat);
    };

    // TODO: Сделать выбор контакта из телефонной книги...
    // Главный вопрос: так ли это нужно, может лучше оставить старый вариант?
    const selectContact = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers],
            });
            if (data.length > 0) {
                const contact = data[0];
            }
        }
    };

    const getAcc = (id_account: string | number) => {
        try {
            return accs.filter((account) => {
                return account.id == id_account;
            })[0].name;
        } catch {
            return '';
        }
    };

    const openEditModal = async (index: number) => {
        const data: debt = await getData({ fileName: 'Debt' });
        setSelectedDate(state.debts[index].date);
        setText([
            state.debts[index].name,
            `${state.debts[index].sum}`,
            state.debts[index].contact,
            state.debts[index].comment,
            data.debts[index].date,
        ]);
        setSelectedContact(state.debts[index].contact);
        setPickerValue(`${state.debts[index].id_account}`);
        setEditing({ editing: true, index: index });
        setActiveModalButton(debtTome);
        setVisible(true);
    };

    const submit = async (index: number) => {
        const item = state.debts[index];
        Alert.alert(
            'Внимание',
            'Вы уверены, что хотите закрыть долг?' +
                `Деньги поступят на счет "${getAcc(item.id_account)}"`,
            [
                {
                    text: 'Да',
                    onPress: async () => {
                        if (item.type == '2') item.sum = -item.sum;
                        const res = await addMoney(item.sum, item.id, item.id_account, 'debt');
                        if (res == 'no-money') {
                            Alert.alert('Ошибка!', 'Недостаточно средств');
                            return;
                        } else if (res == 'not-found') {
                            Alert.alert('Ошибка!', 'Счет не был найден!');
                            return;
                        }
                        await delItem('debts', 'Debt', index);
                        const newDebt: debt = JSON.parse(JSON.stringify(state));
                        newDebt.debts.splice(index, 1);
                        setState(newDebt);
                        Alert.alert('Долг был успешно закрыт!');
                        await getItems(await getAccounts());
                    },
                },
                {
                    text: 'Нет',
                    onPress: () => {},
                },
            ],
        );
    };

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <ModalWindow
                visible={visible}
                setVisible={setVisible}
                buttonTextLeft='Должны мне'
                buttonTextRight='Должен я'
                activeModalButton={activeModalButton}
                setActiveModalButton={setActiveModalButton}
                colorActiveLeft='#3FDEAE'
                colorActiveRight='#3FDEAE'
                functionCancelButton={() => {
                    setText(['', '', '', '']);
                    setSelectedContact('');
                    setSelectedDate('');
                    setPickerValue('');
                }}
                functionSaveButton={tryToSave}
            >
                <Input
                    textName='Название'
                    value={text[0].toString()}
                    setItems={setText}
                    index={0}
                    placeholder='Введите название долга'
                    keyboardType='default'
                    colorActiveInput='#3FDEAE'
                />
                <Input
                    textName='Сумма'
                    value={text[1].toString()}
                    setItems={setText}
                    index={1}
                    placeholder='Введите сумму долга'
                    keyboardType='numeric'
                    colorActiveInput='#3FDEAE'
                />
                <InputDate
                    functionDate={() => {
                        setDatePickerVisible(true);
                    }}
                    textName='Крайняя дата'
                    value={selectedDate.toString()}
                    setValue={() => {
                        setSelectedDate;
                    }}
                    placeholder='Введите дату'
                    keyboardType='default'
                    colorActiveInput='##3FDEAE'
                />
                <InputContact
                    textName='Контакт'
                    functionConctact={selectContact}
                    value={selectedContact}
                    setValue={setSelectedContact}
                    placeholder='Введите контакт для связи (не обязательно)'
                    keyboardType='phone-pad'
                    colorActiveInput='#3FDEAE'
                />
                <Input
                    textName='Комментарий'
                    value={text[3].toString()}
                    setItems={setText}
                    index={3}
                    placeholder='Введите комментарий к долгу (не обязательно)'
                    keyboardType='default'
                    colorActiveInput='#3FDEAE'
                />
                <PickerBlock>
                    <TextName>Счёт</TextName>
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
                {isDatePickerVisible && (
                    <DateTimePicker
                        style={{ flex: 1, position: 'relative' }}
                        isVisible={isDatePickerVisible}
                        mode='date'
                        onConfirm={(date: Date) => {
                            setSelectedDate(
                                `${date.getDate()} ${
                                    monthNames[date.getMonth()]
                                } ${date.getFullYear()}`,
                            );
                            const newText = [...text];
                            newText[4] = `${date.getFullYear()}-${(date.getMonth() + 1)
                                .toString()
                                .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                            setText(newText);
                            setDatePickerVisible(false);
                        }}
                        onCancel={() => {
                            setDatePickerVisible(false);
                        }}
                    />
                )}
            </ModalWindow>
            <Header
                name='Debt'
                style='1'
                functionLeft={() => {}}
                functionRight={() => {
                    if (items.length > 0) {
                    setVisible(true);
                    setActiveModalButton(debtTome);
                    } else {
                        Alert.alert(
                            'Внимание!',
                            'Вы пробуете создать долг, не создав предварительно счёт!',
                        );
                    }
                }}
                onModalHide={async () => {
                    onStart();
                }}
            />
            <View
                style={{
                    margin: 5,
                    flex: 1,
                    flexDirection: 'row',
                    marginBottom: 40,
                    justifyContent: 'space-around',
                }}
            >
                <DebtToMe
                    onPress={() => {
                        setDebt(true);
                    }}
                    style={{ borderColor: debtTome ? '#3FDEAE' : '#C9C9C9' }}
                >
                    <Text
                        style={{
                            color: debtTome ? '#3FDEAE' : '#C9C9C9',
                            fontSize: 15,
                            fontFamily: 'MainFont-Regular',
                        }}
                    >
                        Должны мне
                    </Text>
                </DebtToMe>
                <DebtFromMe
                    onPress={() => {
                        setDebt(false);
                    }}
                    style={{ borderColor: !debtTome ? '#3FDEAE' : '#C9C9C9' }}
                >
                    <Text
                        style={{
                            color: !debtTome ? '#3FDEAE' : '#C9C9C9',
                            fontSize: 15,
                            fontFamily: 'MainFont-Regular',
                        }}
                    >
                        Должен я
                    </Text>
                </DebtFromMe>
            </View>
            <Scroll>
                <Container>
                    {state.debts &&
                        state.debts.map((item, index) => {
                            {
                                if (
                                    (debtTome && item.type == '1') ||
                                    (item.type == '2' && !debtTome)
                                )
                                    return (
                                        <CardSwipe
                                            key={index}
                                            onDelete={() => {
                                                del(index);
                                            }}
                                            onEdit={() => {
                                                openEditModal(index);
                                            }}
                                            onDoubleClick={() => {
                                                console.log('Aboba');
                                            }}
                                        >
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() => {
                                                    submit(index);
                                                }}
                                                style={{ width: '100%' }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'column',
                                                        padding: 10,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            justifyContent: 'space-between',
                                                            flexDirection: 'row',
                                                        }}
                                                    >
                                                        <Text>{item.name}</Text>
                                                        <Text>{item.date}</Text>
                                                        <Text>{getAcc(item.id_account)}</Text>
                                                        <Text>{`${item.sum}`} руб.</Text>
                                                    </View>
                                                    <Text>{item.contact}</Text>
                                                    <Text>{item.comment}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </CardSwipe>
                                    );
                            }
                        })}
                </Container>
            </Scroll>
        </View>
    );
}
