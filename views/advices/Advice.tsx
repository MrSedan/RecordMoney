import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, Alert, Modal, Button } from 'react-native';
import styled from 'styled-components/native';
import {
    emptyAccHistory,
    emptyDebt,
    emptyPiggyBank,
    accountHistory,
} from '../../models/interfaces';
import { getData, removeAllData, setData } from '../tools/iosys';
import { LineChart } from 'react-native-chart-kit';
import Trash from '../../assets/icon/Trash.svg';
import CalendarBlack from '../../assets/icon/CalanderBlack.svg';
import WalletBlack from '../../assets/icon/WalletBlack.svg';
import Accounts from '../../assets/icon/Accounts.svg';

const StatContainer = styled.View`
    margin: 40px 2% 10%;
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
    background-color: #ff6e6e;
    padding: 10px 0;
    border-radius: 15px;
    border: 2px solid #000;
`;
const ButtonGrafic = styled.TouchableOpacity`
    
    border-style: solid;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-start: 0;
    width: 30%;
`;
const Scroll = styled.ScrollView`
    heigth: 100%;
`;

const ContainerButton = styled.View`
    justify-content: space-evenly;
    flex-direction: row;
`;


export default function Advice() {
    const [history, setHistory] = useState(emptyAccHistory());
    const [debt, setDebt] = useState(emptyDebt());
    const [pig, setPig] = useState(emptyPiggyBank());
    const [Histogrammdata, setHistogrammdata] = useState<number[]>([]);
    const [HistogrammLabels, setHistogrammLabels] = useState<string[]>([]);
    const [visible1, setVisibe1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [visible4, setVisible4] = useState(false);

    const onStart = async () => {
        let data = await getData({ fileName: 'AccountHistory' });
        let datas: accountHistory = await getData({ fileName: 'AccountHistory' });
        if (data === null) {
            data = emptyAccHistory();
            await setData({ fileName: 'AccountHistory', data });
        }
        const filteredData = datas.accHistory.filter((item) => item.page === 'calendar');
        const filteredDatas = datas.accHistory.filter((item) => item.page === 'debt');
        if (filteredData.length > 0) setVisible3(true);

        if (filteredDatas.length > 0) setVisible4(true);
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
                    setVisible3(false);
                    setVisible4(false);
                },
            },
            {
                text: 'Нет',
            },
        ]);
    };

    const GraficCalendar = async () => {
        let data: accountHistory = await getData({ fileName: 'AccountHistory' });
        const filteredData = data.accHistory.filter((item) => item.page === 'calendar');
        const sum = filteredData.map((item) => item.sum);
        setHistogrammdata(sum);
        const labels = filteredData.map((item) => {
            const timestamp = Number(item.date);
            const date = new Date(timestamp);
            const dates = date
                .toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    year: '2-digit',
                    month: '2-digit',
                })
                .split('/');
            const day = dates[1];
            const month = dates[0];
            const year = dates[2];
            return [day, month, year].join('.');
        });
        setHistogrammLabels(labels);
        setVisibe1(true);
    };

    const GraficDebt = async () => {
        let data: accountHistory = await getData({ fileName: 'AccountHistory' });
        const filteredData = data.accHistory.filter((item) => item.page === 'debt');
        const sum = filteredData.map((item) => item.sum);
        setHistogrammdata(sum);
        const labels = filteredData.map((item) => {
            const timestamp = Number(item.date);
            const date = new Date(timestamp);
            const dates = date
                .toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    year: '2-digit',
                    month: '2-digit',
                })
                .split('/');
            const day = dates[1];
            const month = dates[0];
            const year = dates[2];
            return [day, month, year].join('.');
        });
        setHistogrammLabels(labels);
        setVisible2(true);
    };

    return (
        <View style={{ backgroundColor: '#fff', height: '100%' }}>
            <Modal
                visible={visible2}
                animationType='slide'
                onRequestClose={() => setVisible2(false)}
            >
                <LineChart
                    data={{
                        labels: HistogrammLabels,
                        datasets: [
                            {
                                data: Histogrammdata,
                            },
                        ],
                    }}
                    width={410} // from react-native
                    height={320}
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundGradientFrom: '#1E2923',
                        backgroundGradientTo: '#08130D',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
                <Button
                    title='Закрыть'
                    onPress={() => {
                        setVisible2(false);
                    }}
                ></Button>
            </Modal>
            <Modal
                visible={visible1}
                animationType='slide'
                onRequestClose={() => setVisibe1(false)}
            >
                <LineChart
                    data={{
                        labels: HistogrammLabels,
                        datasets: [
                            {
                                data: Histogrammdata,
                            },
                        ],
                    }}
                    width={410} // from react-native
                    height={320}
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundGradientFrom: '#1E2923',
                        backgroundGradientTo: '#08130D',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
                <Button
                    title='Закрыть'
                    onPress={() => {
                        setVisibe1(false);
                    }}
                ></Button>
            </Modal>
            <Scroll>
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
                            {history.accHistory
                                .filter((item) => item.page == 'debt')
                                .length.toString()}
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
                        <Trash
                        width={40}
                        height={40}
                        color={'#FF6E6E'}
                        />
                    </ResetButton>
                </StatContainer>
               <ContainerButton>
                {visible3 && (
                        
                        <ButtonGrafic onPress={GraficCalendar} style = {{backgroundColor: '#f7c183'}}>
                            <CalendarBlack
                                width={33}
                                height={33}
                            />
                            <Text
                                style={{
                                    fontFamily: 'MainFont-Bold',
                                    fontSize: 15,
                                    
                                }}
                            >
                                Календарь
                            </Text>
                        </ButtonGrafic>
                      
                )}
                {visible4 && (
                   
                    <ButtonGrafic onPress={GraficDebt} style = {{backgroundColor: '#3FDEAE'}}>
                        <WalletBlack
                            width={33}
                            height={33}
                        />
                    <Text
                        style={{
                            fontFamily: 'MainFont-Bold',
                            fontSize: 15,
                            
                        }}
                    >
                        Долги
                    </Text>
                </ButtonGrafic>
                
                )}
                <ButtonGrafic onPress={() => {Alert.alert('Данная функция будет добавлена в обновлениях')}} style = {{backgroundColor: '#9966cc'}}>
                    <Accounts
                        width={33}
                        height={33}
                    />
                    <Text
                        style={{
                            fontFamily: 'MainFont-Bold',
                            fontSize: 15,
                            
                            
                        }}
                    >
                        Счета
                    </Text>
                </ButtonGrafic>
                
                </ContainerButton>
            </Scroll>
        </View>
    );
}
