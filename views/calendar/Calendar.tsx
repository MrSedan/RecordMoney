import { View } from 'react-native';
import { useCallback, useState } from 'react';
import { calendar, emptyCalendar } from '../../models/interfaces';
import { useFocusEffect } from '@react-navigation/native';

import { getData, setData } from '../tools/iosys';

import styled from 'styled-components/native';
import Header from '../modular_components/Header';
import Card from '../modular_components/Card';
import React from 'react'
import { LocaleConfig, Calendar as Cal } from 'react-native-calendars';

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

const CardText = styled.Text`
    font-size: 13px;
    font-weight: 400;
`;

export default function Calendar() {
    const [state, setState] = useState(emptyCalendar())
    const [counter, setCounter] = useState(emptyDatasType())
    const [active, setActive] = useState(false)
    const [types, setTypes] = useState(false)
    const [activeindex, setActiveindex] = useState([])

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

    const curData2 = {
        id: 1,
        id_account: 1,
        date: '2023-03-01',
        name: 'Зарплата',
        type: '2',
        sum: 22000,
        comment: ''
    }

    const curData3 = {
        id: 1,
        id_account: 1,
        date: '2023-03-02',
        name: 'Зарплата',
        type: '2',
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

    const onClick = async (date:string) => {
        let newDat: calendar = JSON.parse(JSON.stringify(state));
        let dat = curData3;

        if (newDat.cards.length !== 0)
        {
            dat.type = types ? '1' : '2';
            dat.date = date;
            dat.id = newDat.cards[newDat.cards.length - 1].id + 1;
            newDat.cards.push(dat);
            await setData({fileName: path, data: newDat});
            // setCounter(reformat(JSON.parse(JSON.stringify(newDat))));

            setState(newDat);
            setCounter(JSON.parse(JSON.stringify(reformat(newDat))))
            console.log(date);
            
            // console.log(newDat);
            

        } else {
            console.log('Ошибка');
            dat.type = types ? '1' : '2';
            dat.date = date;
            dat.id = 1;
            newDat.cards = [dat];
            await setData({fileName: path, data: newDat});
            setState(newDat);
            setCounter(JSON.parse(JSON.stringify(reformat(newDat))))
            // console.log(newDat);
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
        console.log(date);
        
        console.log('mas = ', mas);
        console.log('active', active);
        
        
    }

    function reformat(item: DataType) {
        let datas: DatasType = {}
        for (let index = 0; index < item.cards.length; index++)
        {
            const itemType=  item.cards[index].type == '1' ? {key: `${item.cards[index].id}`, color: 'green'} : {key: `${item.cards[index].id}`, color: 'red'};
            datas[item.cards[index].date] == null ? datas[item.cards[index].date] = {dots: [itemType]} : datas[item.cards[index].date].dots.push(itemType)
        }
        // console.log('datas', datas);
        
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

    const x = 0
    return (
        <View style={{ backgroundColor:'#FFF', height: '100%'}}>
            <Header name='Calendar' style='1' functionLeft={() => {(types) ? setTypes(false) : setTypes(true)}} functionRight={() => {}}/>
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
                    onClick(day.dateString);
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'yyyy MM'}
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
                {return (
                    <Card onPress={()=>{}} key={index}>
                        <CardText>{state.cards[item].id}</CardText>
                        <CardText>{state.cards[item].date}</CardText>
                        <CardText>{state.cards[item].type}</CardText>
                        <CardText>{state.cards[item].sum} руб.</CardText>
                    </Card>
                )}
            })}
        </View>
    )}