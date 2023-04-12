import {
    Text,
    View,
    StyleSheet,
    FlatList,
    useWindowDimensions,
    Image,
    Animated,
    ScrollView,
    Button,
    Modal,
    TouchableOpacity,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import DonutChart from './CustomDonutChart';
import Header from '../modular_components/Header';
import styled from 'styled-components/native';
import BackArrowSvg from '../../assets/icon/BackArrow.svg';
import PlusSvg from '../../assets/icon/plus.svg';
// import Item from './Item';
import React, { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    account,
    category,
    emptyCategories,
    emptyHistory,
    history,
    emptyAccount,
} from '../../models/interfaces';
import Input from '../modular_components/Input';
import ModalWindow from '../modular_components/ModalWindow';
import ModalWindowHistory from './ModalWindowHistory';
import Circle from './smallCircle';
import InputDate from '../calendar/additionally/InputDate';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { getCategory } from './category';
import ModalWindowOneButton from '../modular_components/ModalWindowOneButton';
import { addMoney, getAccounts } from '../tools/account';
import {
    getData,
    setData,
    addItem,
    delItem,
    editItem,
    borderBillionMillionThousand,
    replaceSpace,
} from '../tools/iosys';
import CardWithButtons from '../modular_components/CardWithButtons';
import { PeopleDate } from '../calendar/Calendar';

const Container = styled.View`
    height: 100%;
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-start;
`;

const RashodME = styled.TouchableOpacity`
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

const DohodME = styled.TouchableOpacity`
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

const ButtonHeader = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    background-color: #fdfdfd;
    border-radius: 100px;
    border: 1px solid #aba5a5;
`;

const HeaderViewModal = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 10px 20px 2%;
    max-width: 100%;
`;

const Scroll = styled.ScrollView`
    height: 95%;
    margin-bottom: 5%;
`;

const PickerBlock = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 15px 15px;
    max-width: 100%;
`;
const HeaderText = styled.Text`
    font-family: 'MainFont-Regular';
    font-size: 20px;
    margin-left: 17px;
`;

const CardView = styled.View`
    display: flex;
    flex-direction: row;
`;

const styles = StyleSheet.create({
    image: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    TextInDiagramsfirst: {
        fontSize: 25,
        color: '#7D8895',
        fontWeight: '400',
        textAlign: 'center',
    },
    TextInDiagramsSecond: {
        fontSize: 40,
        color: '#000000',
        textAlign: 'center',
    },
    ViewInDiagrams: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '50%',
        position: 'absolute',
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
        height: '50%',
    },
    colorBlock: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 10,
    },
});

////////////////////////////////

//Circle//////////////////////////////
const CircleContainerBox = styled.View`
    height: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const CircleContainer = styled.View`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
`;

const ButtonView = styled.View`
    display: flex;
    flex-direction: row;
    width: 85%;
    justify-content: space-between;
`;
////////////////////////////////

//FlatList//////////////////////////////
const FlatlistView = styled.ScrollView`
    width: 100%;
    height: 40%;
    margin: 0 0 25% 0;
`;

const FlatListViewIn = styled.View`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const Item = styled.View`
    margin: 4%;
    display: flex;
    flex-direction: column;
    padding: 3%;
    width: 41%;
    height: 90px;
    background-color: #fafafa;
    border-radius: 15px;
    justify-content: space-evenly;
`;

const CircleCard = styled.View`
    width: 15px;
    height: 15px;
    border-radius: 7.5px;
`;

const CardHeader = styled.View`
    width: 90%;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const CardTextTitle = styled.Text`
    margin-left: 5%;
    font-size: 14px;
    font-family: 'MainFont-Regular';
`;
const CardTextSum = styled.Text`
    font-size: 18px;
    font-family: 'MainFont-Regular';
    color: #94c3f6;
`;
////////////////////////////////

const ModalInfo = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    background-color: #fff;
    width: 70%;
    height: auto;
    margin: 50% 15%;
    border-radius: 10px;
    padding: 7%;
`;

const AlertTextContainer = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin: 10% 0;
    width: 100%;
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
    height: 29px;
`;

const AlertButton = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    width: auto;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 2%;
`;

const AlertButtonText = styled.Text`
    font-family: 'MainFont-Regular';
    color: #000;
`;

const TextName = styled.Text`
    font-family: 'MainFont-Regular';
    text-align: center;
    width: 33%;
    margin-right: 1%;
    padding-bottom: 2px;
    font-size: 15px;
`;
// summation of transactions by category

function calculateValues(categories: category, history: history): category {
    if (!categories.categories) return emptyCategories();
    if (categories.categories.length == 0) return emptyCategories();

    return {
        categories: [
            ...categories.categories.map((categ) => {
                let sum = 0;
                if (history.history.length > 0) {
                    history.history.forEach((item) => {
                        if (item.category === categ.id) {
                            sum += item.sum;
                        }
                    });
                }
                const cat = {
                    id: categ.id,
                    name: categ.name,

                    category_type: categ.category_type,
                    color: categ.color,
                    value: sum,
                };
                return cat;
            }),
        ],
    };
}

////////////////////////////////

// basic function
export default function Home() {
    const [numColumns, setNumColumns] = useState(2);
    const [dataItems, setDataItems] = useState(emptyCategories());
    const [datahistory, setDatahistory] = useState(emptyHistory());
    const [history, setHistory] = useState(emptyAccount());
    const [activeModalButton, setActiveModalButton] = useState(true);
    const [text, setText] = useState(['', '', '', '']);
    const [texthistory, settexthistory] = useState(['', '', '', '']);
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [VisibleAddCategory, setVisibleAddCategory] = useState(false);
    const [activeModalButtonAddCategory, setActiveModalButtonAddCategory] = useState(true);
    const [visibleHistory, setVisibleHistory] = useState(false);
    const [visibleAddHistory, setVisibleAddHistory] = useState(false);
    const [activeModalButtonHistory, setactiveModalButtonHistory] = useState(true);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [openPicker, setOpenPicker] = useState(false);
    const [pickerValue, setPickerValue] = useState('');
    const [editingcategory, setEditingcategory] = useState({ editingcategory: false, index: 0 });
    const [debtTome, setDebt] = useState(true);
    const [openPickerAccounts, setOpenPickerAccounts] = useState(false);
    const [pickerValueAccounts, setPickerValueAccounts] = useState('');
    const [items, setItems] = useState<{ label: string; value: string }[]>([]);
    const [itemsAccounts, setitemsAccounts] = useState<{ label: string; value: string }[]>([]);
    const [editing, setEditing] = useState({ editing: false, index: 0 });
    const [categorytype, setcategorytype] = useState(true);
    const [touchItemIndex, setTouchItemIndex] = useState({ move: 0, index: -1 });
    const [visible3, setVisible3] = useState(false);

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
    const animateContainerOpacity = useRef(new Animated.Value(0)).current;
    const colors = [
        '#FF0000',
        '#FFA500',
        '#FFFF00',
        '#008000',
        '#0000FF',
        '#800080',
        '#FFC0CB',
        '#A52A2A',
        '#808080',
        '#3FDEAE',
        '#9966cc',
    ];
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedBlockIndex, setSelectedBlockIndex] = useState(-1);

    const deleteCardHistory = async (index: number) => {
        let data: history = JSON.parse(JSON.stringify(datahistory));
        let sumAccounts = 0;
        console.log(data);

        dataItems.categories.map((item) => {
            if (item.id === data.history[index].category) {
                console.log(item.category_type);
                console.log(data.history[index].id);

                if (item.category_type === 'Расход') {
                    sumAccounts = data.history[index].sum * 1;
                    console.log('я тута ');
                } else {
                    sumAccounts = data.history[index].sum * -1;
                }
                console.log(sumAccounts);
            }
        });

        data.history.splice(index, 1);
        await delItem('history', 'history', index);
        setDatahistory(data);
        setDataItems(calculateValues(dataItems, data));

        await addMoney(
            sumAccounts,
            datahistory.history[editing.index].id,
            datahistory.history[editing.index].id_account,
            'home',
            true,
            false,
        );
        let datas = await getData({ fileName: 'Account' });

        setHistory(datas);
    };

    const editModalHistory = async (index: number) => {
        settexthistory([
            datahistory.history[index].sum.toString(),
            datahistory.history[index].comment,
            datahistory.history[index].date,
        ]);

        setPickerValue(`${datahistory.history[index].category}`);
        setPickerValueAccounts(`${datahistory.history[index].id_account}`);
        setVisibleAddHistory(debtTome);
        setVisibleAddHistory(true);
        setEditing({ editing: true, index: index });
    };

    const deleteCardCategory = async (index: number) => {
        let NewDat: category = JSON.parse(JSON.stringify(dataItems));
        let Newhistory: history = JSON.parse(JSON.stringify(datahistory));

        for (let indexs = 0; indexs < Newhistory.history.length; indexs++) {
            if (Newhistory.history[indexs].category === NewDat.categories[index].id) {
                NewDat.categories[index].category_type === 'Расход'
                    ? await addMoney(
                          Newhistory.history[indexs].sum,
                          Newhistory.history[indexs].id,
                          Newhistory.history[indexs].id_account,
                          'home',
                          true,
                      )
                    : await addMoney(
                          Newhistory.history[indexs].sum * -1,
                          Newhistory.history[indexs].id,
                          Newhistory.history[indexs].id_account,
                          'home',
                          true,
                      );
            }
        }
        Newhistory.history = Newhistory.history.filter(
            (item) => item.category !== NewDat.categories[index].id,
        );

        NewDat.categories.splice(index, 1);

        delItem('categories', 'category', index);
        setDataItems(NewDat);
        setData({ fileName: 'history', data: Newhistory });
        setDatahistory(Newhistory);
        let datas = await getData({ fileName: 'Account' });

        setHistory(datas);
    };

    const editModalCategory = (index: number) => {
        setText([dataItems.categories[index].color, dataItems.categories[index].name]);
        setVisibleAddCategory(true);
        setEditingcategory({ editingcategory: true, index: index });
    };

    function getItems(accounts: category['categories']) {
        let data: { label: string; value: string }[] = [];
        accounts.map((item) => {
            data.push({ label: item.name + ', ' + item.category_type, value: item.id.toString() });
        });
        setItems(data);
        console.log(data, data.length);
        console.log(items, items.length);
    }

    function getAccount(accounts: account['accounts']) {
        let data: { label: string; value: string }[] = [];
        accounts.map((item) => {
            data.push({ label: `${item.name} ${item.sum}`, value: item.id.toString() });
        });
        setitemsAccounts(data);
    }

    const onStart = async () => {
        let dataC: category = await getData({ fileName: 'category' });
        let dataH: history = await getData({ fileName: 'history' });
        let data = await getData({ fileName: 'Account' });
        if (data === null) {
            data = emptyAccount();
            await setData({ fileName: 'Account', data });
        }
        setHistory(data);

        Animated.timing(animateContainerOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        if (dataC === null) {
            dataC = emptyCategories();

            await setData({ fileName: 'category', data: dataC });
        }

        await getItems(await getCategory());
        await getAccount(await getAccounts());
        if (dataH === null) {
            dataH = emptyHistory();

            await setData({ fileName: 'history', data: dataH });
        }
        setDataItems(
            calculateValues(JSON.parse(JSON.stringify(dataC)), JSON.parse(JSON.stringify(dataH))),
        );
        setDatahistory(JSON.parse(JSON.stringify(dataH)));
    };

    useFocusEffect(
        useCallback(() => {
            onStart();
        }, []),
    );

    const handleAddCategory = async () => {
        const maxid = 10;
        let mama: category = JSON.parse(JSON.stringify(dataItems));
        let dataH: history = await getData({ fileName: 'history' });
        let dat = {
            category_icon: 1,
            category_type: activeModalButtonAddCategory ? 'Доход' : 'Расход',
            value: 0,
            color: text[0],
            id: 0,
            name: text[1].replace(/\s+/g, ' ').trim(),
        };
        console.log(mama.categories.length);

        if (mama.categories.length > maxid) {
            alert(`Максимальное количество категорий 11!`);
            return;
        }
        if (text[0] === '' || text[1] === '') {
            alert('Неправильный ввод название или выбор цвета');
            return;
        }
        if (editingcategory.editingcategory) {
            dat.id = mama.categories[editingcategory.index].id;
            mama.categories[editingcategory.index] = dat;
            editItem('categories', 'category', editingcategory.index, dat);
            setDataItems(
                calculateValues(
                    JSON.parse(JSON.stringify(mama)),
                    JSON.parse(JSON.stringify(dataH)),
                ),
            );
        } else {
            if (mama.categories.length !== 0) {
                dat.id = mama.categories[mama.categories.length - 1].id + 1;
                mama.categories.push(dat);
            } else {
                dat.id = 0;
                mama.categories = [dat];
            }
            setDataItems(mama);
        }
        if (dat.category_type === 'Доход') {
            setcategorytype(true);
        } else {
            setcategorytype(false);
        }

        await setData({ fileName: 'category', data: mama });
        setText(['', '', '', '']);
        setSelectedColor('');
        await getItems(await getCategory());
        setVisibleAddCategory(false);
        setEditingcategory({ editingcategory: false, index: 0 });
    };

    const handleADDHistory = async () => {
        if (texthistory[0] === '' || pickerValue === '') {
            Alert.alert('Ошибка', 'Введите корректные данные');
            return;
        } else if (!texthistory[0].match(/^\d+([\.,]\d{1,2})?$/)) {
            Alert.alert('Ошибка', 'Введите корректные данные');
            return;
        } else if (selectedDate === '') {
            Alert.alert('Ошибка', 'Введите корректные данные');
            return;
        } else if (pickerValueAccounts === '') {
            Alert.alert('Ошибка', 'Введите корректные данные');
            return;
        } else if (texthistory[0] === '0') {
            Alert.alert('Ошибка', 'Введите корректные данные');
            return;
        }
        let mama: history = JSON.parse(JSON.stringify(datahistory));
        let dateS: string = '';
        let dateP: string = '';

        if (selectedDate == '') {
            dateS = '';
        } else {
            const [year, month, day] = texthistory[4].split('-').map(Number);
            const date = new Date(year, month, day);
            dateS = `${year}-${month.toString().padStart(2, '0')}-${day
                .toString()
                .padStart(2, '0')}`;
            dateP = selectedDate;
        }
        let dat = {
            id: 0,
            id_account: 0,
            category: 0,
            date: dateS,
            sum: Math.round(+replaceSpace(texthistory[0]).replace(',', '.') * 100) / 100,
            comment: texthistory[1].trim(),
        };

        if (mama.history.length !== 0) {
            dat.id = mama.history[mama.history.length - 1].id + 1;
            dat.category = Number(pickerValue);
            dat.id_account = Number(pickerValueAccounts);
            let sumAccounts = 0;

            dataItems.categories.map((item) => {
                if (item.id === dat.category) {
                    if (item.category_type === 'Расход') {
                        sumAccounts = dat.sum * -1;
                    } else {
                        sumAccounts = dat.sum;
                    }
                }
            });

            const res = editing.editing
                ? await addMoney(
                      sumAccounts,
                      datahistory.history[editing.index].id,
                      datahistory.history[editing.index].id_account,
                      'home',
                      false,
                      true,
                  )
                : await addMoney(sumAccounts, dat.id, dat.id_account, 'home');
            if (res === 'not-found') Alert.alert('ошибка', 'счет не найден');
            else {
                if (res === 'no-money') Alert.alert('ошибка', 'недостаточно средств');
                else {
                    if (editing.editing) {
                        if (datahistory.history[editing.index]) {
                            dat.id = datahistory.history[editing.index].id;
                            let sumaa = datahistory.history[editing.index].sum;
                            dataItems.categories.map((item) => {
                                if (item.id === datahistory.history[editing.index].category) {
                                    if (item.category_type === 'Расход') {
                                        sumaa = sumaa * 1;
                                    } else {
                                        sumaa = sumaa * -1;
                                    }
                                }
                            });
                            await addMoney(
                                sumaa,
                                datahistory.history[editing.index].id,
                                datahistory.history[editing.index].id_account,
                                'home',
                                false,
                                true,
                            );
                        }
                        mama.history[editing.index] = dat;
                        await editItem('history', 'history', editing.index, dat);
                    } else {
                        mama.history.push(dat);
                        await setData({ fileName: 'history', data: mama });
                    }
                }
            }
            setDatahistory(mama);
            setPickerValue('');
            setSelectedDate('');
            settexthistory(['', '', '', '', '']);
            setPickerValueAccounts('');

            setOpenPickerAccounts(false);
            setOpenPicker(false);
            setEditing({ editing: false, index: 0 });
        } else {
            dat.id = 0;
            dat.category = Number(pickerValue);
            dat.id_account = Number(pickerValueAccounts);
            let sumAccounts = 0;
            dataItems.categories.map((item) => {
                if (item.id === dat.category) {
                    if (item.category_type === 'Расход') {
                        sumAccounts = dat.sum * -1;
                    } else {
                        sumAccounts = dat.sum;
                    }
                    console.log(sumAccounts);
                }
            });
            const res = editing.editing
                ? await addMoney(
                      sumAccounts,
                      datahistory.history[editing.index].id,
                      datahistory.history[editing.index].id_account,
                      'home',
                      false,
                      true,
                  )
                : await addMoney(sumAccounts, dat.id, dat.id_account, 'home');
            if (res === 'not-found') Alert.alert('ошибка', 'счет не найден');
            else {
                if (res === 'no-money') Alert.alert('ошибка', 'недостаточно средств');
                else {
                    if (editing.editing) {
                        if (datahistory.history[editing.index]) {
                            dat.id = datahistory.history[editing.index].id;
                            let sumaa = datahistory.history[editing.index].sum;
                            dataItems.categories.map((item) => {
                                if (item.id === datahistory.history[editing.index].category) {
                                    if (item.category_type === 'Расход') {
                                        sumaa = sumaa * 1;
                                    } else {
                                        sumaa = sumaa * -1;
                                    }
                                }
                            });
                            await addMoney(
                                sumaa,
                                datahistory.history[editing.index].id,
                                datahistory.history[editing.index].id_account,
                                'home',
                                false,
                                true,
                            );
                        }
                        mama.history[editing.index] = dat;
                        await editItem('history', 'history', editing.index, dat);
                    } else {
                        mama.history.push(dat);
                        await setData({ fileName: 'history', data: mama });
                    }
                }
            }
            setDatahistory(mama);
            setPickerValue('');
            setSelectedDate('');
            settexthistory(['', '', '', '', '']);
            setOpenPickerAccounts(false);
            setOpenPicker(false);
            setEditing({ editing: false, index: 0 });
        }

        setDataItems(calculateValues(dataItems, mama));
        let data = await getData({ fileName: 'Account' });
        if (data === null) {
            data = emptyAccount();
            await setData({ fileName: 'Account', data });
        }
        setHistory(data);
        setVisibleAddHistory(false);
    };

    const handleColorSelect = (color: string, index: number) => {
        setSelectedColor(color);

        setSelectedBlockIndex(index);
    };

    const handleAddColor = () => {
        text[0] = selectedColor.toString();
        setVisible2(false);

        setSelectedBlockIndex(-1);
    };

    return (
        <View
            style={{
                backgroundColor: '#fff',
                height: '100%',
            }}
        >
            {/* окно с выбором цвета */}
            <Modal
                visible={visible2}
                animationType='slide'
                onRequestClose={() => setVisible2(false)}
            >
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <View style={styles.modalContainer}>
                        {colors.map((color, index) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorBlock,
                                    { backgroundColor: color },
                                    selectedBlockIndex === index && {
                                        borderColor: 'black',
                                        borderWidth: 3,
                                    },
                                ]}
                                onPress={() => handleColorSelect(color, index)}
                                onPressOut={() => setSelectedBlockIndex(-1)}
                            />
                        ))}
                    </View>
                    <Button title='Добавить цвет' onPress={handleAddColor} />
                </View>
            </Modal>

            {/* окно с созданием категории */}
            <ModalWindow
                functionCancelButton={() => {
                    setText(['', '', '', '']);
                    setEditingcategory({ editingcategory: false, index: -1 });
                }}
                functionSaveButton={() => {
                    handleAddCategory();
                }}
                visible={VisibleAddCategory}
                setVisible={setVisibleAddCategory}
                buttonTextLeft='Доход'
                buttonTextRight='Расход'
                activeModalButton={activeModalButtonAddCategory}
                setActiveModalButton={setActiveModalButtonAddCategory}
                colorActiveLeft='#3EA2FF'
                colorActiveRight='#FF6E6E'
            >
                <PickerBlock>
                    <Text
                        style={{
                            fontSize: 15,
                            textAlign: 'center',
                            width: 'auto',
                            marginLeft: 40,
                            textAlignVertical: 'center',
                        }}
                    >
                        Цвет
                    </Text>
                    <View style={{ marginRight: '37%' }}>
                        <Button
                            title='выбери цвет'
                            onPress={() => setVisible2(true)}
                            color={selectedColor}
                        />
                    </View>
                </PickerBlock>
                <Input
                    textName='Название'
                    value={text[1].toString()}
                    setItems={setText}
                    index={1}
                    placeholder='Введите название категории'
                    keyboardType='default'
                    colorActiveInput={activeModalButtonAddCategory ? '#3EA2FF' : '#FF6E6E'}
                />
            </ModalWindow>

            {/* Окно с карточками истории операций */}
            <ModalWindowHistory
                visible={visibleHistory}
                setVisible={setVisibleHistory}
                type={false}
            >
                <Container>
                    {datahistory.history &&
                        datahistory.history.map((item, index) => {
                            {
                                const category = dataItems.categories.find(
                                    (cat) => cat.id === item.category,
                                );
                                return (
                                    <CardWithButtons
                                        key={index}
                                        func={() => {
                                            setTouchItemIndex({ move: 2, index: index });
                                            setVisible3(true);
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: '100%',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    width: '100%',
                                                    justifyContent: 'space-between',
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        width: '100%',
                                                        justifyContent: 'flex-start',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <Circle
                                                        radius={10}
                                                        color={
                                                            category && category.color
                                                                ? category.color
                                                                : '#000000'
                                                        }
                                                    />

                                                    <Text
                                                        style={{
                                                            color: '#000',
                                                            marginLeft: '5%',
                                                            fontFamily: 'MainFont-Regular',
                                                        }}
                                                    >
                                                        {category && category.name
                                                            ? category.name.length > 12
                                                                ? `${category.name.slice(0, 12)}...`
                                                                : category.name
                                                            : 'No category name available'}
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={{
                                                        color: '#8D97A2',
                                                        fontFamily: 'MainFont-Regular',
                                                    }}
                                                >
                                                    {PeopleDate(item.date)}
                                                </Text>
                                            </View>

                                            <CardTextSum>
                                                {borderBillionMillionThousand(item.sum)} руб
                                            </CardTextSum>
                                        </View>
                                    </CardWithButtons>
                                );
                            }
                        })}
                </Container>
            </ModalWindowHistory>

            {/* Окно с созданием операции */}
            <ModalWindowOneButton
                functionCancelButton={() => {
                    settexthistory(['', '', '', '']),
                        setPickerValue(''),
                        setSelectedDate(''),
                        setPickerValueAccounts('');
                    setEditing({ editing: false, index: -1 });
                }}
                functionSaveButton={handleADDHistory}
                visible={visibleAddHistory}
                setVisible={setVisibleAddHistory}
                windowName={editing.editing ? 'Редактирование операции' : 'Создание операции'}
                colorActive={activeModalButtonHistory ? '#3EA2FF' : '#FF6E6E'}
            >
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
                    colorActiveInput={activeModalButtonHistory ? '#3EA2FF' : '#FF6E6E'}
                />
                <PickerBlock>
                    <TextName>Категория</TextName>

                    <DropDownPicker
                        open={openPicker}
                        value={pickerValue}
                        setOpen={setOpenPicker}
                        setValue={setPickerValue}
                        items={items}
                        setItems={setItems}
                        containerStyle={{
                            width: '66%',
                            alignSelf: 'flex-end',
                            position: 'relative',
                        }}
                        zIndex={2}
                        placeholder='Выберите категорию'
                        dropDownDirection='BOTTOM'
                    />
                </PickerBlock>

                <Input
                    textName='Сумма'
                    value={texthistory[0].toString()}
                    setItems={settexthistory}
                    index={0}
                    placeholder='Введите сумму '
                    keyboardType='numeric'
                    colorActiveInput={activeModalButtonHistory ? '#3EA2FF' : '#FF6E6E'}
                />
                <Input
                    textName='Комментарий'
                    value={texthistory[1].toString()}
                    setItems={settexthistory}
                    index={1}
                    placeholder='Введите комментарий'
                    keyboardType='default'
                    colorActiveInput={activeModalButtonHistory ? '#3EA2FF' : '#FF6E6E'}
                />
                <PickerBlock>
                    <TextName>Счет</TextName>
                    <DropDownPicker
                        open={openPickerAccounts}
                        value={pickerValueAccounts}
                        setOpen={setOpenPickerAccounts}
                        setValue={setPickerValueAccounts}
                        items={itemsAccounts}
                        setItems={setitemsAccounts}
                        containerStyle={{ width: '66%', alignSelf: 'flex-end' }}
                        placeholder='Выберите счет'
                        dropDownDirection='BOTTOM'
                        zIndex={1}
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
                            const newText = [...texthistory];
                            newText[4] = `${date.getFullYear()}-${(date.getMonth() + 1)
                                .toString()
                                .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                            settexthistory(newText);
                            setDatePickerVisible(false);
                        }}
                        onCancel={() => {
                            setDatePickerVisible(false);
                        }}
                    />
                )}
            </ModalWindowOneButton>

            {/* Окно с выводом категорий */}
            <Modal
                animationType='slide'
                transparent={false}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            >
                <View style={{ height: '100%' }}>
                    <HeaderViewModal>
                        <BackArrowSvg
                            width={25}
                            height={25}
                            onPress={() => {
                                setVisible(false);
                            }}
                        />
                        <HeaderText>{categorytype ? 'Доход' : 'Расход'}</HeaderText>

                        <ButtonHeader
                            onPress={() => {
                                if (dataItems.categories.length <= 10) {
                                    setVisibleAddCategory(true);
                                    setActiveModalButtonAddCategory(categorytype);
                                } else {
                                    Alert.alert('вы достигли лимита категорий (10)');
                                }
                            }}
                            style={{ shadowColor: '#625E5E', elevation: 10 }}
                        >
                            <PlusSvg width={15} height={15} />
                        </ButtonHeader>
                    </HeaderViewModal>
                    <View
                        style={{
                            margin: 5,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}
                    >
                        <DohodME
                            onPress={() => {
                                setcategorytype(true);
                            }}
                            style={{ borderColor: categorytype ? '#3EA2FF' : '#C9C9C9' }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'MainFont-Regular',
                                    color: categorytype ? '#3EA2FF' : '#C9C9C9',
                                    fontSize: 19,
                                }}
                            >
                                Доход
                            </Text>
                        </DohodME>
                        <RashodME
                            onPress={() => {
                                setcategorytype(false);
                            }}
                            style={{ borderColor: !categorytype ? '#FF6E6E' : '#C9C9C9' }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'MainFont-Regular',
                                    color: !categorytype ? '#FF6E6E' : '#C9C9C9',
                                    fontSize: 19,
                                }}
                            >
                                Расход
                            </Text>
                        </RashodME>
                    </View>
                    <Scroll>
                        <Container>
                            {dataItems.categories &&
                                dataItems.categories.map((item, index) => {
                                    if (
                                        (categorytype && item.category_type == 'Доход') ||
                                        (item.category_type == 'Расход' && !categorytype)
                                    )
                                        return (
                                            <CardWithButtons
                                                key={index}
                                                func={() => {
                                                    setTouchItemIndex({ move: 1, index: index });
                                                    setVisible3(true);
                                                }}
                                            >
                                                <CardView>
                                                    <CircleCard
                                                        style={{ backgroundColor: `${item.color}` }}
                                                    ></CircleCard>
                                                    <Text
                                                        style={{
                                                            marginLeft: 6,
                                                            fontFamily: 'MainFont-Regular',
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                </CardView>
                                            </CardWithButtons>
                                        );
                                })}
                        </Container>
                    </Scroll>
                </View>
            </Modal>

            {/* Окно с доп инфой по категориям и истории */}
            <Modal
                animationType='fade'
                transparent={true}
                visible={visible3}
                onRequestClose={() => {
                    setVisible3(false);
                    setTouchItemIndex({ move: 0, index: -1 });
                }}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                    <ModalInfo>
                        <PlusSvg
                            width={25}
                            height={25}
                            rotation={45}
                            onPress={() => {
                                setTouchItemIndex({ move: 0, index: -1 });
                                setVisible3(false);
                            }}
                            style={{ position: 'absolute', left: 13, top: 13 }}
                        />

                        {touchItemIndex.move == 1 ? (
                            <AlertTextContainer>
                                <AlertInView style={{ justifyContent: 'flex-start' }}>
                                    <AlertMessage style={{ textDecorationLine: 'underline' }}>
                                        Цвет:
                                    </AlertMessage>
                                    <View
                                        style={{
                                            marginLeft: '20%',
                                            height: '70%',
                                            width: '30%',
                                            backgroundColor:
                                                touchItemIndex.index !== -1
                                                    ? `${
                                                          dataItems.categories[touchItemIndex.index]
                                                              .color
                                                      }`
                                                    : '#fff',
                                        }}
                                    ></View>
                                </AlertInView>
                                <AlertInView>
                                    <AlertMessage
                                        style={{ width: '38%', textDecorationLine: 'underline' }}
                                    >
                                        Название:
                                    </AlertMessage>
                                    <AlertMessage style={{ width: '62%', textAlign: 'center' }}>
                                        {touchItemIndex.index !== -1
                                            ? dataItems.categories[touchItemIndex.index].name
                                            : ''}
                                    </AlertMessage>
                                </AlertInView>
                            </AlertTextContainer>
                        ) : (
                            <AlertTextContainer>
                                <AlertInView>
                                    <AlertMessage
                                        style={{ width: '50%', textDecorationLine: 'underline' }}
                                    >
                                        Категория:
                                    </AlertMessage>
                                    <AlertMessage style={{ width: '50%', textAlign: 'center' }}>
                                        {touchItemIndex.index !== -1
                                            ? dataItems.categories[
                                                  dataItems.categories.findIndex(
                                                      (item) =>
                                                          item.id ===
                                                          datahistory.history[touchItemIndex.index]
                                                              .category,
                                                  )
                                              ].name
                                            : ''}
                                    </AlertMessage>
                                </AlertInView>
                                <AlertInView>
                                    <AlertMessage style={{ textDecorationLine: 'underline' }}>
                                        Дата:
                                    </AlertMessage>
                                    <AlertMessage style={{ width: '70%', textAlign: 'center' }}>
                                        {touchItemIndex.index !== -1
                                            ? PeopleDate(
                                                  datahistory.history[touchItemIndex.index].date,
                                              )
                                            : ''}
                                    </AlertMessage>
                                </AlertInView>
                                <AlertInView>
                                    <AlertMessage style={{ textDecorationLine: 'underline' }}>
                                        Сумма:
                                    </AlertMessage>
                                    <AlertMessage style={{ width: '70%', textAlign: 'center' }}>
                                        {touchItemIndex.index !== -1
                                            ? `${borderBillionMillionThousand(
                                                  datahistory.history[touchItemIndex.index].sum,
                                              )} руб`
                                            : ''}
                                    </AlertMessage>
                                </AlertInView>
                                <AlertInView>
                                    <AlertMessage
                                        style={{
                                            width: '39%',
                                            textDecorationLine: 'underline',
                                        }}
                                    >
                                        Коммент:
                                    </AlertMessage>
                                    <AlertMessage style={{ width: '61%', textAlign: 'center' }}>
                                        {touchItemIndex.index !== -1
                                            ? datahistory.history[touchItemIndex.index].comment
                                            : ''}
                                    </AlertMessage>
                                </AlertInView>
                                <AlertInView>
                                    <AlertMessage
                                        style={{
                                            width: '39%',
                                            textDecorationLine: 'underline',
                                        }}
                                    >
                                        Счет:
                                    </AlertMessage>
                                    <AlertMessage style={{ width: '61%', textAlign: 'center' }}>
                                        {touchItemIndex.index !== -1
                                            ? `${
                                                  itemsAccounts[
                                                      itemsAccounts.findIndex(
                                                          (item) =>
                                                              +item.value ===
                                                              datahistory.history[
                                                                  touchItemIndex.index
                                                              ].id_account,
                                                      )
                                                  ].label
                                              } руб`
                                            : ''}
                                    </AlertMessage>
                                </AlertInView>
                            </AlertTextContainer>
                        )}
                        <AlertButtonCantainer>
                            <AlertButton
                                style={{ width: '60%' }}
                                onPress={() => {
                                    if (touchItemIndex.index !== -1) {
                                        if (touchItemIndex.move == 1) {
                                            editModalCategory(touchItemIndex.index);
                                            setTouchItemIndex({ move: 0, index: -1 });
                                            setVisible3(false);
                                        }
                                        if (touchItemIndex.move == 2) {
                                            editModalHistory(touchItemIndex.index);
                                            setTouchItemIndex({ move: 0, index: -1 });
                                            setVisible3(false);
                                        }
                                    }
                                }}
                            >
                                <AlertButtonText>Редактировать</AlertButtonText>
                            </AlertButton>
                            <AlertButton
                                style={{ backgroundColor: '#FF8484' }}
                                onPress={() => {
                                    if (touchItemIndex.index !== -1) {
                                        if (touchItemIndex.move == 1) {
                                            deleteCardCategory(touchItemIndex.index);
                                            setTouchItemIndex({ move: 0, index: -1 });
                                            setVisible3(false);
                                        }
                                        if (touchItemIndex.move == 2) {
                                            deleteCardHistory(touchItemIndex.index);
                                            setTouchItemIndex({ move: 0, index: -1 });
                                            setVisible3(false);
                                        }
                                    }
                                }}
                            >
                                <AlertButtonText>Удалить</AlertButtonText>
                            </AlertButton>
                        </AlertButtonCantainer>
                    </ModalInfo>
                </View>
            </Modal>

            <Header
                name='Категории'
                style='2'
                functionLeft={() => {}}
                functionRight={async () => {
                    await getAccount(await getAccounts());
                    setVisibleHistory(true);
                }}
                onModalHide={async () => {
                    onStart();
                }}
            />
            <View
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <CircleContainerBox>
                    <CircleContainer>
                        <Animated.View style={{ opacity: animateContainerOpacity }}>
                            <DonutChart
                                data={dataItems.categories.filter((item) => {
                                    return item.value > 0;
                                })}
                                size={300}
                            />
                        </Animated.View>
                        <View style={styles.ViewInDiagrams}>
                            <Text style={styles.TextInDiagramsfirst}>Сумма счетов</Text>
                            <Text style={styles.TextInDiagramsSecond}>
                                {history.accounts.length > 0 &&
                                    +borderBillionMillionThousand(
                                        Math.round(
                                            history.accounts.reduce(
                                                (a, b) => a + Math.abs(b.sum),
                                                0,
                                            ) * 100,
                                        ) / 100,
                                    )}
                                {history.accounts.length === 0 && '0'} руб
                            </Text>
                        </View>
                    </CircleContainer>
                    <ButtonView style={{ position: 'absolute', bottom: 0 }}>
                        <ButtonHeader
                            onPress={() => {
                                setVisible(true);
                                setActiveModalButton(true);
                            }}
                        >
                            <View>
                                <Image
                                    source={require('../../assets/icon/Sorting.png')}
                                    style={styles.image}
                                />
                            </View>
                        </ButtonHeader>
                        {dataItems.categories.length > 0 && history.accounts.length > 0 && (
                            <ButtonHeader
                                onPress={async () => {
                                    await getAccount(await getAccounts());
                                    setVisibleAddHistory(true);
                                    setactiveModalButtonHistory(true);
                                }}
                            >
                                <View>
                                    <Image
                                        source={require('../../assets/icon/plus.png')}
                                        style={styles.image}
                                    />
                                </View>
                            </ButtonHeader>
                        )}
                    </ButtonView>
                </CircleContainerBox>
                <View
                    style={{
                        borderBottomColor: '#C6C3C3',
                        borderBottomWidth: 1,
                        marginTop: 5,
                        // marginBottom: 14,
                    }}
                />

                <FlatlistView>
                    <FlatListViewIn>
                        {dataItems.categories &&
                            dataItems.categories.map((item, index) => {
                                {
                                    return (
                                        <Item key={index}>
                                            <CardHeader>
                                                <CircleCard
                                                    style={{ backgroundColor: `${item.color}` }}
                                                ></CircleCard>
                                                <CardTextTitle>{item.name}</CardTextTitle>
                                            </CardHeader>
                                            <CardTextSum>
                                                {borderBillionMillionThousand(
                                                    Math.round(item.value * 100) / 100,
                                                )}{' '}
                                                руб
                                            </CardTextSum>
                                        </Item>
                                    );
                                }
                            })}
                    </FlatListViewIn>
                </FlatlistView>
            </View>
        </View>
    );
}
