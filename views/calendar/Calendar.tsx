import { View } from 'react-native';
import { useCallback, useState } from 'react';
import { calendar, emptyCalendar } from '../../models/interfaces';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react'
import { LocaleConfig, Calendar as Cal } from 'react-native-calendars';
import { getData, setData } from '../tools/iosys';

import styled from 'styled-components/native';
import Header from '../modular_components/Header';
import Card from '../modular_components/Card';
import Input from '../modular_components/Input';
import InputDate from './additionally/InputDate';
import ModalWindow from '../modular_components/ModalWindow';
import DateTimePicker from 'react-native-modal-datetime-picker';



interface DataType {
    cards: {
        comment: string,
        date: string,
        id: number,
        id_account: number,
        name: string,
        type: string
    }[]
}

interface DatasType {
    [key: string]: {
        dots: {
            key: string,
            color: string
        }[]
    }
}

function emptyDatasType(): DatasType {
    let datas: DatasType = { key:{dots: []}};
    return datas
}

const CardView = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    max-width: 100%;
    height: 100%;
    width: 100%;
`;

const HeaderCardView = styled.View`
    display: flex;  
    flex-direction: row;
    justify-content: space-evenly;
`;

const CardText = styled.Text`
    text-align: center;
    font-size: 13px;
    font-weight: 400;
    
`;

export default function Calendar() {
    const [state, setState] = useState(emptyCalendar())
    const [counter, setCounter] = useState(emptyDatasType())
    const [active, setActive] = useState(false)
    const [types, setTypes] = useState(false)
    const [activeindex, setActiveindex] = useState([])
    const [visible, setVisible] = useState(false)
    const [activeModalButton, setActiveModalButton] = useState(true)
    const [text, setText] = useState(['','','',''])
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

    const path = 'Calendar'

    const curData = {
        id: 1,
        id_account: 1,
        date: '2023-03-01',
        name: 'Зарплата',
        type: '1',
        sum: 22000,
        comment: ''
    }


    useFocusEffect(
        useCallback(()=>{
            const search = async () => {
                let data: calendar = await getData({fileName: path});           
                if (data === null) {
                    
                    await setData({fileName: path, data: data})
                    data = emptyCalendar()
                }                
                setState(JSON.parse(JSON.stringify(data)))
                setCounter(JSON.parse(JSON.stringify(reformat(data))))              
            }
            search()
        },[])
    )

    const onClick = async () => {
        let newDat: calendar = JSON.parse(JSON.stringify(state));
        let dat = curData;

        if (newDat.cards.length !== 0)
        {
            dat.name = text[0]
            dat.date = text[1];
            dat.sum = +text[2]
            dat.comment = text[3]
            dat.type = activeModalButton ? '1' : '2';
            dat.id = newDat.cards[newDat.cards.length - 1].id + 1;
            newDat.cards.push(dat);
            await setData({fileName: path, data: newDat});
            setSelectedDate('')
            setText(['', '', '', ''])
            setState(newDat);
            setCounter(JSON.parse(JSON.stringify(reformat(newDat))))
        } else {
            dat.name = text[0]
            dat.date = text[1];
            dat.sum = +text[2]
            dat.comment = text[3]
            dat.type = activeModalButton ? '1' : '2';
            dat.id = 1;
            newDat.cards = [dat];
            await setData({fileName: path, data: newDat});
            setSelectedDate('')
            setText(['', '', '', ''])
            setState(newDat);
            setCounter(JSON.parse(JSON.stringify(reformat(newDat))))
        }
    }

    const income = {key: 'income', color: 'green'}
    const expense = {key: 'expense', color: 'red'}

    function searchData(date: string) {
        let mas: any = []
        state.cards.forEach((item, index) => {
            if (item.date === date) 
            {
                mas.push(index)
            }
        })
        setActiveindex(mas)
    }

    function reformat(item: DataType) {
        
        let datas: DatasType = {}
        for (let index = 0; index < item.cards.length; index++)
        {
            const itemType=  item.cards[index].type == '1' ? {key: `${item.cards[index].id}`, color: 'green'} : {key: `${item.cards[index].id}`, color: 'red'};
            datas[item.cards[index].date] == null ? datas[item.cards[index].date] = {dots: [itemType]} : datas[item.cards[index].date].dots.push(itemType)
        }
        
        return datas
    }

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
          'Декабрь'
        ],
        monthNamesShort: ['Янв', 'Февр', 'Март', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        dayNames: ['Воскресенье','Понельник','Вторник','Среда','Четверг','Пятница','Суббота'],
        dayNamesShort: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
        today: "Сегодня"
      };
    
    LocaleConfig.defaultLocale = 'ru';
    
    const dateConfirm = (date: Date) => {
        const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        const dates = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`
        setText(prevState => {
            const newText = [...prevState];
            newText[1] = dates;
            return newText
        });
        setSelectedDate(`${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`);
        setDatePickerVisible(false)
    }
    
    const dateCencel = () => { setDatePickerVisible(false)}    
    return (
        <View style={{ backgroundColor:'#FFF', height: '100%'}}>
            <ModalWindow functionCancelButton={() => {setText(['','','','']); setSelectedDate('')}} functionSaveButton={() => {onClick()}} visible={visible} setVisible={setVisible} buttonTextLeft='Доход' buttonTextRight='Платеж' activeModalButton={activeModalButton} setActiveModalButton={setActiveModalButton} colorActiveLeft='#3EA2FF' colorActiveRight='#FF6E6E'>
                <Input textName='Название' value={text[0].toString()} setItems={setText} index={0} placeholder='Введите название операции' keyboardType="default" colorActiveInput={(activeModalButton) ? '#3EA2FF' : '#FF6E6E'}/>
                <InputDate functionDate={() => {setDatePickerVisible(true)}} textName='Дата' value={selectedDate.toString()} setValue={() => {setSelectedDate}} placeholder='Введите дату' keyboardType="default" colorActiveInput={(activeModalButton) ? '#3EA2FF' : '#FF6E6E'}/>
                <Input textName='Сумма' value={text[2].toString()} setItems={setText} index={2} placeholder='Введите сумму' keyboardType="numeric" colorActiveInput={(activeModalButton) ? '#3EA2FF' : '#FF6E6E'}/>
                <Input textName='Комментарий' value={text[3].toString()} setItems={setText} index={3} placeholder='Введите комментарий' keyboardType="default" colorActiveInput={(activeModalButton) ? '#3EA2FF' : '#FF6E6E'}/>
                {isDatePickerVisible && (
                    <DateTimePicker style={{flex: 1, position: 'relative'}} isVisible={isDatePickerVisible} mode='date' onConfirm={dateConfirm} onCancel={dateCencel}/>
                )}
            </ModalWindow>
            <Header name='Calendar' style='1' functionLeft={() => {}} functionRight={() => {setVisible(true); setActiveModalButton(true)}}/>
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
                onDayPress={day => {
                    searchData(day.dateString);
                    if (activeindex.length !== 0){
                        (active) ? setActive(false) : setActive(true)
                    }
                    
                }}
                // Действие при долгом нажатии на дату
                onDayLongPress={day => {
                    searchData(day.dateString);
                    if (activeindex.length !== 0){
                        (active) ? setActive(false) : setActive(true)
                    };
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={monthNames[+'MM']}
                // Можно отловить на каком месяце находится юзер
                onMonthChange={month => {
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
                onPressArrowLeft={subtractMonth => subtractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
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
            {activeindex && activeindex.map((item, index) => {
                                
                if (active && state.cards.length >0)
                {
                    const [year, month, day] = state.cards[item].date.split("-").map(Number);
                    const date = new Date(year, month - 1, day);
                    const type = (state.cards[item].type === '1') ? true : false                    
                    return (
                    <Card onPress={()=>{}} key={index}>
                        <CardView>
                            <CardText style={type ? {color:'#3EA2FF'} : {color:'#FF6E6E'}}>{(state.cards[item].type === '1') ? 'Доход' : 'Платеж'}</CardText>
                            <HeaderCardView>
                                <CardText>{state.cards[item].name}</CardText>
                                <CardText>{`${date.getDate()}  ${monthNames[date.getMonth()]}  ${date.getFullYear()}`}</CardText>
                                <CardText>{state.cards[item].sum} руб.</CardText>
                            </HeaderCardView>
                        </CardView>
                    </Card>
                )}
            })}
        </View>
    )}