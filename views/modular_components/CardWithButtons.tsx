import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

import { useState } from 'react';

import Edit from '../../assets/icon/Edit.svg';
import Trash from '../../assets/icon/Trash.svg';

const Card = styled.View`
    display: flex;
    flex-direction: row;
    position: relative;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    max-height: 80px;
    margin: 20px 32px 0;
    border: 1px solid #cecccc;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
`;

const EditBtn = styled.TouchableOpacity`
    position: absolute;
    left: 33px;
    top: 21px;
    width: 30%;
    border-radius: 10px;
    height: 120px;
    background-color: #ffb660;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`;

const DelBtn = styled.TouchableOpacity`
    position: absolute;
    right: 33px;
    top: 21px;
    width: 30%;
    border-radius: 10px;
    height: 120px;
    background-color: #ff8484;
`;

/**
 * Элемент карточки, который имеет кнопки редактирования и удаления, появляющиеся при нажатии на эту карточку.
 *
 * Через 1 секунду кнопки пропадают
 * @param editModal - функция, что открывает модальное окно изменения
 * @param del - функция, что производит удаление элемента
 * @example ```ts
 * <CardWithButtons editModal={() => openEditModal(index)} del={() => del(index)}>
 *  <Text>Example</Text>
 *  ...
 * </CardWithButtons>
 * ```
 */
export default function CardWithButtons(props: {
    children: React.ReactNode;
    editModal: Function;
    del: Function;
}) {
    const [pressed, setPressed] = useState(false);
    return (
        <View style={{ height: 145 }}>
            {pressed && (
                <View>
                    <EditBtn
                        onPress={() => {
                            props.editModal();
                            setPressed(false);
                        }}
                    >
                        <Edit
                            width={25}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                marginStart: -12.5,
                            }}
                        />
                    </EditBtn>
                    <DelBtn
                        onPress={() => {
                            props.del();
                            setPressed(false);
                        }}
                    >
                        <Trash
                            width={25}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                marginStart: -12.5,
                            }}
                        />
                    </DelBtn>
                </View>
            )}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setPressed(!pressed);
                    if (!pressed) {
                        setTimeout(() => setPressed(false), 1000);
                    }
                }}
            >
                <Card>{props.children}</Card>
            </TouchableOpacity>
        </View>
    );
}
