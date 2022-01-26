import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
}

interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {
        const [transactions, setTransactions] = useState<DataListProps[]>([]);
        const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

        async function loadTransactions(){
            const dataKey = '@gofinances:transactions';
            const response = await AsyncStorage.getItem(dataKey);
            const transactions = response ? JSON.parse(response) : [];

            let entriesTotal = 0;
            let expensivesTotal = 0;
            

            const transactionsFormatted: DataListProps[] = transactions
            .map((item: DataListProps) => {
                
                if(item.type === 'positive'){
                    entriesTotal += Number(item.amount);
                }else {
                    expensivesTotal += Number(item.amount);
                }
                
                let amount = Number(item.amount)
                .toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                amount = amount.replace('R$', 'R$ ');

                

                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date,
                }
            });

            const total = entriesTotal - expensivesTotal;

            setTransactions(transactionsFormatted);
            setHighlightData({
                entries: {
                    amount: entriesTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                },
                expensives: {
                    amount: expensivesTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                },
                total: {
                    amount: total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                }
            });
        }

        useEffect(() => {
            loadTransactions();
        }, []);

        useFocusEffect(useCallback(() => {
            loadTransactions();
        },[]));

        // Static List
//     const data : DataListProps[] = [
//     {
//         id: '1',
//         type: 'positive',
//         title: "Desenvolvimento de site",
//         amount: "R$ 12.000,00",
//         category: {
//             name: 'Vendas',
//             icon: 'dollar-sign',
//             },
//         date: "13/04/2020"
//     },
//     {
//         id: '2',
//         type: 'negative',
//         title: "Hamburgueria Pizzy",
//         amount: "R$ 59,00",
//         category: {
//             name: 'Alimentação',
//             icon: 'coffee',
//             },
//         date: "10/04/2020"
//     },
//     {
//         id: '3',
//         type: 'negative',
//         title: "Aluguel do apartamento",
//         amount: "R$ 1.200,00",
//         category: {
//             name: 'Casa',
//             icon: 'home',
//             },
//         date: "10/04/2020"
//     }
// ];

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo
                            source={{
                                uri: 'https://avatars.githubusercontent.com/u/15632297?v=4'
                            }} />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Vinícius</UserName>
                        </User>
                    </UserInfo>

                    <LogoutButton onPress={() => {}}>
                        <Icon name="power" />
                    </LogoutButton>
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard
                    type="up"
                    title="Entradas"
                    amount={highlightData?.entries?.amount}
                    lastTransaction="Última entrada dia 13 de abril"
                />      

                <HighlightCard
                    type="down"
                    title="Saídas"
                    amount={highlightData?.expensives?.amount}
                    lastTransaction="Última saída dia 03 de abril"
                />     

                <HighlightCard
                    type="total"
                    title="Total"
                    amount={highlightData?.total?.amount}
                    lastTransaction="01 à 16 de abril"
                />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>
                
                <TransactionList 
                    data={transactions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />

                
            </Transactions>
        </Container>
    )
}
