import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';


export default function CreatePetScreen({ navigation }: { navigation: NavigationProp<any> }) {
    const [petName, setPetName] = useState('');
    const [petColor, setPetColor] = useState('');
    const [petPrice, setPetPrice] = useState('');
    const [petDescription, setPetDescription] = useState('');
    const [selectedType, setSelectedType] = useState('Dog');
    const [imageUri, setImageUri] = useState<string | null>(null);

    const petTypes = ['Perro', 'Gato', 'Ave', 'Otro'];

    const handleImagePick = () => {
        // In a real app, this would use image picker library
        // For this example, we'll just set a placeholder image
        setImageUri('https://images.unsplash.com/photo-1583511655826-05700442b31b?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80');
    };

    const handleSubmit = () => {
        // Handle form submission
        console.log({
            name: petName,
            color: petColor,
            price: petPrice,
            description: petDescription,
            type: selectedType,
            image: imageUri,
        });
        // In a real app, you would save this data and navigate back
        alert('Animal creado Exitosamente');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation && navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Nueva Mascota</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Image Upload */}
                    <TouchableOpacity style={styles.imageUploadContainer} onPress={handleImagePick}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <Feather name="camera" size={40} color="#B4E4E0" />
                                <Text style={styles.uploadText}>Add Pet Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Pet Type Selection */}
                    <Text style={styles.inputLabelTipo}>Tipo de Mascota</Text>
                    <View style={styles.typeContainer}>
                        {petTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.typeButton,
                                    selectedType === type ? styles.selectedTypeButton : null,
                                ]}
                                onPress={() => setSelectedType(type)}
                            >
                                <Text
                                    style={[
                                        styles.typeText,
                                        selectedType === type ? styles.selectedTypeText : null,
                                    ]}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Pet Details Form */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nombre</Text>
                            <TextInput
                                style={styles.input}
                                value={petName}
                                onChangeText={setPetName}
                                placeholder="Ingrese el nombre de la mascota"
                                placeholderTextColor="#9B9B9B"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Color</Text>
                            <TextInput
                                style={styles.input}
                                value={petColor}
                                onChangeText={setPetColor}
                                placeholder="Ingrese el color de la mascota"
                                placeholderTextColor="#9B9B9B"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Descripcion</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={petDescription}
                                onChangeText={setPetDescription}
                                placeholder="Ingrese una descripción de la mascota"
                                placeholderTextColor="#9B9B9B"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Submit Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Añadir Mascota</Text>
                    <MaterialIcons name="pets" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginTop: 40
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3A3A',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    imageUploadContainer: {
        alignSelf: 'center',
        marginVertical: 20,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#F5F5F5',
        overflow: 'hidden',
    },
    uploadPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    uploadText: {
        marginTop: 10,
        color: '#9B9B9B',
        fontSize: 14,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    typeContainer: {
        display: "flex",
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
        marginTop: 10,

    },
    typeButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        minWidth: 70,
        alignItems: 'center',
    },
    selectedTypeButton: {
        backgroundColor: '#B4E4E0',
    },
    typeText: {
        color: '#9B9B9B',
        fontWeight: '500',
    },
    selectedTypeText: {
        color: '#2D3A3A',
        fontWeight: 'bold',
    },
    formContainer: {
        paddingHorizontal: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2D3A3A',
        marginBottom: 8,
    },
    inputLabelTipo: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2D3A3A',
        marginBottom: 8,
        marginLeft: 20
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: '#2D3A3A',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#B4E4E0',
        borderRadius: 25,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#2D3A3A',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
});