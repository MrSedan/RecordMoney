import React, { Dispatch, SetStateAction, useState } from 'react';
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

export default function ImputContact(props: {
    functionConctact: Function;
    textName: string;
    value: string;
    placeholder: string;
    keyboardType: KeyboardTypeOptions;
    colorActiveInput: string;
    setValue: Dispatch<SetStateAction<string>>;
}) {
    const [active, setActive] = useState(false);

    return (
        <BoxView>
            <TextName>{props.textName}</TextName>
            <BoxInput
                style={{
                    borderBottomColor: !active ? '#C6C3C3' : props.colorActiveInput,
                    borderBottomWidth: 1,
                }}
            >
                <InputText
                    onChangeText={props.setValue}
                    value={props.value}
                    placeholder={props.placeholder}
                    keyboardType={props.keyboardType}
                    onFocus={() => {
                        setActive(true);
                        props.functionConctact();
                    }}
                    onEndEditing={() => setActive(false)}
                />
            </BoxInput>
        </BoxView>
    );
}
