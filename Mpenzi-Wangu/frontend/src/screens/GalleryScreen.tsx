import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Image as ImageIcon,
  PlusCircle,
  Grid,
  Heart,
  X,
  Calendar,
  Sparkles,
  Check,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GalleryScreen({
  coupleId = 'couple_demo_123',
  userId = 'user_1',
}: {
  coupleId?: string;
  userId?: string;
}) {
  const { colors } = useTheme();

  // Active Tab: 'grid' (Gallery) | 'collage' (Collage Maker)
  const [activeTab, setActiveTab] = useState<'grid' | 'collage'>('grid');

  // Firestore Photos Array
  const [photos, setPhotos] = useState<any[]>([]);

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDetailPhoto, setSelectedDetailPhoto] = useState<any | null>(null);

  // Form Inputs for Adding Memory
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoNote, setPhotoNote] = useState('');

  // Collage Maker Selected Images Array
  const [selectedForCollage, setSelectedForCollage] = useState<string[]>([]);

  // Real-time Firestore Listener for Gallery Photos
  useEffect(() => {
    if (!coupleId) return;

    const galleryRef = collection(db, 'couples', coupleId, 'gallery');
    const q = query(galleryRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setPhotos(fetchedPhotos);
    });

    return () => unsubscribe();
  }, [coupleId]);

  // Image Picker from Device Gallery
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  // Save New Photo Memory to Firestore
  const handleSaveMemory = async () => {
    if (!photoUrl.trim() || !photoTitle.trim()) {
      Alert.alert('Missing Info', 'Please select or enter a photo URL and title.');
      return;
    }

    try {
      await addDoc(collection(db, 'couples', coupleId, 'gallery'), {
        imageUrl: photoUrl.trim(),
        title: photoTitle.trim(),
        note: photoNote.trim() || 'A sweet memory together 💕',
        authorId: userId,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Memory Saved! 📸', 'Added to your private Couple Gallery!');
      setPhotoUrl('');
      setPhotoTitle('');
      setPhotoNote('');
      setShowAddModal(false);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  // Toggle Image Selection for Collage
  const toggleCollageSelection = (url: string) => {
    if (selectedForCollage.includes(url)) {
      setSelectedForCollage(selectedForCollage.filter((u) => u !== url));
    } else {
      if (selectedForCollage.length >= 4) {
        Alert.alert('Limit Reached', 'You can select up to 4 photos for a collage.');
        return;
      }
      setSelectedForCollage([...selectedForCollage, url]);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* HEADER */}
      <View style={[styles.headerCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <ImageIcon color="#27AE60" size={32} />
        <Text style={[styles.title, { color: colors.headerText }]}>Our Gallery 🖼️</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Sweet memories & custom romantic collages
        </Text>

        {/* Action Tabs & Add Button Row */}
        <View style={styles.actionHeaderRow}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'grid' && { backgroundColor: colors.primary }]}
              onPress={() => setActiveTab('grid')}
            >
              <Grid color={activeTab === 'grid' ? '#FFF' : colors.inputText} size={15} />
              <Text style={[styles.tabBtnText, { color: activeTab === 'grid' ? '#FFF' : colors.inputText }]}>
                Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'collage' && { backgroundColor: colors.primary }]}
              onPress={() => setActiveTab('collage')}
            >
              <Sparkles color={activeTab === 'collage' ? '#FFF' : colors.inputText} size={15} />
              <Text style={[styles.tabBtnText, { color: activeTab === 'collage' ? '#FFF' : colors.inputText }]}>
                Collage Maker
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.addMemoryBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowAddModal(true)}
          >
            <PlusCircle color="#FFF" size={16} />
            <Text style={styles.addMemoryText}>Add Memory</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* VIEW 1: GALLERY PHOTO GRID */}
      {activeTab === 'grid' && (
        <View style={styles.photoGrid}>
          {photos.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Heart color={colors.subText} size={36} />
              <Text style={[styles.emptyText, { color: colors.subText }]}>
                No memories uploaded yet. Tap "Add Memory" to post your first photo!
              </Text>
            </View>
          ) : (
            photos.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.gridImageWrapper, { borderColor: colors.border }]}
                onPress={() => setSelectedDetailPhoto(item)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
                <View style={styles.imageOverlay}>
                  <Text numberOfLines={1} style={styles.imageOverlayTitle}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* VIEW 2: DYNAMIC COLLAGE MAKER */}
      {activeTab === 'collage' && (
        <View style={styles.collageContainer}>
          <Text style={[styles.sectionTitle, { color: colors.headerText }]}>
            Select 2 to 4 Photos to Create a Collage 🎨
          </Text>

          {/* Render Active Collage Preview */}
          {selectedForCollage.length >= 2 ? (
            <View style={[styles.collagePreviewBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Text style={[styles.collageTag, { color: colors.primary }]}>✨ YOUR SWEET COLLAGE PREVIEW</Text>
              <View style={styles.collageGridFrame}>
                {selectedForCollage.map((imgUrl, idx) => (
                  <Image key={idx} source={{ uri: imgUrl }} style={styles.collageGridTile} />
                ))}
              </View>
            </View>
          ) : (
            <View style={[styles.collagePlaceholder, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Sparkles color={colors.subText} size={32} />
              <Text style={[styles.placeholderText, { color: colors.subText }]}>
                Tap photos below to build your sweet collage grid preview!
              </Text>
            </View>
          )}

          {/* Photo Selection Grid */}
          <Text style={[styles.subSectionTitle, { color: colors.subText }]}>Choose From Gallery:</Text>
          <View style={styles.photoSelectionGrid}>
            {photos.map((item) => {
              const isSelected = selectedForCollage.includes(item.imageUrl);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.selectionTile,
                    isSelected && { borderColor: colors.primary, borderWidth: 3 },
                  ]}
                  onPress={() => toggleCollageSelection(item.imageUrl)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.selectionImage} />
                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                      <Check color="#FFF" size={14} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* MODAL 1: ADD MEMORY FORM */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.headerText }]}>Add Sweet Memory 📸</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X color={colors.inputText} size={22} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.uploadPickerBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={handlePickImage}
            >
              <ImageIcon color={colors.primary} size={24} />
              <Text style={[styles.pickerText, { color: colors.inputText }]}>
                {photoUrl ? 'Photo Selected! (Tap to Change)' : 'Pick Photo from Phone Gallery'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.orLabel, { color: colors.subText }]}>OR Paste Image Web URL:</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
              placeholder="https://images.unsplash.com/..."
              placeholderTextColor="#A0AEC0"
              value={photoUrl}
              onChangeText={setPhotoUrl}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
              placeholder="Memory Title (e.g., Sunset in Diani 🌅)"
              placeholderTextColor="#A0AEC0"
              value={photoTitle}
              onChangeText={setPhotoTitle}
            />

            <TextInput
              style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
              placeholder="Write a sweet note about this memory..."
              placeholderTextColor="#A0AEC0"
              multiline
              numberOfLines={3}
              value={photoNote}
              onChangeText={setPhotoNote}
            />

            <TouchableOpacity style={[styles.saveMemoryBtn, { backgroundColor: colors.primary }]} onPress={handleSaveMemory}>
              <Heart color="#FFF" size={18} fill="#FFF" />
              <Text style={styles.saveMemoryText}>Save Memory to Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: FULLSCREEN PHOTO DETAIL VIEW */}
      <Modal visible={!!selectedDetailPhoto} transparent animationType="fade">
        <View style={styles.detailModalOverlay}>
          <View style={[styles.detailCard, { backgroundColor: colors.cardBg }]}>
            <TouchableOpacity style={styles.closeDetailBtn} onPress={() => setSelectedDetailPhoto(null)}>
              <X color="#FFF" size={24} />
            </TouchableOpacity>

            {selectedDetailPhoto && (
              <>
                <Image source={{ uri: selectedDetailPhoto.imageUrl }} style={styles.fullDetailImage} />
                <View style={styles.detailMetaBox}>
                  <Text style={styles.detailTitle}>{selectedDetailPhoto.title}</Text>
                  <View style={styles.dateRow}>
                    <Calendar color="#A0AEC0" size={14} />
                    <Text style={styles.detailDate}>
                      {new Date(selectedDetailPhoto.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.detailNote}>"{selectedDetailPhoto.note}"</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  headerCard: { padding: 20, borderRadius: 24, alignItems: 'center', borderWidth: 1, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '800', marginTop: 10 },
  subtitle: { fontSize: 12, marginTop: 2, marginBottom: 15 },

  actionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 8 },
  tabBar: { flexDirection: 'row', gap: 6 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, gap: 4 },
  tabBtnText: { fontSize: 11, fontWeight: '800' },

  addMemoryBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, gap: 4 },
  addMemoryText: { color: '#FFF', fontWeight: '800', fontSize: 11 },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, width: '100%' },
  emptyBox: { width: '100%', padding: 30, borderRadius: 24, borderWidth: 1, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 13, textAlign: 'center' },

  gridImageWrapper: { width: '48%', height: 160, borderRadius: 18, overflow: 'hidden', borderWidth: 1 },
  gridImage: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8 },
  imageOverlayTitle: { color: '#FFF', fontSize: 12, fontWeight: '700', textAlign: 'center' },

  collageContainer: { width: '100%', gap: 15 },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  collagePreviewBox: { padding: 16, borderRadius: 22, borderWidth: 1, alignItems: 'center' },
  collageTag: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  collageGridFrame: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', height: 220, borderRadius: 16, overflow: 'hidden', gap: 4, padding: 4, backgroundColor: '#000' },
  collageGridTile: { flex: 1, minWidth: '45%', height: '48%', borderRadius: 10 },

  collagePlaceholder: { padding: 25, borderRadius: 22, borderWidth: 1, alignItems: 'center', gap: 8 },
  placeholderText: { fontSize: 12, textAlign: 'center' },
  subSectionTitle: { fontSize: 13, fontWeight: '700' },

  photoSelectionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  selectionTile: { width: '30%', height: 90, borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  selectionImage: { width: '100%', height: '100%' },
  checkBadge: { position: 'absolute', top: 6, right: 6, padding: 4, borderRadius: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', padding: 20 },
  modalCard: { padding: 20, borderRadius: 24, borderWidth: 1, gap: 12 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800' },

  uploadPickerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, borderWidth: 1, gap: 8 },
  pickerText: { fontSize: 12, fontWeight: '700' },
  orLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },

  input: { width: '100%', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, fontSize: 12 },
  textArea: { width: '100%', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, fontSize: 12, textAlignVertical: 'top' },

  saveMemoryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, gap: 8, marginTop: 6 },
  saveMemoryText: { color: '#FFF', fontWeight: '800', fontSize: 13 },

  detailModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  detailCard: { width: '100%', borderRadius: 24, overflow: 'hidden' },
  closeDetailBtn: { position: 'absolute', top: 15, right: 15, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 20 },
  fullDetailImage: { width: '100%', height: 320, resizeMode: 'cover' },
  detailMetaBox: { padding: 20 },
  detailTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  detailDate: { color: '#A0AEC0', fontSize: 12 },
  detailNote: { color: '#FFF', fontSize: 14, fontStyle: 'italic', marginTop: 12, lineHeight: 20 },
});