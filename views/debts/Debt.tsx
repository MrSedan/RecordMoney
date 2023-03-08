import { Text, View } from 'react-native';
import Card from '../modular_components/Card';
import Header from '../modular_components/Header';
import styled from 'styled-components/native';
import { useCallback, useState } from 'react';
import { debt, emptyDebt } from '../../models/interfaces';
import { useFocusEffect } from '@react-navigation/native';
import { getData, setData } from '../tools/iosys';

const Scroll = styled.ScrollView`
    margin: 0;
    height: 100%;
    max-height: 100%;
`
const Container = styled.View`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`
const DebtToMe = styled.TouchableOpacity`
    border-width: 1px;
    border-style: solid;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-start: 0;
    width: 48%;
    border-radius: 5px;
`
const DebtFromMe = styled.TouchableOpacity`
    border-width: 1px;
    border-style: solid;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-start: 0;
    width: 48%;
    border-radius: 5px;
`

export default function Debt() {
    const [state, setState] = useState(emptyDebt())
    const [counter, setCounter] = useState(0)
    const [debtTome, setDebt] = useState(true)

    const curData = {
        id: 1,
        id_account: 1,
        name: 'Денис',
        contact: '88005553535',
        type: '2',
        sum: 2000,
        date: '12.01.2001',
        comment: ''
    }

    useFocusEffect(
        useCallback(()=>{
            const onStart = async () => {
                let data: debt = await getData({fileName: 'Debt'});
                if (data === null) {
                    data = emptyDebt()
                    await setData({fileName: 'Debt', data: data})
                }
                setState(data)
                setCounter(data.debts.length)
            }
            onStart()
        },[])
    )
    
    const onClick = async () => {
        let newDat: debt = JSON.parse(JSON.stringify(state))
        let dat = curData
        dat.id = counter
        dat.type = debtTome ? '1' : '2'
        newDat.debts.push(dat)
        
        await setData({fileName: 'Debt', data: newDat})
        setState(newDat)
        setCounter(counter+1)
    }

    const del = async (index: number) => {
        let newDat: debt = JSON.parse(JSON.stringify(state))
        newDat.debts.splice(index, 1)
        
        await setData({fileName: 'Debt', data: newDat})
        setState(newDat)
    }

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <Header name='Debt' style='1' functionLeft={()=>{}} functionRight={onClick}/>
            <View style={{margin: 5, flex: 1, flexDirection: 'row', marginBottom: 40, justifyContent: 'space-around'}}>
                <DebtToMe onPress={()=>{setDebt(true)}} style={{borderColor: debtTome? '#3FDEAE': '#C9C9C9'}}><Text style={{color: debtTome? '#3FDEAE': '#C9C9C9', fontSize: 19}}>Должны мне</Text></DebtToMe>
                <DebtFromMe onPress={()=>{setDebt(false)}} style={{borderColor: !debtTome? '#3FDEAE': '#C9C9C9'}}><Text style={{color: !debtTome? '#3FDEAE': '#C9C9C9', fontSize: 19}}>Должен я</Text></DebtFromMe>
            </View>
            <Scroll>
                <Container>
                    {state.debts.map((item,index)=>{
                        if (debtTome && item.type == '1' || item.type == '2' && !debtTome)
                        {return (
                            <Card key={index} onPress={()=>{del(index)}}>
                                <View style={{flex: 1, flexDirection: 'column'}}>
                                    <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                                        <Text>{item.name} {`${item.id}`}</Text>
                                        <Text>{item.date}</Text>
                                        <Text>{`${item.sum}`} руб.</Text>
                                    </View>
                                    <Text>{item.contact}</Text>
                                </View>
                            </Card>
                        )}
                    })}
                </Container>
            </Scroll>
        </View>
    )
}