"use client";
import { useState } from 'react';
import { useMe } from '@/lib/auth/useMe';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Moon, 
  Sun, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Monitor
} from 'lucide-react';

export default function SettingsPage() {
  const { me, loading } = useMe();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Caricamento impostazioni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Impostazioni"
        description="Gestisci le tue preferenze e configurazioni"
      />

      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profilo Utente
          </CardTitle>
          <CardDescription>
            Informazioni del tuo account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{me?.name || 'Utente'}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{me?.email}</p>
            </div>
            <Badge variant="outline" className="capitalize">
              {me?.role || 'ruolo'}
            </Badge>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" size="sm">
              Modifica Profilo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Aspetto
          </CardTitle>
          <CardDescription>
            Personalizza l'aspetto dell'interfaccia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="h-5 w-5 text-blue-600" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
              <div>
                <h3 className="font-medium">Modalità Scura</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isDarkMode ? 'Attiva' : 'Disattiva'} - Interfaccia con colori scuri
                </p>
              </div>
            </div>
            <Button
              onClick={toggleDarkMode}
              variant={isDarkMode ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              {isDarkMode ? (
                <>
                  <Moon className="h-4 w-4" />
                  Scuro
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  Chiaro
                </>
              )}
            </Button>
          </div>

          {/* Theme Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Monitor className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium">Anteprima Tema</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                <div className="h-2 bg-blue-500 rounded mb-2"></div>
                <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
                </div>
                <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifiche
          </CardTitle>
          <CardDescription>
            Gestisci le tue preferenze di notifica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ricevi notifiche via email
              </p>
            </div>
            <Button
              onClick={() => handleNotificationChange('email')}
              variant={notifications.email ? "default" : "outline"}
              size="sm"
            >
              {notifications.email ? 'Attivo' : 'Disattivo'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Push</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Notifiche push del browser
              </p>
            </div>
            <Button
              onClick={() => handleNotificationChange('push')}
              variant={notifications.push ? "default" : "outline"}
              size="sm"
            >
              {notifications.push ? 'Attivo' : 'Disattivo'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">SMS</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Notifiche via SMS
              </p>
            </div>
            <Button
              onClick={() => handleNotificationChange('sms')}
              variant={notifications.sms ? "default" : "outline"}
              size="sm"
            >
              {notifications.sms ? 'Attivo' : 'Disattivo'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sicurezza
          </CardTitle>
          <CardDescription>
            Gestisci la sicurezza del tuo account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Cambia Password</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aggiorna la tua password
              </p>
            </div>
            <Button variant="outline" size="sm">
              Modifica
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Autenticazione a Due Fattori</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aggiungi un livello di sicurezza extra
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configura
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Sessione Attiva</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gestisci le sessioni attive
              </p>
            </div>
            <Button variant="outline" size="sm">
              Visualizza
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informazioni App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Versione:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">1.0.0</span>
            </div>
            <div>
              <span className="font-medium">Build:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">2024.12.20</span>
            </div>
            <div>
              <span className="font-medium">Ambiente:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Demo</span>
            </div>
            <div>
              <span className="font-medium">Tema:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {isDarkMode ? 'Scuro' : 'Chiaro'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
