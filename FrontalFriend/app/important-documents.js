import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { supabase } from "../SupabaseClient";
import { FIREBASE_AUTH } from '../FirebaseConfig';

export default function ImportantDocumentsScreen() {
  const router = useRouter();
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;
  console.log(user.uid);


  const [documents, setDocuments] = useState([]);

  // Load docs when page loads
  useEffect(() => {
    if (user) loadDocuments();
  }, []);

  async function loadDocuments() {
    const { data, error } = await supabase
      .from('important-documents')
      .select('*')
      .eq('user_id', user.uid)
      .order('uploaded_at', { ascending: false });

    if (!error) setDocuments(data);
  }

async function uploadDocument() {
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*",
  });

  if (result.canceled) return;

  const file = result.assets[0];

  // Read file into ArrayBuffer
  const fileResponse = await fetch(file.uri);
  const arrayBuffer = await fileResponse.arrayBuffer();

  const filePath = `${user.uid}/${Date.now()}-${file.name}`;

  // Upload using ArrayBuffer
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("important-documents")
    .upload(filePath, arrayBuffer, {
      contentType: file.mimeType || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    console.log(uploadError);
    alert("Upload failed");
    return;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("important-documents")
    .getPublicUrl(filePath);

  // Save metadata to DB
  await supabase.from("important-documents").insert({
    user_id: user.uid,
    file_name: file.name,
    file_url: urlData.publicUrl,
  });

  loadDocuments();
}


  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Important Documents</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Important Documents</Text>
        <Text style={styles.description}>
          Upload and view important files such as medical records, insurance forms, and personal documents.
        </Text>

        {/* Upload Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={uploadDocument}>
          <Text style={styles.uploadButtonText}>Upload Document</Text>
        </TouchableOpacity>

        {/* Document List */}
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.docCard}
              onPress={() =>
                router.push({
                  pathname: "/document-viewer",
                  params: { url: item.file_url, name: item.file_name }
                })
              }
            >
              <Text style={styles.docName}>{item.file_name}</Text>
              <Text style={styles.docDate}>{new Date(item.uploaded_at).toLocaleDateString()}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  backButton: { marginRight: 15 },
  backButtonText: { fontSize: 18, color: '#007AFF' },

  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },

  content: { flex: 1, padding: 20 },

  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  description: { fontSize: 16, color: '#666', marginBottom: 20 },

  uploadButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  uploadButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  docCard: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee"
  },
  docName: { fontSize: 16, fontWeight: "600" },
  docDate: { color: "#666", marginTop: 4 }
});
