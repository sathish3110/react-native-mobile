import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect } from "react";
import styles from "../../assets/styles/home.styles";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { formatPublishDate } from "../../lib/utils";
import Loader from "../../components/Loader";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refresh, setRefresh] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const { token } = useAuthStore();

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefresh(true);
      else if (pageNum === 1) setLoading(true);
      const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const uniqueBooks =
          refresh || pageNum === 1 ? data.books : [...books, ...data.books];
        const uniqueIds = new Set(uniqueBooks.map((book) => book._id));
        const filteredBooks = uniqueBooks.filter((book) =>
          uniqueIds.has(book._id)
        );
        setBooks(filteredBooks);
        setHasMore(pageNum < data.totalPages);
        setPage(pageNum);
      } else {
        console.error("Error fetching books:", data.message);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      if (refresh) {
        await sleep(800);
        setRefresh(false);
      } else setLoading(false);
    }
  };
  const fetchMoreBooks = async () => {
    if (hasMore && !loading && !refresh) {
      await fetchBooks(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image style={styles.avatar} source={item.user.profileImage} />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image
          style={styles.bookImage}
          source={item.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(item.rating)}
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>{formatPublishDate(item.createdAt)}</Text>
      </View>
    </View>
  );

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) return <Loader />;
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => fetchBooks(1, true)}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={fetchMoreBooks}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size={"small"}
              color={COLORS.primary}
            />
          ) : null
        }
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookWorm</Text>
            <Text style={styles.headerSubtitle}>
              Discover great reads from the community
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendation yet</Text>
            <Text style={styles.emptySubtext}>
              Start reading and share your thoughts
            </Text>
          </View>
        )}
      />
    </View>
  );
}
