import { Alert, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import Header from '../modular_components/Header';
import { emptyPiggyBank, piggyBank } from '../../models/interfaces';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getData, setData } from '../tools/iosys';
import Card from '../modular_components/Card';
import ModalWindowOneButton from '../modular_components/ModalWindowOneButton';
import Input from '../modular_components/Input';
import ModalWindowOneButtonCopy from '../modular_components/ModalWindowOneButtonCopy';

const Scroll = styled.ScrollView`
  heigth: 100%;
`;

const ButtonType = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 48%;
    border-radius: 5px;
    border: 1px solid #C6C3C3;
`;

const ButtonTypeText = styled.Text`
    font-size: 15px;
`;

const ButtonTypeView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin: 44px 0;
    max-width: 100%;
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
  margin-bottom: 5%;
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
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activeModalButton, setActiveModalButton] = useState(true)
  const [text, setText] = useState(['','','',' '])
  const [editing, setEditing] = useState({ editing: false, index: 0 });


  const curData = {
    id: 1,
    id_account: 1,
    name: 'Билет в Москву',
    sum_max: 30000,
    sum_cur:20000,
    status:false,
  }

  const openEdit = (index: number) => {
    setText([state.piggyBanks[index].name, state.piggyBanks[index].sum_max.toString()]);
    setVisible(true);
    setEditing({ editing: true, index: index });
};

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
    dat.name = text[0]
    dat.sum_max = +text[1];
    dat.sum_cur = 0;
    dat.status = false;
    dat.id = NewDat.piggyBanks.length > 0 ? NewDat.piggyBanks[NewDat.piggyBanks.length-1].id+1 : counter
    NewDat.piggyBanks.push(curData);
    await setData({fileName:'PiggyBank', data: NewDat});
    setText(['', ''])
    setState(NewDat)
    setCounter(counter+1)
    setVisible(false);
  }

  const del = async (index: number) => {
    let newDat: piggyBank = JSON.parse(JSON.stringify(state))
    newDat.piggyBanks.splice(index, 1)
    await setData({fileName: 'PiggyBank', data: newDat})
    setState(newDat)
    
}

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
          <ModalWindowOneButton functionCancelButton={() => {setText(['',''])}} functionSaveButton={() => {click(), setVisible(false)}} visible={visible} setVisible={setVisible} windowName='Создание долга'>
                <Input textName='Название' value={text[0].toString()} setItems={setText} index={0} placeholder='Введите название долга' keyboardType="default" colorActiveInput={(activeModalButton) ? '#3EA2FF' : '#FF6E6E'}/>
                <Input textName='Сумма' value={text[1].toString()} setItems={setText} index={1} placeholder='Введите сумму' keyboardType="numeric" colorActiveInput={(activeModalButton) ? '#3EA2FF' : '#FF6E6E'}/>
            </ModalWindowOneButton> 
            <Header name='PyggyBank' style='1' functionLeft={()=>{}} functionRight={() => {setVisible(true); setActiveModalButton(true)}}/>
              <Scroll>
                <Container>
                <ButtonTypeView>
                        <ButtonType onPress={() => setActive(false)} style={!active? {borderColor:'#3FDEAE'}: {borderColor:'#C9C9C9'}}>
                            <ButtonTypeText style={!active? {color:'#3FDEAE'}: {color:'#C9C9C9'}}>Активные</ButtonTypeText>
                        </ButtonType>
                        <ButtonType onPress={() => setActive(true)} style={active? {borderColor:'#3FDEAE'}: {borderColor:'#C9C9C9'}}>
                            <ButtonTypeText style={ {color: active? '#3FDEAE': '#C9C9C9'} }>Закрытые</ButtonTypeText>
                        </ButtonType>
                    </ButtonTypeView>
                    {state.piggyBanks && (state.piggyBanks.filter((item)=>{
                        return active && item.status == true || item.status == false && !active
                    }).map((item,index)=>{
                    return (
                        <Kopilka key={index}>
                            <KDetails><KTitle>{item.name}</KTitle><KMoney>{`${item.sum_cur}`}/{`${item.sum_max}`}</KMoney></KDetails>
                            <ProgressBar weight1={`${+item.sum_cur/+item.sum_max*100}%`}/>
                            <Text style = {{textAlign: 'center', marginTop:8,}}>До цели осталось {+item.sum_max-+item.sum_cur} средств</Text>
                            <TouchableOpacity  key={index} onPress={()=>{del(index)}}><Text>УДАЛИТЬ</Text></TouchableOpacity>
                            <TouchableOpacity  key={index} onPress={()=>{}}><Text>ДОБАВИТЬ</Text></TouchableOpacity>
                            <TouchableOpacity  key={index} onPress={()=>{}}><Text>РЕДАКТИРОВАТЬ</Text></TouchableOpacity>
                        </Kopilka>
                      )}))}  
                </Container> 
              </Scroll>  
          </View>
        
    )
}