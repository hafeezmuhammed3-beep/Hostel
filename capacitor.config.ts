import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hostel.app',
  appName: 'Hostel Management',
  webDir: 'cap-build',
  server: {
    // Connect to your live Vercel deployment
    url: 'https://hostel-orpin-tau.vercel.app',
  }
};

export default config;
