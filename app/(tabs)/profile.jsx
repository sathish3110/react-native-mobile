import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loader from "../../components/Loader";

export default function profile() {
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [deleteBookId, setDeleteBookId] = React.useState(null);
  const { token } = useAuthStore();
  const router = useRouter();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/books/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteBook = async (bookId) => {
    try {
      setDeleteBookId(bookId);
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== bookId)
        );
        Alert.alert("Success", "Book deleted successfully");
      } else {
        const data = await response.json();
        Alert.alert("Error", data.message || "Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      Alert.alert("Error", "Failed to delete book. Please try again.");
    } finally {
      setLoading(false);
      setDeleteBookId(null);
    }
  };

  const confirmDelete = async (bookId) => {
    const confirm = await new Promise((resolve) => {
      Alert.alert(
        "Delete Recommendation",
        "Are you sure you want to delete this recommendation?",
        [
          {
            text: "Cancel",
            onPress: () => resolve(false),
            style: "cancel",
          },
          {
            text: "DELETE",
            onPress: () => resolve(true),
            style: "destructive",
          },
        ]
      );
    });
    if (confirm) {
      await deleteBook(bookId);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500); // Simulate a network delay
    await fetchBooks();
    setRefreshing(false);
  };
  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.bookItem}>
        <Image source={item.image} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>
          <Text style={styles.bookCaption} numberOfLines={2}>
            {item.caption}
          </Text>
          <Text style={styles.bookDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {deleteBookId === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmDelete(item._id)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchBooks();
    };
    fetchData();
  }, []);
  if (loading && !refreshing) return <Loader />;
  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
      {/* Recommendations */}
      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Recommendations</Text>
        <Text style={styles.booksCount}>
          {books.length} {books?.length <= 1 ? "book" : "books"}
        </Text>
      </View>
      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendation yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Text style={styles.addButtonText}>Add Your First Book</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
