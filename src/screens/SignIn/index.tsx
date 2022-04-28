import React, { useContext } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Alert } from 'react-native';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import { 
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper,
} from './styles';


export function SignIn(){
    const { signInWithGoogle } = useAuth();

    async function handleSignInWithGoogle() {
        try {
            await signInWithGoogle();

        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível se conectar a conta Google.')
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />
                    
                    <Title>
                        Controle suas
                        finanças de forma
                        muito simples
                    </Title>
                </TitleWrapper>

                    <SignInTitle>
                        Faça seu login com {'\n'}
                        uma das contas abaixo
                    </SignInTitle>
                
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton 
                        title="Entrar no Google"
                        svg={GoogleSvg}
                        onPress={signInWithGoogle}
                    />

                    <SignInSocialButton 
                        title="Entrar no Google"
                        svg={AppleSvg}
                        
                    />
                </FooterWrapper>
            </Footer>
        </Container>
    )
}