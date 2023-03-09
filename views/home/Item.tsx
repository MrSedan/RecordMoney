import React from 'react';
import styled from 'styled-components/native';
import { View, Text, StyleSheet } from 'react-native';

type ItemProps = {
  category_id: number,
  category_name: string,
  category_icon: Number,
  category_type: string,
  color: string,
  value: number,
}

const CardZAD = styled.View`
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;
  
  width: 50%;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 10px 0px 2px 0px;
`;

const FlatListsss = styled.View`
display: flex;
flex-direction: column;
width: 170px;
height: 90px;
border: 1px solid #FAFAFA;
border-radius: 20px;
background-color: #FAFAFA;
padding: 10px;

margin: 5px;
`;


const Item = ({ category_id, category_name,value}: ItemProps) => {
  return (
    <CardZAD>
       <FlatListsss>
        <Text >{category_name}</Text>
        <Text >{value-0.1}</Text>
        <Text> Прочее</Text>
      </FlatListsss>
    </CardZAD>
  );
};



export default Item;