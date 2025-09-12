import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Home } from '../screens/Home';
import { MapaPatio } from '../screens/MapaPatio';
import { ListaMotos } from '../screens/ListaMotos';
import { DetalhesMoto } from '../screens/DetalhesMoto';
import { FormularioManutencao } from '../screens/FormularioManutencao';
import { Configuracoes } from '../screens/Configuracoes';
import { CadastroMoto } from '../screens/CadastroMoto';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { Moto } from '../types';

export type RootStackParamList = {
  Home: undefined;
  Motos: undefined;
  Configuracoes: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  MapaPatio: undefined;
};

export type MotosStackParamList = {
  ListaMotosScreen: undefined;
  DetalhesMoto: { moto: Moto };
  FormularioManutencao: { motoId: string };
  CadastroMoto: undefined;
};

const HomeStackNavigator = createNativeStackNavigator<HomeStackParamList>();
const MotosStackNavigator = createNativeStackNavigator<MotosStackParamList>();
const AuthStackNavigator = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const HomeStack = () => {
  const { theme } = useTheme();
  
  return (
    <HomeStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          color: theme.colors.text.primary,
        },
      }}
    >
      <HomeStackNavigator.Screen
        name="HomeScreen"
        component={Home}
        options={{ title: 'Home' }}
      />
      <HomeStackNavigator.Screen
        name="MapaPatio"
        component={MapaPatio}
        options={{ title: 'Mapa do Pátio' }}
      />
    </HomeStackNavigator.Navigator>
  );
};

const MotosStack = () => {
  const { theme } = useTheme();
  
  return (
    <MotosStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          color: theme.colors.text.primary,
        },
      }}
    >
      <MotosStackNavigator.Screen
        name="ListaMotosScreen"
        component={ListaMotos}
        options={({ navigation }) => ({
          title: 'Lista de Motos',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('CadastroMoto')}
              style={{ marginRight: 16 }}
            >
              <MaterialIcons name="add" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <MotosStackNavigator.Screen
        name="DetalhesMoto"
        component={DetalhesMoto}
        options={{ title: 'Detalhes da Moto' }}
      />
      <MotosStackNavigator.Screen
        name="FormularioManutencao"
        component={FormularioManutencao}
        options={{ title: 'Registrar Manutenção' }}
      />
      <MotosStackNavigator.Screen
        name="CadastroMoto"
        component={CadastroMoto}
        options={{ title: 'Cadastrar Moto' }}
      />
    </MotosStackNavigator.Navigator>
  );
};

const AuthStack = () => {
  const { theme } = useTheme();
  
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          color: theme.colors.text.primary,
        },
      }}
    >
      <AuthStackNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={{ 
          title: 'Login',
          headerShown: false
        }}
      />
      <AuthStackNavigator.Screen
        name="Register"
        component={RegisterScreen}
        options={{ 
          title: 'Cadastro',
          headerShown: false
        }}
      />
    </AuthStackNavigator.Navigator>
  );
};

export const Navigation = () => {
  const { theme } = useTheme();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.colors.background 
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text.secondary,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            color: theme.colors.text.primary,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            headerShown: false,
            title: 'Início',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Motos"
          component={MotosStack}
          options={{
            headerShown: false,
            title: 'Motos',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="motorcycle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Configuracoes"
          component={Configuracoes}
          options={{
            title: 'Configurações',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}; 