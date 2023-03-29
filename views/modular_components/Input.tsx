import React, { useState, Dispatch, SetStateAction } from 'react';
import { KeyboardTypeOptions } from 'react-native';
import styled from 'styled-components/native';

const BoxView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 15px 30px;
    max-width: 100%;
    
`;

const TextName = styled.Text`
    font-family: 'MainFont-Regular';
    text-align: center;
    width: 33%;
    margin-right: 1%;
    padding-bottom: 2px;
    align-self: flex-end;
    font-size: 14px;
`;

const InputText = styled.TextInput`
    text-align: left;
    align-self: flex-end;
    width: 100%;
    
`;

const BoxInput = styled.View`
    padding-left: 19px
    width: 66%;
`;

/** 
 * Компонент для отрисовки поля названия инпута (слева) и самого инпута, 
 * фича в том, что во все инпуты можно запихивать определенные элемента массива 
 * @param props textName - название поля что слева, value - место для ловли значений (например состояние), index - индекс элемента массива placegolder - прозрачный текст (подсказка на самом инпуте), keyboardType - тип клавиатуры при вводе текста, colorActiveInput - цвет подчеркивания при вводе текста, setValue - функция по смене состояния смотреть в примере
 * @example ```ts
 * const [text, onChangeText] = useState(['', ''])
 * <Input textName='Название' value={text[0].toString()} setItems={setText} index={0} placeholder='Введите название операции' keyboardType="default" colorActiveInput={(activeModalButton) ? '#3EA2FF' : '#FF6E6E'}/>
 * ```
 * @param KeyboardType: {default - классическая клавиатура, 
 *                   numeric - цифры с знаками +, -, *, (, ), #, 
 *                   email-address - классическая клавиатура только внизу вместо запятой будет собака, 
 *              }
 * 
*/
const Input = (props: {len?: number, textName: string, value: string, index: number, placeholder: string, keyboardType: KeyboardTypeOptions, colorActiveInput: string, setItems: Dispatch<SetStateAction<string[]>>}) => {
  const [active, setActive] = useState(false);

  const setValue = (newValue: string) => {
    props.setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[props.index] = newValue;
      return newItems;
    });
  };

  return (
      <BoxView>
        <TextName>{props.textName}</TextName>
        <BoxInput
          style={
            !active
              ? {
                  borderBottomColor: '#C6C3C3',
                  borderBottomWidth: 1
                }
              : {
                  borderBottomColor: props.colorActiveInput,
                  borderBottomWidth: 1
                }
          }>
          <InputText
            onChangeText={setValue}
            value={props.value}
            placeholder={props.placeholder}
            keyboardType={props.keyboardType}
            onFocus={() => setActive(true)}
            onEndEditing={() => setActive(false)}
            maxLength={props.len || 20}
          />
        </BoxInput>
      </BoxView>
  );
};

export default Input;