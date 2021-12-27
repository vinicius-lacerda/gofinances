import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface TransactionProps {
    type: 'positive' | 'negative';
}

export const Container = styled.View`
    background-color: ${({ theme }) => theme.colors.shape};
    padding: 17px 24px;
    border-radius: 5px;
    margin-bottom: 16px;
`;

export const Title = styled.Text`
    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.medium};    
    color: ${({ theme }) => theme.colors.title};
`;

export const Amount = styled.Text<TransactionProps>`
    font-size: ${RFValue(20)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
    color: ${({ theme, type }) => 
    type === 'positive' ? theme.colors.success : theme.colors.attention};
    
    margin-top: 2px;    
`;

export const Footer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    
    margin-top: 19px;
`;

export const Category = styled.View`
    flex-direction: row;
    align-items: center;

    margin-top: ${RFValue(10)}px;
`;

export const Icon = styled(Feather)`  
    font-size: ${RFValue(20)}px;

    color: ${({ theme }) => theme.colors.text};
`;

export const CategoryName = styled.Text`
    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.regular};    

    margin-left: 17px;

    color: ${({ theme }) => theme.colors.text};
`;

export const Date = styled.Text`
    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.regular};    

    color: ${({ theme }) => theme.colors.text};

    margin-top: ${RFValue(10)}px;
`;


