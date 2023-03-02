import { Text, View } from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import Header from '../modular_components/Header';

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
  width: 311px;
  background: #FFFFFF;
  border: 1px solid #CECCCC;
  box-shadow: 0px 2px 48px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
`;


const ProgressBar = () =>(
  <Container>
    <Content/>
  </Container>
)

const KDetails = styled.View `
  width: 311px;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
`;

const Container = styled.View`
  margin: 10px 12px 0;
  width: "100%";
  border-radius: 16;
  align-items: flex-start;
  justify-content: center;
  height: 20px;
  background-color: #7D85FD;
  padding-horizontal: 3;
`;

const Content = styled.View`
  border-radius: 16;
  height: 20px;
  background-color: #0413E7;
  width: 40%;
`;

export default function PiggyBank() {
    return (
        <View>       
          <Scroll>
            <Header name='PyggyBank' style='1'/>
            <Kopilka>
              <KDetails><KTitle>Машина </KTitle><KMoney>12000/15000</KMoney></KDetails>
              <ProgressBar />
              <Text style = {{textAlign: 'center', marginTop:8,}}>До цели осталось ??? средств</Text>
            </Kopilka>  
          </Scroll>
        </View>
    )
}