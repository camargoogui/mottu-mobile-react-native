import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Home } from '../screens/Home';
import { MapaPatio } from '../screens/MapaPatio';
import { ListaMotos } from '../screens/ListaMotos';
import { DetalhesMoto } from '../screens/DetalhesMoto';
import { FormularioManutencao } from '../screens/FormularioManutencao';
import { ListaManutencoes } from '../screens/ListaManutencoes';
import { Configuracoes } from '../screens/Configuracoes';
import { CadastroMoto } from '../screens/CadastroMoto';
import { EdicaoMoto } from '../screens/EdicaoMoto';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { FilialListScreen } from '../screens/FilialListScreen';
import { FilialFormScreen } from '../screens/FilialFormScreen';
import { MotosFilialScreen } from '../screens/MotosFilialScreen';
import { PushDebugScreen } from '../screens/PushDebugScreen';
import { Moto, Filial } from '../types';

export type RootStackParamList = {
  Home: undefined;
  Motos: undefined;
  Filiais: undefined;
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
  EdicaoMoto: { moto: Moto };
  FormularioManutencao: { motoId: string };
  ListaManutencoes: undefined;
  CadastroMoto: undefined;
};

export type FiliaisStackParamList = {
  FilialList: undefined;
  FilialForm: { filial?: Filial };
  MotosFilial: { filial: Filial };
};

export type ConfiguracoesStackParamList = {
  ConfiguracoesScreen: undefined;
  PushDebug: undefined;
};

const HomeStackNavigator = createNativeStackNavigator<HomeStackParamList>();
const MotosStackNavigator = createNativeStackNavigator<MotosStackParamList>();
const FiliaisStackNavigator = createNativeStackNavigator<FiliaisStackParamList>();
const AuthStackNavigator = createNativeStackNavigator<AuthStackParamList>();
const ConfiguracoesStackNavigator = createNativeStackNavigator<ConfiguracoesStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const HomeStack = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  return (
    <HomeStackNavigator.Navigator
      screenOptions={{
        // Apple HIG Navigation Bar
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          fontSize: theme.typography.headline.fontSize,
          fontWeight: theme.typography.headline.fontWeight as any,
          color: theme.colors.label,
        },
      }}
    >
      <HomeStackNavigator.Screen
        name="HomeScreen"
        component={Home}
        options={{ title: t('navigation.home') }}
      />
      <HomeStackNavigator.Screen
        name="MapaPatio"
        component={MapaPatio}
        options={{ title: t('home.mapView') }}
      />
    </HomeStackNavigator.Navigator>
  );
};

const MotosStack = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  return (
    <MotosStackNavigator.Navigator
      screenOptions={{
        // Apple HIG Navigation Bar
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          fontSize: theme.typography.headline.fontSize,
          fontWeight: theme.typography.headline.fontWeight as any,
          color: theme.colors.label,
        },
      }}
    >
      <MotosStackNavigator.Screen
        name="ListaMotosScreen"
        component={ListaMotos}
        options={({ navigation }) => ({
          title: t('moto.list'),
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
        options={{ title: t('moto.details') }}
      />
      <MotosStackNavigator.Screen
        name="EdicaoMoto"
        component={EdicaoMoto}
        options={{ title: t('moto.edit') }}
      />
      <MotosStackNavigator.Screen
        name="FormularioManutencao"
        component={FormularioManutencao}
        options={{ title: t('maintenance.create') }}
      />
      <MotosStackNavigator.Screen
        name="CadastroMoto"
        component={CadastroMoto}
        options={{ title: t('moto.create') }}
      />
      <MotosStackNavigator.Screen
        name="ListaManutencoes"
        component={ListaManutencoes}
        options={{ title: t('maintenance.list') }}
      />
    </MotosStackNavigator.Navigator>
  );
};

const FiliaisStack = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  return (
    <FiliaisStackNavigator.Navigator
      screenOptions={{
        // Apple HIG Navigation Bar
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          fontSize: theme.typography.headline.fontSize,
          fontWeight: theme.typography.headline.fontWeight as any,
          color: theme.colors.label,
        },
      }}
    >
      <FiliaisStackNavigator.Screen
        name="FilialList"
        component={FilialListScreen}
        options={({ navigation }) => ({
          title: t('filial.plural'),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('FilialForm', {})}
              style={{ marginRight: 16 }}
            >
              <MaterialIcons name="add" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <FiliaisStackNavigator.Screen
        name="FilialForm"
        component={FilialFormScreen}
        options={({ route }) => ({
          title: route.params?.filial ? t('filial.edit') : t('filial.newBranch')
        })}
      />
      <FiliaisStackNavigator.Screen
        name="MotosFilial"
        component={MotosFilialScreen}
        options={{ title: t('filial.motosFilial') }}
      />
    </FiliaisStackNavigator.Navigator>
  );
};

const ConfiguracoesStack = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  return (
    <ConfiguracoesStackNavigator.Navigator
      screenOptions={{
        // Apple HIG Navigation Bar
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          fontSize: theme.typography.headline.fontSize,
          fontWeight: theme.typography.headline.fontWeight as any,
          color: theme.colors.label,
        },
      }}
    >
      <ConfiguracoesStackNavigator.Screen
        name="ConfiguracoesScreen"
        component={Configuracoes}
        options={{ title: t('settings.title') }}
      />
      <ConfiguracoesStackNavigator.Screen
        name="PushDebug"
        component={PushDebugScreen}
        options={{ title: 'Push Notifications Debug' }}
      />
    </ConfiguracoesStackNavigator.Navigator>
  );
};

const AuthStack = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        // Apple HIG Navigation Bar
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          fontSize: theme.typography.headline.fontSize,
          fontWeight: theme.typography.headline.fontWeight as any,
          color: theme.colors.label,
        },
      }}
    >
      <AuthStackNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={{ 
          title: t('auth.login'),
          headerShown: false
        }}
      />
      <AuthStackNavigator.Screen
        name="Register"
        component={RegisterScreen}
        options={{ 
          title: t('auth.register'),
          headerShown: false
        }}
      />
    </AuthStackNavigator.Navigator>
  );
};

export const Navigation = () => {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

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
          // Apple HIG Tab Bar
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.secondaryLabel,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            paddingBottom: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
            height: 83, // Apple HIG standard tab bar height
          },
          tabBarLabelStyle: {
            fontSize: theme.typography.caption1.fontSize,
            fontWeight: theme.typography.caption1.fontWeight as any,
            marginTop: theme.spacing.xs,
          },
          tabBarIconStyle: {
            marginTop: theme.spacing.xs,
          },
          // Apple HIG Navigation Bar
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            fontSize: theme.typography.headline.fontSize,
            fontWeight: theme.typography.headline.fontWeight as any,
            color: theme.colors.label,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            headerShown: false,
            title: t('navigation.home'),
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
            title: t('navigation.motos'),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="motorcycle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Filiais"
          component={FiliaisStack}
          options={{
            headerShown: false,
            title: t('navigation.filials'),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="business" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Configuracoes"
          component={ConfiguracoesStack}
          options={{
            headerShown: false,
            title: t('navigation.settings'),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}; 