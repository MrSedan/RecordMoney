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
import Item from './Item';
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
import { getData, setData, addItem, delItem, editItem } from '../tools/iosys';
import CardWithButtons from '../modular_components/CardWithButtons';

const ButtonView = styled.View`
    display: flex;
    margin: 0px 20px 0px;
    flex-direction: row;
    max-width: 100%;
    justify-content: space-between;
`;
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
    justify-content: flex-start;
    align-items: center;
    margin: 0 0 0 25px;
    max-width: 100%;
`;


const Scroll = styled.ScrollView`
    // margin: 0;
    // height: 100%;
    // max-height: 100%;
`;

const PickerBlock = styled.View`
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 20px;
    flex-direction: row;
    margin-bottom: 20px;
`;
const HeaderText = styled.Text`
    font-size: 20px;
    margin-left: 17px;
`;

const CardView = styled.View`
    display: flex;
    flex: 1;
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
    },
    TextInDiagramsSecond: {
        fontSize: 40,
        color: '#000000',
    },
    ViewInDiagrams: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 398,
        width: '100%',
        left: 0,
        position: 'absolute',
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
    },
    colorBlock: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 10,
    },
});

////////////////////////////////

// render item  and category

const renderItem = ({
    item,
}: {
    item: {
        id: number;
        name: string;
        category_icon: number;
        category_type: string;
        color: string;
        value: number;
    };
}) => (
    <Item
        category_id={item.id}
        category_name={item.name}
        category_icon={item.category_icon}
        category_type={item.category_type}
        color={item.color}
        value={item.value}
    />
);

////////////////////////////////

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
                    category_icon: categ.category_icon,
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
    const [history, setHistory] = useState(emptyAccount())
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
    };

    const editModalCategory = (index: number) => {
        setText([dataItems.categories[index].color, dataItems.categories[index].name]);
        setVisibleAddCategory(true);
        setEditingcategory({ editingcategory: true, index: index });
    };

    function getItems(accounts: category['categories']) {
        let data: { label: string; value: string }[] = [];
        accounts.map((item) => {
            data.push({ label: item.name, value: item.id.toString() });
        });
        setItems(data);
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
        await getAccount(await await getAccounts());
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

        if (dat.id > maxid) {
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

        await setData({ fileName: 'category', data: mama });
        setText(['', '', '', '']);

        await getItems(await getCategory());
        setVisibleAddCategory(false);
        setEditingcategory({ editingcategory: false, index: 0 });
    };

    const handleADDHistory = async () => {
        if (texthistory[0] === '' || pickerValue === ''  ) {
            Alert.alert('Ошибка', 'Введите корректные данные');
            return;
        } else if (!texthistory[0].match(/^\d+$/)) {
            Alert.alert('Ошибка', 'Введите корректные данные');
            return;
        } else if (selectedDate === ''){
            Alert.alert('Ошибка', 'Введите корректные данные');
            return;
        } else if (pickerValueAccounts === ''){
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
            sum: Number(texthistory[0]),
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
    ];
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedBlockIndex, setSelectedBlockIndex] = useState(-1);

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
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <Modal
                visible={visible2}
                animationType='slide'
                onRequestClose={() => setVisible2(false)}
            >
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
            </Modal>

            <ModalWindow
                functionCancelButton={() => {
                    setText(['', '', '', '']);
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
                            color = {selectedColor}
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
                                        editModal={() => {
                                            editModalHistory(index);
                                        }}
                                        del={() => {
                                            deleteCardHistory(index);
                                        }}
                                    >
                                        <View>
                                            <Circle
                                                radius={10}
                                                color={
                                                    category && category.color
                                                        ? category.color
                                                        : '#000000'
                                                }
                                            />
                                            <View style={{ position: 'absolute', marginTop: '3%' }}>
                                                <Text
                                                    style={{ color: '#303841', marginLeft: '30%' }}
                                                >
                                                    {category && category.name
                                                        ? category.name
                                                        : 'No category name available'}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: '#7D8895',
                                                        marginTop: '20%',
                                                        marginLeft: '8%',
                                                    }}
                                                >
                                                    {item.date}
                                                </Text>
                                            </View>
                                            <Text
                                                style={{
                                                    color: '#94C3F6',
                                                    marginTop: '4%',
                                                    marginLeft: '60%',
                                                    fontSize: 20,
                                                }}
                                            >
                                                {item.sum} руб
                                            </Text>
                                        </View>
                                    </CardWithButtons>
                                );
                            }
                        })}
                </Container>
            </ModalWindowHistory>
            <ModalWindowOneButton
                functionCancelButton={() => {
                    settexthistory(['', '', '', '']), setPickerValue(''),setSelectedDate(''), setPickerValueAccounts('');
                }}
                functionSaveButton={handleADDHistory}
                visible={visibleAddHistory}
                setVisible={setVisibleAddHistory}
                windowName='Добавление Ден. операции'
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
                    colorActiveInput={activeModalButtonAddCategory ? '#3EA2FF' : '#FF6E6E'}
                />
                <PickerBlock>
                    <Text
                        style={{
                            fontSize: 15,
                            textAlign: 'center',
                            width: 'auto',
                            marginLeft: 20,
                            textAlignVertical: 'center',
                        }}
                    >
                        Категория
                    </Text>
                    <DropDownPicker
                        open={openPicker}
                        value={pickerValue}
                        setOpen={setOpenPicker}
                        setValue={setPickerValue}
                        items={items}
                        setItems={setItems}
                        containerStyle={{ width: '66%', alignSelf: 'flex-end', zIndex: 9999 }}
                        placeholder='Выберите категорию'
                        dropDownDirection='DEFAULT'
                    />
                </PickerBlock>

                <Input
                    textName='Сумма'
                    value={texthistory[0].toString()}
                    setItems={settexthistory}
                    index={0}
                    placeholder='Введите сумму '
                    keyboardType='numeric'
                    colorActiveInput={activeModalButtonAddCategory ? '#3EA2FF' : '#FF6E6E'}
                />
                <Input
                    textName='Комментарий'
                    value={texthistory[1].toString()}
                    setItems={settexthistory}
                    index={1}
                    placeholder='Введите комментарий'
                    keyboardType='default'
                    colorActiveInput={activeModalButtonAddCategory ? '#3EA2FF' : '#FF6E6E'}
                />
                <PickerBlock>
                    <Text
                        style={{
                            fontSize: 15,
                            textAlign: 'center',
                            width: 'auto',
                            marginLeft: 20,
                            textAlignVertical: 'center',
                        }}
                    >
                        Счет
                    </Text>
                    <DropDownPicker
                        open={openPickerAccounts}
                        value={pickerValueAccounts}
                        setOpen={setOpenPickerAccounts}
                        setValue={setPickerValueAccounts}
                        items={itemsAccounts}
                        setItems={setitemsAccounts}
                        containerStyle={{ width: '66%', alignSelf: 'flex-end' }}
                        placeholder='Выберите аккаунт'
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

            <Modal
                animationType='slide'
                transparent={false}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            >
                <View>
                    <HeaderViewModal>
                        <BackArrowSvg
                            width={25}
                            height={25}
                            onPress={() => {
                                setVisible(false);
                            }}
                        />
                        <HeaderText>{activeModalButton ? 'Доход' : 'Расход'}</HeaderText>
                        <ButtonHeader
                            onPress={() => {
                                setVisibleAddCategory(true);
                                setActiveModalButtonAddCategory(activeModalButton);
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
                            marginBottom: 40,
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
                                                del={() => {
                                                    deleteCardCategory(index);
                                                }}
                                                editModal={() => {
                                                    editModalCategory(index);
                                                }}
                                            >
                                                <CardView>
                                                    <Text>{item.name}</Text>
                                                </CardView>
                                            </CardWithButtons>
                                        );
                                })}
                        </Container>
                    </Scroll>
                </View>
            </Modal>

            <Header
                name='Home'
                style='2'
                functionLeft={() => {}}
                functionRight={() => {
                    setVisibleHistory(true);
                }}
                onModalHide={async () => {
                    onStart();
                }}
            />

            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Animated.View style={{ opacity: animateContainerOpacity }}>
                    <DonutChart
                        data={dataItems.categories.filter((item) => {
                            return item.value > 0;
                        })}
                        size={350}
                    />
                </Animated.View>

                <View style={styles.ViewInDiagrams}>
                    <Text style={styles.TextInDiagramsfirst}>Сумма счетов</Text>
                    <Text style={styles.TextInDiagramsSecond}>{history.accounts.length > 0 && history.accounts.reduce((a,b) => a+ Math.abs(b.sum), 0)} {history.accounts.length === 0 && '0'} руб</Text>
                </View>
            </View>
            <ButtonView>
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
                {dataItems.categories.length > 0 && items.length > 0 && (
                    <ButtonHeader
                        onPress={() => {
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

            <FlatList
                style={{ display: 'flex', alignContent: 'flex-start' }}
                data={dataItems.categories}
                renderItem={renderItem}
                numColumns={numColumns}
                keyExtractor={(item) => {
                    return item.id.toString();
                }}
            />
        </View>
    );
}
