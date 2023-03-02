import { View } from 'react-native';
import styled from 'styled-components/native'
import React from 'react'
import { LocaleConfig, Calendar } from 'react-native-calendars';


export default function Content() {
  
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

  return (
    <View>
        <Calendar
      // Initially visible month. Default = now
      backgroundColor={'#fff'}
      // Минимальный день (не будет серым)
      minDate={'2022-01-01'}
      // Максимальный день (не будет серым)
      maxDate={'2026-01-01'}
      // действия при клике на дату
      onDayPress={day => {
        console.log('selected day', day.dateString);
      }}
      // Действие при долгом нажатии на дату
      onDayLongPress={day => {
        console.log('selected day', day.day);
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
  );
}