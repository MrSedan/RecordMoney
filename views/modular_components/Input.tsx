import { useState } from "react";
import { TouchableWithoutFeedback, KeyboardTypeOptions, Keyboard } from "react-native";
import styled from 'styled-components/native';

const BoxView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    // align-items: center;
    margin: 0 15px 30px;
    max-width: 100%;
    
`;

const TextName = styled.Text`
    text-align: center;
    width: 33%;
    margin-right: 1%;
    padding-bottom: 2px;
    align-self: flex-end;
    font-size: 15px;
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
 * Компонент для отрисовки поля названия инпута (слева) и самого инпута
 * @param props textName - название поля что слева, value - место для ловли значений (например состояние), placegolder - прозрачный текст (подсказка на самом инпуте), keyboardType - тип клавиатуры при вводе текста, colorActiveInput - цвет подчеркивания при вводе текста, setValue - функция по смене состояния смотреть в примере
 * @example ```ts
 * const [text, onChangeText] = useState('')
 * <Input textName='Дата закрытия' value={text} setValue={onChangeText} placegolder="text PLs" keyboardType="default" colorActiveInput='#FF5959'/>
 * ```
 * @param KeyboardType: {default - классическая клавиатура, 
 *                   numeric - цифры с знаками +, -, *, (, ), #, 
 *                   email-address - классическая клавиатура только внизу вместо запятой будет собака, 
 *              }
 * 
*/
export default function Input(props: {textName: string, value: string, placegolder: string, keyboardType: KeyboardTypeOptions, colorActiveInput: string, setValue: React.Dispatch<React.SetStateAction<string>>}) {
    const [active, setActive] = useState(false)
    return (
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
        <BoxView>
            <TextName>{props.textName}</TextName>
            <BoxInput style={(!active) ? 
                                {
                                    borderBottomColor: '#C6C3C3',
                                    borderBottomWidth: 1,
                                }
                                :
                                {
                                    borderBottomColor: `${props.colorActiveInput}`,
                                    borderBottomWidth: 1,
                                }
                            }>
                <InputText 
                    onChangeText={props.setValue} 
                    value={props.value} 
                    placeholder={props.placegolder}
                    keyboardType={props.keyboardType}
                    style={{borderBottomColor: '#000'}}
                    onFocus={() => {setActive(true)}}
                    onEndEditing={() => {setActive(false)}}
                />
            </BoxInput>
        </BoxView>
    </TouchableWithoutFeedback>
    )
}