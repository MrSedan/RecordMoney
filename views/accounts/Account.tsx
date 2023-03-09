import { Text, View } from "react-native";
import styled from "styled-components/native";

import Header from "../modular_components/Header";
import Card from "../modular_components/Card";
import { useCallback, useEffect, useState } from "react";
import { account, emptyAccount } from "../../models/interfaces";
import { useFocusEffect } from "@react-navigation/native";
import { getData, setData } from "../tools/iosys";


const ActiveIndicator = styled.View`
    background-color: #6FE6C2;
    height: 20px;
    width: 20px;
`
const InactiveIndicator = styled.View`
    background-color: #D9D9D9;
    height: 20px;
    width: 20px;
`

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

export default function Account(){
    const [state, setState] = useState(emptyAccount())
    const [counter, setCounter] = useState(0)

    const curData = {
        id: 1,
        name: 'Account name',
        sum: 123
    }

    useFocusEffect(
        useCallback(()=>{
            const onStart = async () => {
                let data: account = await getData({fileName: 'Account'});
                if (data === null) {
                    data = emptyAccount()
                    await setData({fileName: 'Account', data: data})
                }
                setState(data)
                setCounter(data.accounts.length)
            }
            onStart()

        },[])
    )
    
    const onClick = async () => {
        let newDat: account = JSON.parse(JSON.stringify(state))
        let dat = curData
        dat.id = newDat.accounts.length > 0 ? newDat.accounts[newDat.accounts.length-1].id+1 : counter
        newDat.accounts.push(dat)
        
        await setData({fileName: 'Account', data: newDat})
        setState(newDat)
        setCounter(counter+1)
    }

    const del = async (index: number) => {
        let newDat: account = JSON.parse(JSON.stringify(state))
        newDat.accounts.splice(index, 1)
        
        await setData({fileName: 'Account', data: newDat})
        setState(newDat)
    }
    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <Header name="Accounts" style="1" functionLeft={()=>{}} functionRight={onClick}/>
            <Scroll>
                <Container>
                    {state.accounts && (state.accounts.map((item, index)=>{
                        let c = counter
                        return (
                            <Card key={index} onPress={()=>{del(index)}}>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                        <ActiveIndicator/>
                                        <Text style={{marginLeft: 10}}>{item.name} {`${item.id}`}</Text>
                                    </View>
                                    <Text>{`${item.sum}`} руб.</Text>
                                </View>
                            </Card>
                        )
                    }))}
                </Container>
            </Scroll>
        </View>
    )
}