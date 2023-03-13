
// импорт необходимых библиотек и компонентов


import { Text, View, StyleSheet,FlatList, useWindowDimensions,Image, Animated} from 'react-native';
import DonutChart from './CustomDonutChart';
import Header from '../modular_components/Header';
import styled from 'styled-components/native';
import Item from './Item';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { category, emptyCategories, emptyHistory, history} from '../../models/interfaces';
import { getData, setData } from '../tools/iosys';
import ModalWindowCategoryList from './ModalWindowCategory';
import Input from '../modular_components/Input';
import ModalWindow from '../modular_components/ModalWindow';

//////////////////////////////////////////////////////////////////////

//   стили
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


const HeaderView = styled.View`
  border-width: 1px;
  border-style: solid;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-start: 0;
  width: 80%;
  border-radius: 5px;
  margin-left: 10%;
  marginBottom: 5%;
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
    category_type: 'Расход',
    value: 0,
    color: '#6623',
    id: 1,
    name : 'ляпота',
  };


  const newHistory = {
    id: 1,
    id_account: 1,
    category: 3,
    date: "2023-03-03",
    sum: -100,
    comment: ""
    }

//////////////////////////////// 


// render item  and category




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


//////////////////////////////// 



// summation of transactions by category

  function calculateValues(categories: category , history: history): category {
    if (!categories.categories) return emptyCategories();
    if (categories.categories.length == 0) return emptyCategories(); 

    return {categories : [...categories.categories.map((categ) => {
        
        let sum = 0
        if (history.history.length > 0){
          history.history.forEach((item)=> {
       
            if (item.category === categ.id){
              
              sum += item.sum 
            }
              
          })
        }
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


////////////////////////////////



// basic function 
export default function Home() {
    const [numColumns, setNumColumns] = useState(2);
    const [dataItems, setDataItems] = useState(emptyCategories());
    const [datahistory, setDatahistory] = useState(emptyHistory())
    const [counter, setCounter] = useState(0)
    const [totalValue, setTotalValue] = useState(0)
    const [activeModalButton, setActiveModalButton] = useState(true)
    const [text, setText] = useState(['','','',''])
    const [visible, setVisible] = useState(false)
    const [VisibleAddCategory, setVisibleAddCategory] = useState(false)
    const [activeModalButtonAddCategory, setActiveModalButtonAddCategory] = useState(true)


    const {width, height} =useWindowDimensions();
    const PADDING = 8;
    const size = width < height ? width - 32 : height - 16;
    const strokeWidth = 25;
    const radius = (size - strokeWidth) / 2;
    const data = [0];
    const EXPENSE_CATEGORY_TYPE = 'Расход';



    // при загрузге раздела 
    useFocusEffect(
        useCallback(()=>{
            const onStart = async () => {
                let dataC: category = await getData({fileName: 'category'});
                let dataH: history = await getData({fileName: 'history'}); 
                Animated.timing(animateContainerOpacity, {
                  toValue: 1,
                  duration: 1000,
                  useNativeDriver: true,
                }).start();
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
////////////////////////////////


// кнопки для присвоения       
      const handleAddCategory = async() => {
        const maxid = 10
        let mama: category = JSON.parse(JSON.stringify(dataItems));
        let dat = newCategory;

        if (dat.id > maxid) {
          alert(`Cannot add category with ID greater than 11`);
          return;
      }

        if (mama.categories.length !==0) {
            dat.id = mama.categories[mama.categories.length - 1].id + 1;
            dat.color = text[0];
            dat.name = text[1];
            dat.category_type = activeModalButtonAddCategory ? 'Доход' : 'Расход';
            dat.category_icon = 1;
            dat.value = 0;

            mama.categories.push(dat)

            await setData({fileName: "category", data: mama})
            setText(['', '', '', ''])
            setDataItems(mama)

        }
        else {
            dat.id = 1;
            dat.color = text[0];
            dat.name = text[1];
            dat.category_type = activeModalButtonAddCategory ? 'Доход' : 'Расход';
            dat.category_icon = 1;
            dat.value = 0;
            mama.categories = [dat]
            await setData({fileName: "category", data: mama})
            setText(['', '', '', ''])
            setDataItems(mama)
            
        } 
  
        
        }; 

        const handleADDHistory = async() => {
        
            let mama: history = JSON.parse(JSON.stringify(datahistory));
            let dat = newHistory;
            if (mama.history.length !==0) {
                dat.id = mama.history[mama.history.length - 1].id + 1;

                
               
                
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

            
            // распределение по расходом и категориям 
              const incomeItems = dataItems.categories.filter(
                item => item.category_type !== EXPENSE_CATEGORY_TYPE
              );
              const expenseItems = dataItems.categories.filter(
                item => item.category_type === EXPENSE_CATEGORY_TYPE
              );
            ////////////////////////////////////////////
            const animateContainerOpacity = useRef(new Animated.Value(0)).current;
            return (
      
                <View style={{backgroundColor:'#fff', height: '100%', display: "flex", justifyContent: 'space-between' }}>

                <ModalWindow functionCancelButton={() => {setText(['','','',''])}} functionSaveButton={() => {handleAddCategory ()}} visible={VisibleAddCategory} setVisible={setVisibleAddCategory} buttonTextLeft='Доход' buttonTextRight='Расход' activeModalButton={activeModalButtonAddCategory} setActiveModalButton={setActiveModalButtonAddCategory} colorActiveLeft='#3EA2FF' colorActiveRight='#FF6E6E'>
                  <Input textName='цвет' value={text[0].toString()} setItems={setText} index={0} placeholder='Введите цвет' keyboardType="default" colorActiveInput={(activeModalButtonAddCategory) ? '#3EA2FF' : '#FF6E6E'}/>
                  <Input textName='Название' value={text[1].toString()} setItems={setText} index={1} placeholder='Введите название категории' keyboardType="default" colorActiveInput={(activeModalButtonAddCategory) ? '#3EA2FF' : '#FF6E6E'}/>
                  </ModalWindow>






                    <ModalWindowCategoryList  functionRightPlus={() => {setVisibleAddCategory(true); setActiveModalButtonAddCategory(true)}} visible={visible} setVisible={setVisible} buttonTextLeft='Доход' buttonTextRight='Расход' activeModalButton={activeModalButton} setActiveModalButton={setActiveModalButton} colorActiveLeft='#3EA2FF' colorActiveRight='#FF6E6E'>
                    {activeModalButton ? (
                      // Вкладка "Доход"
                      <View>
                        <FlatList
                          data={incomeItems}
                          renderItem={({item}) => <HeaderView><Text>{item.name}</Text></HeaderView>}
                        />
                      </View>
                    ) : (
                      // Вкладка "Расход"
                      <View>
                        {expenseItems.map((category) => (
                          <View key={category.id}>
                            <HeaderView>
                            <Text>{category.name}</Text>
                            </HeaderView>
                          </View>
                        ))}
                      </View>
                    )}
                    </ModalWindowCategoryList>




                    <Header name="Home" style='2' functionLeft={() => {}} functionRight={() => {}}/>
        
                    <View style= {{display: 'flex',alignItems: 'center', justifyContent: 'center'}} >
                     
                    <Animated.View style={{ opacity: animateContainerOpacity }}>
                      <DonutChart
                        data={dataItems.categories.filter((item)=>{
                          return item.value > 0
                        })}
                        size={350}
                      />
                      </Animated.View>
                      
                        <View style={styles.ViewInDiagrams}>
                          <Text style={styles.TextInDiagramsfirst}>
                              Текущий счет
                          </Text>
                            <Text style={styles.TextInDiagramsSecond}>
                              {totalValue.toFixed(2)} руб
                          </Text> 
                        </View>
                    </View>
                    <ButtonView>
                        <ButtonHeader onPress={() => {setVisible(true); setActiveModalButton(true)}}>
                          <View >
                          <Image
                          source={require('../../assets/icon/Sorting.png')}
                          style={styles.image} />
                          </View>
                        </ButtonHeader>
                        <ButtonHeader onPress={() => {setVisible(true); setActiveModalButton(true)}} >
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

