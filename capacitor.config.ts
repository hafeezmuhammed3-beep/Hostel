import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hostel.app',
  appName: 'Hostel Management',
  webDir: 'cap-build',
  server: {
    // Connect to your local computer's IP address
    url: 'http://10.255.144.80:3000',
    cleartext: true,
  }
};

export default config;
