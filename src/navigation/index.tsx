import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Home } from '../screens/Home';
import { MapaPatio } from '../screens/MapaPatio';
import { ListaMotos } from '../screens/ListaMotos';
import { DetalhesMoto } from '../screens/DetalhesMoto';
import { FormularioManutencao } from '../screens/FormularioManutencao';
import { Configuracoes } from '../screens/Configuracoes';
import { CadastroMoto } from '../screens/CadastroMoto';
import { Moto } from '../types';

export type RootStackParamList = {
  Home: undefined;
  Motos: undefined;
  Configuracoes: undefined;
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
const Tab = createBottomTabNavigator<RootStackParamList>();

const HomeStack = () => {
  return (
    <HomeStackNavigator.Navigator>
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
  return (
    <MotosStackNavigator.Navigator>
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
              <MaterialIcons name="add" size={24} color="#4CAF50" />
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

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
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