import React, { useRef } from 'react';
import { PanResponder, Animated, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Trash from '../../assets/icon/Trash.svg';
import Edit from '../../assets/icon/Edit.svg';

const Vieww = styled.View`
    // display: flex;
    // flex-direction: row;
    align-items: center;
    height: 80px;
    max-height: 80px;
    margin: 20px 32px;
    // border: 1px solid red;
    border-radius: 10px;
    z-index: 1;
`;

const CardView = styled(Animated.View)`
    background-color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    max-height: 80px;
    border: 1px solid #cecccc;
    border-radius: 10px;
    z-index: 5;
`;

const BackgroundView = styled.View`
    position: absolute;
    dispay: flex;
    justify-content: space-between;
    z-index: 2;
    width: 100%;
    height: 80px;
    border-radius: 10px;
`;

const DeleteView = styled.View`
    position: absolute;
    right: 0;
    z-index: 3;
    width: 50%;
    height: 80px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-right: 10px;
`;

const UpdateView = styled.View`
    position: absolute;
    left: 0;
    z-index: 3;
    width: 50%;
    height: 80px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-left: 10px;
`;

export default function CardSwipe(props: {
    onDoubleClick?: Function;
    onEdit: Function;
    onDelete: Function;
    children: React.ReactNode;
}) {
    const pan = useRef(new Animated.ValueXY()).current;
    const DOUBLE_CLICK_DELAY = 300;
    let lastClickTime = 0;
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (e, gesture) => {
                const currentTime = new Date().getTime();
                const dt = currentTime - lastClickTime;
                if (dt < DOUBLE_CLICK_DELAY) {
                    props.onDoubleClick && props.onDoubleClick();
                }
                lastClickTime = currentTime;
                if (Math.abs(gesture.dx) < 30 && Math.abs(gesture.dy) < 30) {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                } else {
                    // console.log(pan.x, " ", gesture.dx, " Стена");
                    if (gesture.dx < 1) {
                        Animated.timing(pan, {
                            toValue: { x: -70, y: 0 },
                            duration: 200,
                            useNativeDriver: false,
                        }).start();
                    } else if (gesture.dx > 1) {
                        Animated.timing(pan, {
                            toValue: { x: 70, y: 0 },
                            duration: 200,
                            useNativeDriver: false,
                        }).start();
                    }
                }
                setTimeout(() => {
                    Animated.timing(pan, {
                        toValue: { x: 0, y: 0 },
                        duration: 200,
                        useNativeDriver: false,
                    }).start();
                }, 1000);
            },
        }),
    ).current;

    return (
        <Vieww>
            <CardView
                style={{
                    transform: [{ translateX: pan.x }, { translateY: 0 }],
                }}
                {...panResponder.panHandlers}
            >
                {props.children}
            </CardView>
            <BackgroundView>
                <DeleteView style={{ backgroundColor: '#FF8484' }}>
                    <Trash
                        width={50}
                        height={50}
                        onPress={() => {
                            props.onDelete();
                        }}
                    />
                </DeleteView>
                <UpdateView style={{ backgroundColor: '#FFB660' }}>
                    <Edit
                        onPress={() => {
                            props.onEdit();
                        }}
                    />
                </UpdateView>
            </BackgroundView>
        </Vieww>
    );
}
