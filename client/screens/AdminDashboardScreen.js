import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function AdminDashboardScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('notices'); // notices | users
    const [loading, setLoading] = useState(false);

    // Data
    const [notices, setNotices] = useState([]);
    const [users, setUsers] = useState([]);

    // Modal (Notice)
    const [isModalVisible, setModalVisible] = useState(false);
    const [editingTitle, setEditingTitle] = useState('');
    const [editingContent, setEditingContent] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        checkAuth();
        fetchData();
    }, [activeTab]);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/admin/check');
            const data = await response.json();
            if (!data.isAdmin) {
                Alert.alert('Unauthorized', 'Please login again.');
                navigation.replace('AdminLogin');
            }
        } catch {
            navigation.replace('AdminLogin');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'notices') {
                const res = await fetch('/api/admin/notices');
                const data = await res.json();
                if (Array.isArray(data)) setNotices(data);
            } else {
                const res = await fetch('/api/admin/users');
                const data = await res.json();
                if (Array.isArray(data)) setUsers(data);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            Alert.alert('Error', 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // --- Notice Handlers ---

    const handleSaveNotice = async () => {
        if (!editingTitle || !editingContent) {
            Alert.alert('Error', 'Title and Content are required');
            return;
        }

        try {
            const url = editingId ? `/api/admin/notices/${editingId}` : '/api/admin/notices';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editingTitle, content: editingContent }),
            });

            if (res.ok) {
                setModalVisible(false);
                setEditingId(null);
                setEditingTitle('');
                setEditingContent('');
                fetchData(); // Refresh
            } else {
                Alert.alert('Error', 'Failed to save notice');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error');
        }
    };

    const handleDeleteNotice = async (id) => {
        // Platform specific confirm
        if (Platform.OS === 'web') {
            if (!confirm('Are you sure you want to delete this notice?')) return;
        }

        try {
            const res = await fetch(`/api/admin/notices/${id}`, { method: 'DELETE' });
            if (res.ok) fetchData();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete');
        }
    };

    const openEditModal = (notice) => {
        setEditingId(notice.id);
        setEditingTitle(notice.title);
        setEditingContent(notice.content);
        setModalVisible(true);
    };

    const openCreateModal = () => {
        setEditingId(null);
        setEditingTitle('');
        setEditingContent('');
        setModalVisible(true);
    };

    // --- User Handlers ---

    const handleDeleteUser = async (id) => {
        if (Platform.OS === 'web') {
            if (!confirm('WARNING: Are you sure you want to delete this user? This cannot be undone.')) return;
        }

        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            if (res.ok) fetchData();
            else Alert.alert('Error', 'Failed to delete user');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete user');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        navigation.replace('AdminLogin');
    };

    // --- Renders ---

    const renderNoticeItem = ({ item }) => (
        <View style={styles.itemCard}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemContent} numberOfLines={2}>{item.content}</Text>
                <Text style={styles.itemDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => openEditModal(item)}>
                    <Ionicons name="create-outline" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleDeleteNotice(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderUserItem = ({ item }) => (
        <View style={styles.itemCard}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.email}</Text>
                <Text style={styles.itemContent}>ID: {item.id}</Text>
                <Text style={styles.itemDate}>Joined: {new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleDeleteUser(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'notices' && styles.activeTab]}
                    onPress={() => setActiveTab('notices')}
                >
                    <Text style={[styles.tabText, activeTab === 'notices' && styles.activeTabText]}>Notices</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'users' && styles.activeTab]}
                    onPress={() => setActiveTab('users')}
                >
                    <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Users</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {activeTab === 'notices' ? (
                    <>
                        <View style={styles.toolbar}>
                            <Text style={styles.sectionTitle}>Notice List</Text>
                            <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
                                <Text style={styles.addButtonText}>+ New Notice</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={notices}
                            renderItem={renderNoticeItem}
                            keyExtractor={item => item.id.toString()}
                            refreshing={loading}
                            onRefresh={fetchData}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </>
                ) : (
                    <>
                        <View style={styles.toolbar}>
                            <Text style={styles.sectionTitle}>User List</Text>
                            <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
                                <Ionicons name="refresh" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={users}
                            renderItem={renderUserItem}
                            keyExtractor={item => item.id.toString()}
                            refreshing={loading}
                            onRefresh={fetchData}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </>
                )}
            </View>

            {/* Notice Modal */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingId ? 'Edit Notice' : 'New Notice'}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={editingTitle}
                            onChangeText={setEditingTitle}
                        />

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Content"
                            value={editingContent}
                            onChangeText={setEditingContent}
                            multiline
                            textAlignVertical="top"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveNotice}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: {
        height: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    logoutText: { color: '#666', fontSize: 14 },

    tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    tab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
    activeTab: { borderBottomWidth: 2, borderBottomColor: colors.main },
    tabText: { color: '#888', fontWeight: '600' },
    activeTabText: { color: colors.main },

    content: { flex: 1, padding: 15 },
    toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    addButton: { backgroundColor: colors.main, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6 },
    addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    refreshButton: { padding: 8 },

    itemCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
    },
    itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    itemContent: { fontSize: 14, color: '#666', marginBottom: 4 },
    itemDate: { fontSize: 12, color: '#999' },
    actionButtons: { flexDirection: 'row', marginLeft: 10 },
    iconBtn: { padding: 8 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '90%', maxWidth: 500, backgroundColor: '#fff', borderRadius: 12, padding: 25 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 12, marginBottom: 15, fontSize: 16 },
    textArea: { height: 120 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    cancelButton: { flex: 1, padding: 12, alignItems: 'center', marginRight: 10, backgroundColor: '#f0f0f0', borderRadius: 6 },
    saveButton: { flex: 1, padding: 12, alignItems: 'center', marginLeft: 10, backgroundColor: colors.main, borderRadius: 6 },
    cancelButtonText: { color: '#666', fontWeight: 'bold' },
    saveButtonText: { color: '#fff', fontWeight: 'bold' },
});
