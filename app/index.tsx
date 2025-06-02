import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the welcome screen by default
  return <Redirect href="/(welcome)/welcome" />;
}