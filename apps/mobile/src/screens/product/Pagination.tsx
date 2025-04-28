import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      endPage = Math.min(3, totalPages);
    } else if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageNumber, currentPage === i && styles.activePage]}
          onPress={() => handlePageChange(i)}
        >
          <Text
            style={currentPage === i ? styles.activePageText : styles.pageText}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[styles.arrowButton, currentPage === 1 && styles.disabledButton]}
        onPress={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text style={styles.arrowText}>&lt;</Text>
      </TouchableOpacity>

      {renderPageNumbers()}

      <TouchableOpacity
        style={[
          styles.arrowButton,
          currentPage === totalPages && styles.disabledButton,
        ]}
        onPress={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.arrowText}>&gt;</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    borderColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderWidth: 1,
    width: '40%',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 15,
  },
  arrowButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  pageNumber: {
    minWidth: 30,
    padding: 2,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePage: {},
  pageText: {
    fontSize: 16,
    color: '#000',
  },
  activePageText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Pagination;
