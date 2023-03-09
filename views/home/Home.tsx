import { Text, View, StyleSheet,FlatList, useWindowDimensions,Image} from 'react-native';
import { DonutChart } from "react-native-circular-chart";
import Header from '../modular_components/Header';
import styled from 'styled-components/native';
import Item from './Item';
import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { category, emptyCategories, emptyHistory, history} from '../../models/interfaces';
import { getData, setData } from '../tools/iosys';

const ButtonView = styled.View`
  display: flex;
  margin: 0px 20px 0px;
  flex-direction: row;
  max-width: 100%;
  justify-content: space-between;
`;

const ButtonHeader = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  background-color: #FDFDFD;
  border-radius: 100px;
  border: 1px solid #ABA5A5;
`;

const styles = StyleSheet.create({
    image: {
      width: 20,
      height: 20,
      resizeMode: 'contain'
    },
    TextInDiagramsfirst: {
      fontSize: 25,
      color: '#7D8895',
      fontWeight: '400',
    },
    TextInDiagramsSecond: {
      fontSize:40,
      color: '#000000',
    },
    ViewInDiagrams:{
      display: 'flex',
      alignItems:'center',
      justifyContent: 'center',
      height: 398,
      width: '100%',
      left: 0,
      position: 'absolute',
    },
   
  })

  
  
  const newCategory = {
    category_icon: 1,
    category_type: '1',
    value: 100,
    color: '#123311',
    id: 1,
    name : 'Новая категория',
  };


  const newHistory = {
    id: 1,
    id_account: 1,
    category: 1,
    date: "2023-03-03",
    sum: 100,
    comment: ""
    }
  interface categoryItem{
    category_id : number
    category_name : string
    category_icon : number
    category_type : string
    color : string
    value : number
  }

    const renderItem = ({ item }: { item: {id : number
        name : string
        category_icon : number
        category_type : string
        color : string
        value : number
    } }) => (
        <Item
          category_id={item.id}
          category_name={item.name}
          category_icon = {item.category_icon}
          category_type = {item.category_type}
          color = {item.color}
          value = {item.value}
        />
      );


  function calculateValues(categories: category , history: history): category {
    if (!categories.categories) return emptyCategories();
    if (categories.categories.length == 0) return emptyCategories(); 

    return {categories : [...categories.categories.map((categ) => {
        console.log("asdasd");
        let sum = 0.1
        if (history.history.length > 0){
          history.history.forEach((item)=> {
       
            if (item.category === categ.id){
                sum += item.sum 
            }
              
          })
        }
        console.log(sum);
        const cat ={
          id : categ.id,
          name: categ.name,
          category_icon: categ.category_icon,
          category_type: categ.category_type,
          color: categ.color,
          value: sum,
        }
        return cat
        })]
      }
    }

export default function Home() {
    const [numColumns, setNumColumns] = useState(2);
    const [dataItems, setDataItems] = useState(emptyCategories());
    const [datahistory, setDatahistory] = useState(emptyHistory())
    const [counter, setCounter] = useState(0)
    const [totalValue, setTotalValue] = useState(0)

    const {width, height} =useWindowDimensions();
    const PADDING = 8;
    const size = width < height ? width - 32 : height - 16;
    const strokeWidth = 25;
    const radius = (size - strokeWidth) / 2;

    useFocusEffect(
        useCallback(()=>{
            const onStart = async () => {
                let dataC: category = await getData({fileName: 'category'});
                let dataH: history = await getData({fileName: 'history'}); 
                if (dataC === null) {
                    dataC = emptyCategories()
                   
                    await setData({fileName: 'category', data: dataC})
                }
                if (dataH === null) {
                    dataH = emptyHistory()
                   
                    await setData({fileName: 'history', data: dataH})
                }
                setDataItems(calculateValues((JSON.parse(JSON.stringify(dataC))),(JSON.parse(JSON.stringify(dataH)))));
                setDatahistory(JSON.parse(JSON.stringify(dataH)))
                let sum = 0
                dataH.history.forEach((item)=>{sum += item.sum})
                setTotalValue(sum)
            }
            onStart()
        },[])
      )
      
      const handleAddCategory = async() => {
        
        let mama: category = JSON.parse(JSON.stringify(dataItems));
        let dat = newCategory;
        if (mama.categories.length !==0) {
            dat.id = mama.categories[mama.categories.length - 1].id + 1;
            console.log("ADDCATEHORY",dat.id);
            mama.categories.push(dat)

            await setData({fileName: "category", data: mama})
            
            setDataItems(mama)

        }
        else {
            dat.id = 1;
            mama.categories = [dat]
            await setData({fileName: "category", data: mama})
            setDataItems(mama)
            
        } 
        }; 

        const handleADDHistory = async() => {
        
            let mama: history = JSON.parse(JSON.stringify(datahistory));
            let dat = newHistory;
            if (mama.history.length !==0) {
                dat.id = mama.history[mama.history.length - 1].id + 1;
                console.log("ADD_dat.id",dat.id);
                
                dat.category = dataItems.categories[dataItems.categories.length - 1].id
                console.log("ADDHISTORY",dat.category);
                
                mama.history.push(dat)
    
                await setData({fileName: "history", data: mama})
    
                setDatahistory(mama)
    
            }
            else {
                dat.id = 1;
                mama.history = [dat]
                await setData({fileName: "history", data: mama})
                setDatahistory(mama)
                
            } 
            setDataItems(calculateValues(dataItems,mama))
            let sum = 0
                mama.history.forEach((item)=>{sum += item.sum})
                setTotalValue(sum)
            };

            return (
      
                <View style={{backgroundColor:'#fff', height: '100%', display: "flex", justifyContent: 'space-between' }}>
                    <Header name="Home" style='2' functionLeft={() => {}} functionRight={() => {}}/>
        
                    <View style= {{display: 'flex',alignItems: 'center', justifyContent: 'center'}} >
                     
                    {dataItems.categories.length > 0 && (
                      <DonutChart
                        data={dataItems.categories.filter((item)=>{
                          return item.value > 0
                        })}
                        strokeWidth={15}
                        radius={150}
                        containerWidth={width+15 - PADDING * 2}
                        containerHeight={200 * 2}
                        type="butt"
                        startAngle={0}
                        endAngle={360}
                        animationType="slide"
                      />
                      )}
                        <View style={styles.ViewInDiagrams}>
                          <Text style={styles.TextInDiagramsfirst}>
                              Текущий счет
                          </Text>
                            <Text style={styles.TextInDiagramsSecond}>
                              {totalValue}
                          </Text> 
                        </View>
                    </View>
                    <ButtonView>
                        <ButtonHeader onPress={handleADDHistory}>
                          <View >
                          <Image
                          source={require('../../assets/icon/Sorting.png')}
                          style={styles.image} />
                          </View>
                        </ButtonHeader>
                        <ButtonHeader onPress={handleAddCategory} >
                        <View >
                          <Image 
                          source={require('../../assets/icon/plus.png')}
                          style={styles.image}/>
                        </View>
                        </ButtonHeader>
                     
                    
                    </ButtonView>
        
                    <FlatList style={{display: 'flex', alignContent: 'flex-start'}}
                     
                     data={dataItems.categories }
                     renderItem={renderItem}
                     numColumns={numColumns}
                     keyExtractor={(item)=>{return item.id.toString()}}
                    />
                    
                </View>
            )
}

