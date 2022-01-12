import React from 'react';
import { RectButtonProps, GestureHandlerRootView } from 'react-native-gesture-handler';

import { Container, Title } from './styles';

interface Props extends RectButtonProps {
    title: string;
    onPress: () => void;
}

export function Button({ 
    title, 
    onPress,
    ...rest 
} : Props) {
    return(
        <GestureHandlerRootView>
            <Container onPress={onPress} {...rest}>
                <Title>
                    { title }
                </Title>
            </Container>
        </GestureHandlerRootView>
    )
}