import { Alert, ScrollView, View, Text, Modal, Button } from 'react-native';
import { useCallback, useState } from 'react';
import { account, calendar, emptyCalendar } from '../../models/interfaces';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { LocaleConfig, Calendar as Cal } from 'react-native-calendars';
import { getData, setData, addItem, delItem, editItem } from '../tools/iosys';
import DropDownPicker from 'react-native-dropdown-picker';
import { getAccounts, addMoney } from '../tools/account';

import styled from 'styled-components/native';
import Header from '../modular_components/Header';
import CardSwipe from '../modular_components/CardSwipe';
import Input from '../modular_components/Input';
import InputDate from './additionally/InputDate';
import ModalWindow from '../modular_components/ModalWindow';
import DateTimePicker from 'react-native-modal-datetime-picker';

interface DataType {
    cards: {
        comment: string;
        date: string;
        id: number;
        id_account: number;
        name: string;
        type: string;
    }[];
}

interface DatasType {
    [key: string]: {
        dots: {
            key: string;
            color: string;
        }[];
    };
}

function emptyDatasType(): DatasType {
    let datas: DatasType = { key: { dots: [] } };
    return datas;
}

function reformat(item: DataType) {
    let datas: DatasType = {};
    for (let index = 0; index < item.cards.length; index++) {
        const itemType =
            item.cards[index].type == '1'
                ? { key: `${item.cards[index].id}`, color: '#3EA2FF' }
                : { key: `${item.cards[index].id}`, color: '#FF6E6E' };
        datas[item.cards[index].date] == null
            ? (datas[item.cards[index].date] = { dots: [itemType] })
            : datas[item.cards[index].date].dots.push(itemType);
    }

    return datas;
}

function PeopleDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);
    const normalDate = new Date(year, month - 1, day);
    return `${normalDate.getDate()}  ${
        monthNames[normalDate.getMonth()]
    }  ${normalDate.getFullYear()}`;
}

const CardView = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    max-width: 100%;
    height: 100%;
    width: 100%;
    border-width: 1px;
    border-radius: 10px;
`;

const HeaderCardView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
`;

const CardText = styled.Text`
    text-align: center;
    font-size: 14px;
    font-weight: 400;
`;

const PickerBlock = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 15px 15px;
    max-width: 100%;
`;

const TextName = styled.Text`
    text-align: center;
    width: 33%;
    margin-right: 1%;
    padding-bottom: 2px;
    font-size: 15px;
`;

const ModalInfo = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    background-color: #fff;
    width: 70%;
    height: 50%;
    // border: 1px solid #000;
    margin: 15%;
    border-radius: 10px;
    padding: 20px;
`;

const AlertTitle = styled.Text`
    text-align: center;
    width: 100%;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 5%;
`;

const AlertInView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 80%;
`;

const AlertMessage = styled.Text`
    font-size: 15px;
    margin-bottom: 10px;
`;

const AlertButton = styled.Text`
    color: #000;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 2% 15%;
    background-color: rgba(0, 0, 0, 0.1);
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
const path = 'Calendar';

export default function Calendar() {
    const [state, setState] = useState(emptyCalendar()); // файлы
    const [counter, setCounter] = useState(emptyDatasType()); // даты для календаря
    const [winInfo, setWinInfo] = useState(false); // окно доп инфы
    const [visible, setVisible] = useState(false); // видимость окна
    const [editing, setEditing] = useState({ edit: false, index: 0 });
    const [activeModalButton, setActiveModalButton] = useState(true); // тип операции
    const [text, setText] = useState(['', '', '', '']); // данные для ввода
    const [isDatePickerVisible, setDatePickerVisible] = useState(false); // видимость модального календаря
    const [selectedDate, setSelectedDate] = useState(''); // передача даты в инпут (с буквенным месяцем)
    const [cardDate, setCardDate] = useState(''); // дата для карточки
    const [openPicker, setOpenPicker] = useState(false); // поле со списком
    const [pickerValue, setPickerValue] = useState(''); // выбранный счет
    const [items, setItems] = useState<{ label: string; value: string }[]>([]); // все счета для поля
    const [idCard, setIdCard] = useState(-1);

    function getItems(accounts: account['accounts']) {
        let data: { label: string; value: string }[] = [];
        accounts.map((item) => {
            data.push({ label: `${item.name}     ${item.sum} руб.`, value: item.id.toString() });
        });
        setItems(data);
    }

    useFocusEffect(
        useCallback(() => {
            const search = async () => {
                let data: calendar = await getData({ fileName: path });
                if (data === null) {
                    data = emptyCalendar();
                    await setData({ fileName: path, data: data });
                }
                await getItems(await getAccounts());
                setState(JSON.parse(JSON.stringify(data)));
                setCounter(JSON.parse(JSON.stringify(reformat(data))));
            };
            search();
        }, []),
    );

    const onClick = async () => {
        let newData: calendar = JSON.parse(JSON.stringify(state));
        let data = {
            id: 0,
            id_account: +pickerValue,
            name: text[0],
            date: text[1],
            sum: +text[2],
            type: activeModalButton ? '1' : '2',
            comment: text[3],
        };

        if (editing.edit) {
            data.id = newData.cards[editing.index].id;
            newData.cards[editing.index] = data;
        } else {
            if (newData.cards.length !== 0) {
                data.id = newData.cards[newData.cards.length - 1].id + 1;
                newData.cards.push(data);
            } else {
                data.id = 1;
                newData.cards = [data];
            }
        }

        editing.edit
            ? editItem('cards', path, editing.index, data)
            : await addItem('cards', path, data);
        setSelectedDate('');
        setPickerValue('');
        setText(['', '', '', '']);
        setState(newData);
        setCounter(JSON.parse(JSON.stringify(reformat(newData))));
        setEditing({ edit: false, index: 0 });
    };

    const tryToSave = () => {
        if (!text[2].match(/^\d+$/)) {
            Alert.alert('Не верные данных!', 'Вы ввели неверную сумму');
            return;
        } else if (pickerValue == '') {
            Alert.alert('Не верные данных!', 'Вы не ввели счет');
        } else if (text[1] == '') {
            Alert.alert('Не верные данных!', 'Вы не ввели дату');
        } else {
            onClick();
            setVisible(false);
        }
    };

    const editModal = (index: number) => {
        setText([
            state.cards[index].name,
            state.cards[index].date,
            state.cards[index].sum.toString(),
            state.cards[index].comment,
        ]);
        setVisible(true);
        setEditing({ edit: true, index: index });
    };

    const deleteCard = async (index: number) => {
        let data: calendar = JSON.parse(JSON.stringify(state));
        data.cards.splice(index, 1);
        await delItem('cards', path, index);
        setState(data);
        setCounter(JSON.parse(JSON.stringify(reformat(data))));
    };

    const addMoneyAccount = async (value: number, type: string, id_acc: number) => {
        let res = '';
        type === '1'
            ? (res = await addMoney(value, id_acc))
            : (res = await addMoney(value * -1, id_acc));

        if (res === 'not-found') Alert.alert('Ошибка!', 'Счет не найден');
        if (res === 'no-money') Alert.alert('Ошибка', 'Недостаточно средств');
        setIdCard(-1);
        setWinInfo(false);
    };

    LocaleConfig.locales['ru'] = {
        monthNames: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
        ],
        monthNamesShort: [
            'Янв',
            'Февр',
            'Март',
            'Апр',
            'Май',
            'Июн',
            'Июл',
            'Авг',
            'Сен',
            'Окт',
            'Ноя',
            'Дек',
        ],
        dayNames: ['Воскресенье', 'Понельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        today: 'Сегодня',
    };

    LocaleConfig.defaultLocale = 'ru';

    const dateConfirm = (date: Date) => {
        const dates = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        setText((prevState) => {
            const newText = [...prevState];
            newText[1] = dates;
            return newText;
        });
        setSelectedDate(`${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`);
        setDatePickerVisible(false);
    };

    return (
        <View
            style={{
                backgroundColor: '#FFF',
                height: '100%',
            }}
        >
            <ModalWindow
                functionCancelButton={() => {
                    setText(['', '', '', '']);
                    setSelectedDate('');
                }}
                functionSaveButton={() => {
                    tryToSave();
                }}
                visible={visible}
                setVisible={setVisible}
                buttonTextLeft='Доход'
                buttonTextRight='Платеж'
                activeModalButton={activeModalButton}
                setActiveModalButton={setActiveModalButton}
                colorActiveLeft='#3EA2FF'
                colorActiveRight='#FF6E6E'
            >
                <Input
                    textName='Название'
                    value={text[0].toString()}
                    setItems={setText}
                    index={0}
                    placeholder='Введите название операции'
                    keyboardType='default'
                    colorActiveInput={activeModalButton ? '#3EA2FF' : '#FF6E6E'}
                />
                <InputDate
                    functionDate={() => {
                        setDatePickerVisible(true);
                    }}
                    textName='Дата'
                    value={selectedDate.toString()}
                    setValue={() => {
                        setSelectedDate;
                    }}
                    placeholder='Введите дату'
                    keyboardType='default'
                    colorActiveInput={activeModalButton ? '#3EA2FF' : '#FF6E6E'}
                />
                <Input
                    textName='Сумма'
                    value={text[2].toString()}
                    setItems={setText}
                    index={2}
                    placeholder='Введите сумму'
                    keyboardType='numeric'
                    colorActiveInput={activeModalButton ? '#3EA2FF' : '#FF6E6E'}
                />
                <Input
                    textName='Комментарий'
                    value={text[3].toString()}
                    setItems={setText}
                    index={3}
                    placeholder='Введите комментарий'
                    keyboardType='default'
                    colorActiveInput={activeModalButton ? '#3EA2FF' : '#FF6E6E'}
                />
                <PickerBlock>
                    <TextName>Счёт</TextName>
                    <DropDownPicker
                        open={openPicker}
                        value={pickerValue}
                        setOpen={setOpenPicker}
                        setValue={setPickerValue}
                        items={items}
                        setItems={setItems}
                        containerStyle={{ width: '66%', alignSelf: 'flex-end' }}
                        placeholder='Выберите счёт'
                        dropDownDirection='TOP'
                    />
                </PickerBlock>
                {isDatePickerVisible && (
                    <DateTimePicker
                        style={{ flex: 1, position: 'relative' }}
                        isVisible={isDatePickerVisible}
                        mode='date'
                        onConfirm={dateConfirm}
                        onCancel={() => {
                            setDatePickerVisible(false);
                        }}
                    />
                )}
            </ModalWindow>
            <Modal
                animationType='fade'
                transparent={true}
                visible={winInfo}
                onRequestClose={() => {
                    setIdCard(-1);
                    setWinInfo(false);
                }}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                    <ModalInfo>
                        <AlertTitle>Дополнительная информация</AlertTitle>
                        <AlertInView>
                            <AlertMessage style={{ textDecorationLine: 'underline' }}>
                                Тип операции:
                            </AlertMessage>
                            <AlertMessage>
                                {idCard !== -1
                                    ? state.cards[0].type === '1'
                                        ? 'Доход'
                                        : 'Платеж'
                                    : ''}
                            </AlertMessage>
                        </AlertInView>
                        <AlertInView>
                            <AlertMessage style={{ textDecorationLine: 'underline' }}>
                                Название:
                            </AlertMessage>
                            <AlertMessage>
                                {idCard !== -1 ? state.cards[idCard].name : ''}
                            </AlertMessage>
                        </AlertInView>
                        <AlertInView>
                            <AlertMessage style={{ textDecorationLine: 'underline' }}>
                                Дата:
                            </AlertMessage>
                            <AlertMessage>
                                {idCard !== -1 ? PeopleDate(state.cards[idCard].date) : ''}
                            </AlertMessage>
                        </AlertInView>
                        <AlertInView>
                            <AlertMessage style={{ textDecorationLine: 'underline' }}>
                                Сумма:
                            </AlertMessage>
                            <AlertMessage>
                                {idCard !== -1 ? state.cards[idCard].sum : ''} руб.
                            </AlertMessage>
                        </AlertInView>
                        <AlertInView>
                            <AlertMessage style={{ textDecorationLine: 'underline' }}>
                                Комментарий:
                            </AlertMessage>
                            <AlertMessage>
                                {idCard !== -1 ? state.cards[idCard].comment : ''}
                            </AlertMessage>
                        </AlertInView>
                        <AlertButton
                            onPress={() => {
                                setIdCard(-1);
                                setWinInfo(false);
                            }}
                        >
                            Ok
                        </AlertButton>
                        <AlertButton
                            onPress={() => {
                                addMoneyAccount(
                                    state.cards[idCard].sum,
                                    state.cards[idCard].type,
                                    state.cards[idCard].id_account,
                                );
                            }}
                        >
                            Провести операцию
                        </AlertButton>
                    </ModalInfo>
                </View>
            </Modal>
            <Header
                name='Calendar'
                style='1'
                functionLeft={() => {}}
                functionRight={() => {
                    setVisible(true);
                    setActiveModalButton(true);
                }}
            />
            <View>
                <Cal
                    markingType={'multi-dot'}
                    markedDates={counter}
                    // Initially visible month. Default = now
                    backgroundColor={'#fff'}
                    // Минимальный день (не будет серым)
                    minDate={'2022-01-01'}
                    // Максимальный день (не будет серым)
                    maxDate={'2026-01-01'}
                    // действия при клике на дату
                    onDayPress={(day) => {
                        setCardDate(
                            `${day.year}-${day.month.toString().padStart(2, '0')}-${day.day
                                .toString()
                                .padStart(2, '0')}`,
                        );
                    }}
                    // Действие при долгом нажатии на дату
                    onDayLongPress={(day) => {}}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    monthFormat={monthNames[+'MM']}
                    // Можно отловить на каком месяце находится юзер
                    onMonthChange={(month) => {
                        console.log('month changed', month);
                    }}
                    // Hide month navigation arrows. Default = false
                    hideArrows={true}
                    // Do not show days of other months in month page. Default = false
                    hideExtraDays={false}
                    // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
                    // day from another month that is visible in calendar page. Default = false
                    disableMonthChange={true}
                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                    firstDay={1}
                    // Hide day names. Default = false
                    hideDayNames={false}
                    // Show week numbers to the left. Default = false
                    showWeekNumbers={false}
                    // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                    onPressArrowLeft={(subtractMonth) => subtractMonth()}
                    // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                    onPressArrowRight={(addMonth) => addMonth()}
                    // Disable left arrow. Default = false
                    disableArrowLeft={true}
                    // Disable right arrow. Default = false
                    disableArrowRight={true}
                    // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                    disableAllTouchEventsForDisabledDays={true}
                    // Enable the option to swipe between months. Default = false
                    enableSwipeMonths={true}
                />
            </View>

            <ScrollView>
                {state.cards &&
                    state.cards.map((item, index) => {
                        {
                            if (item.date == cardDate) {
                                const type = item.type === '1' ? true : false;

                                return (
                                    <CardSwipe
                                        key={index}
                                        onDelete={() => {
                                            deleteCard(index);
                                        }}
                                        onEdit={() => {
                                            editModal(index);
                                        }}
                                        onDoubleClick={() => {
                                            setIdCard(index);
                                            setWinInfo(true);
                                        }}
                                    >
                                        <CardView
                                            style={
                                                type
                                                    ? { borderColor: '#3EA2FF' }
                                                    : { borderColor: '#FF6E6E' }
                                            }
                                        >
                                            <CardText>
                                                {item.type === '1' ? 'Доход' : 'Платеж'}
                                            </CardText>

                                            <HeaderCardView>
                                                {/* <CardText>{`${date.getDate()}  ${
                                                    monthNames[date.getMonth()]
                                                }  ${date.getFullYear()}`}</CardText> */}
                                                <CardText>{item.name}</CardText>
                                                <CardText>{item.sum} руб</CardText>
                                            </HeaderCardView>
                                        </CardView>
                                    </CardSwipe>
                                );
                            }
                        }
                    })}
            </ScrollView>
        </View>
    );
}
