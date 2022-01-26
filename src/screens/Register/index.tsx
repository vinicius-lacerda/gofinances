import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert 
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { InputForm } from '../../components/Forms/InputForm';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';
import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';

interface FormData {
    name: string;
    amount: string;
}

// Typing Navigation
type NavigationProps = {
    navigate:(screen:string) => void;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('O nome é obrigatório'),
    amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
});

export function Register(){
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    // Key of collection
    const dataKey = '@gofinances:transactions';

    // Declaring variable navigation
    const navigation = useNavigation<NavigationProps>();

    const { 
        control,        
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionsTypeSelect(type: 'up' | 'down') {
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: FormData) {
        if(!transactionType)
            return Alert.alert('Selecione o tipo da transação');

        if(category.key === 'category')
            return Alert.alert('Selecione a categoria');

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            // Recovery data
            const data = await AsyncStorage.getItem(dataKey);
            // If exists data, convert to JSON. If not, empty array
            const currentData = data ? JSON.parse(data) : [];
            // Get all transactions and the last
            const dataFormatted = [
                ...currentData,
                newTransaction
            ];
            // Render all transactions
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            // Reset all fields and default state on field Category
            reset(); // InputText
            setTransactionType(''); // Button Income/OutCome
            setCategory({ // Category
             key: 'category',
             name: 'Categoria'   
            });

            // Moving to screen Listagem after submit on form 
            navigation.navigate('Listagem');

        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível salvar');   
        }
    }

    useEffect(() =>{
        async function loadData(){
            const data = await AsyncStorage.getItem(dataKey);
            console.log(JSON.parse(data!));
        }
        
        loadData();
    },[])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}                        
                            placeholder='Nome'
                            autoCapitalize='words'
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />

                        <InputForm
                            name="amount" 
                            control={control}
                            placeholder='Preço'
                            keyboardType='numeric'
                            error={errors.amount && errors.amount.message}
                        />
                        

                        <TransactionsTypes>
                            <TransactionTypeButton
                            type='up'
                            title='Income'
                            onPress={() => handleTransactionsTypeSelect('up')}
                            isActive={transactionType === 'up'}
                            />

                            <TransactionTypeButton
                            type='down'
                            title='Outcome'
                            onPress={() => handleTransactionsTypeSelect('down')}
                            isActive={transactionType === 'down'}
                            />
                        </TransactionsTypes>

                        <CategorySelectButton 
                        title={category.name} 
                        onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>

                    
                    <Button 
                        title='Enviar'
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={categoryModalOpen} statusBarTranslucent={true}>
                    <CategorySelect 
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
}