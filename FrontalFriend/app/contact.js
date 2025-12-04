import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';

export default function ContactScreen() {
  const router = useRouter();

  const PhoneLink = ({ number }) => (
  <Text
    style={styles.phone}
    onPress={() => Linking.openURL(`tel:${number}`)}
  >
    {number}
  </Text>
);

const WebsiteLink = ({ url, label }) => (
  <Text
    style={styles.link}
    onPress={() => Linking.openURL(url)}
  >
    {label}
  </Text>
);



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Contact</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          Reach out to a support team or access mental health resources:
        </Text>
        <Text style={styles.description}>
          Visit <WebsiteLink url="https://988lifeline.org" label="988lifeline.org" /> for immediate support and additional crisis resources. You can also access treatment information through the Substance Abuse and Mental Health Services Administration (SAMHSA) website: <WebsiteLink url="https://www.samhsa.gov/" label="samhsa.gov" />, find education and community programs through the National Alliance on Mental Illness (NAMI) website: <WebsiteLink url="https://www.nami.org/" label="nami.org" />, and explore local services available in your area.
        </Text>


      <View style={{marginTop: 20}}>
        <Text style={styles.sectionTitle}>
          Crisis hotlines:
        </Text>
      </View>  


        <Text style={styles.description}>
            For immediate mental health support, call or text these numbers at anytime.
        </Text>

        <Text style={styles.description}>
          Suicide helpline: <PhoneLink number="988" />
        </Text>

        <Text style={styles.description}>
          Miami-Dade helpline: <PhoneLink number="211" />
        </Text>


<Text style={styles.description}>
  Emergency: <PhoneLink number="911" />
</Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
    phone: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
    link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
