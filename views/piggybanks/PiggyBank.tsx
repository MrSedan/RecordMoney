import { Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import Header from '../modular_components/Header';
import { emptyPiggyBank, piggyBank } from '../../models/interfaces';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getData, setData } from '../tools/iosys';
import Card from '../modular_components/Card';

const Scroll = styled.ScrollView`
  heigth: 100%;
`;

const KTitle = styled.Text`
  margin-top:15px;
  margin-left: 25px;
  font-weight: 400;
  font-size: 15px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 1px;
  color: #000000;
`;

const KMoney = styled.Text`
  margin-top:15px;
  margin-right:25px;
  font-weight: 400;
  font-size: 15px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 1px;
  color: #000000;
`;

const Kopilka = styled.View`
  display: flex;
  margin: 0 auto;
  margin-top: 49px;
  width: 90%;
  background: #FFFFFF;
  border: 1px solid #CECCCC;
  box-shadow: 0px 2px 48px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  padding: 5px;
`;

const Container = styled.View`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;`

const KDetails = styled.View `
  width: 311px;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
`;

const FullBar = styled.View`
  // margin: 10px 1px 0;
  margin-top: 10px;
  width: 100%;
  border-radius: 16px;
  align-items: flex-start;
  justify-content: center;
  height: 20px;
  background-color: #7D85FD;
  /* padding-horizontal: 3px;*/
`;

const Content = styled.View`
  border-radius: 16px;
  height: 20px;
  background-color: #0413E7;
  width: 40%;
`;



function ProgressBar( props:{weight1: string}){
  return (
    <FullBar>
      <Content style = {{width:` ${props.weight1}`}}/>
    </FullBar>
  )
  }


export default function PiggyBank() {
  const [state, setState] = useState(emptyPiggyBank())
  const [counter, setCounter] = useState(0)

  const curData = {
    id: 1,
    id_account: 1,
    name: 'Билет в Москву',
    sum_max: 30000,
    sum_cur:20000,
    status:false,
  }

  useFocusEffect(
    useCallback(()=>{
      const search = async()=>{
        let data: piggyBank = await getData({fileName: 'PiggyBank'});
        
        if (data === null)
        {
          await setData({fileName:'PiggyBank', data:emptyPiggyBank()})
          data = emptyPiggyBank()
        }
        setState(data)
        setCounter(data.piggyBanks.length)
      }
      search()
    },[])
  )

  const click = async ()=>{
    let NewDat: piggyBank = await getData({fileName:'PiggyBank'});
    let dat = curData
    dat.id = NewDat.piggyBanks.length > 0 ? NewDat.piggyBanks[NewDat.piggyBanks.length-1].id+1 : counter
    NewDat.piggyBanks.push(curData);
    await setData({fileName:'PiggyBank', data: NewDat});
    setState(NewDat)
    setCounter(counter+1)
  }

  const del = async (index: number) => {
    let newDat: piggyBank = JSON.parse(JSON.stringify(state))
    newDat.piggyBanks.splice(index, 1)
    await setData({fileName: 'PiggyBank', data: newDat})
    setState(newDat)
    
}

    return (
      
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>  
            <Header name='PyggyBank' style='1' functionLeft={()=>{}} functionRight={click}/>
              <Scroll>
                <Container>
                  {state.piggyBanks && (state.piggyBanks.map((item, index)=> { 
                    let c = counter 
                    return (
                        <TouchableOpacity  key={index} onPress={()=>{del(index)}}>
                        <Kopilka>
                            <KDetails><KTitle>{item.name}</KTitle><KMoney>{`${item.sum_cur}`}/{`${item.sum_max}`}</KMoney></KDetails>
                            <ProgressBar weight1={`${+item.sum_cur/+item.sum_max*100}%`}/>
                            <Text style = {{textAlign: 'center', marginTop:8,}}>До цели осталось {+item.sum_max-+item.sum_cur} средств</Text>
                        </Kopilka>
                        </TouchableOpacity>
                      )}))}  
                </Container> 
              </Scroll>  
          </View>
        
    )
}