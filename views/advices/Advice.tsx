import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import styled from 'styled-components/native';
import { emptyAccHistory, emptyDebt, emptyPiggyBank } from '../../models/interfaces';
import { getData, removeAllData, setData } from '../tools/iosys';

const StatContainer = styled.View`
    margin: 10% 2%;
    background-color: #fff;
    border: 1px solid #3fdeae;
    border-radius: 20px;
    padding: 5%;
    display: flex;
    flex-direction: column;
`;

const TextRow = styled.View`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    margin: 5px 0;
`;

const StatName = styled.Text`
    font-family: 'MainFont-Regular';
    font-size: 15px;
`;

const ResetButton = styled.TouchableOpacity`
    margin: 10px 0 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 10px 0;
    border-radius: 15px;
    border: 1px solid #ff6e6e;
`;

export default function Advice() {
    const [history, setHistory] = useState(emptyAccHistory());
    const [debt, setDebt] = useState(emptyDebt());
    const [pig, setPig] = useState(emptyPiggyBank());

    const onStart = async () => {
        let data = await getData({ fileName: 'AccountHistory' });
        if (data === null) {
            data = emptyAccHistory();
            await setData({ fileName: 'AccountHistory', data });
        }
        setHistory(data);
        data = await getData({ fileName: 'Debt' });
        if (data === null) {
            data = emptyDebt();
            await setData({ fileName: 'Debt', data });
        }
        setDebt(data);
        data = await getData({ fileName: 'PiggyBank' });
        if (data === null) {
            data = emptyPiggyBank();
            await setData({ fileName: 'PiggyBank', data });
        }
        setPig(data);
    };
    useFocusEffect(
        useCallback(() => {
            onStart();
        }, []),
    );

    const tryToReset = async () => {
        Alert.alert('Внимание!', 'Все данные приложения будут удалены. Вы согласны с этим?', [
            {
                text: 'Да',
                onPress: async () => {
                    await removeAllData();
                    onStart();
                },
            },
            {
                text: 'Нет',
            },
        ]);
    };

    return (
        <View style={{ backgroundColor: '#fff', height: '100%' }}>
            <StatContainer>
                <TextRow>
                    <StatName>Всего расходов:</StatName>
                    <Text style={{ fontFamily: 'MainFont-Bold', fontSize: 15 }}>
                        {history.accHistory.length > 0 &&
                            history.accHistory
                                .filter((item) => item.type == '2')
                                .reduce((a, b) => a + Math.abs(b.sum), 0)
                                .toString()}
                        {history.accHistory.length == 0 && '0'} руб.
                    </Text>
                </TextRow>
                <TextRow>
                    <StatName>Всего доходов:</StatName>
                    <Text style={{ fontFamily: 'MainFont-Bold', fontSize: 15 }}>
                        {history.accHistory.length > 0 &&
                            history.accHistory
                                .filter((item) => item.type == '1')
                                .reduce((a, b) => a + Math.abs(b.sum), 0)
                                .toString()}
                        {history.accHistory.length == 0 && '0'} руб.
                    </Text>
                </TextRow>
                <TextRow>
                    <StatName>Закрыто долгов: </StatName>
                    <Text style={{ fontFamily: 'MainFont-Bold', fontSize: 15 }}>
                        {history.accHistory.filter((item) => item.page == 'debt').length.toString()}
                    </Text>
                </TextRow>
                <TextRow>
                    <StatName>Закрыто целей: </StatName>
                    <Text style={{ fontFamily: 'MainFont-Bold', fontSize: 15 }}>
                        {pig.piggyBanks.filter((item) => item.status == true).length.toString()}
                    </Text>
                </TextRow>
                <TextRow>
                    <StatName>Вы должны: </StatName>
                    <Text style={{ fontFamily: 'MainFont-Bold', fontSize: 15 }}>
                        {debt.debts.length > 0 &&
                            debt.debts
                                .filter((item) => item.type == '2')
                                .reduce((a, b) => a + b.sum, 0)
                                .toString()}
                        {debt.debts.length == 0 && '0'} руб.
                    </Text>
                </TextRow>
                <TextRow>
                    <StatName>Вам должны: </StatName>
                    <Text style={{ fontFamily: 'MainFont-Bold', fontSize: 15 }}>
                        {debt.debts.length > 0 &&
                            debt.debts
                                .filter((item) => item.type == '1')
                                .reduce((a, b) => a + b.sum, 0)
                                .toString()}
                        {debt.debts.length == 0 && '0'} руб.
                    </Text>
                </TextRow>
                <ResetButton onPress={tryToReset}>
                    <Text style={{ fontFamily: 'MainFont-Bold', fontSize: 15, color: '#FF6E6E' }}>
                        Удалить все данные
                    </Text>
                </ResetButton>
            </StatContainer>
        </View>
    );
}
