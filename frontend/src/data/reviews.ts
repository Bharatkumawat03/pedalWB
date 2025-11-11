export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

// Mock reviews data
export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: 'Rajesh Kumar',
    rating: 5,
    title: 'Excellent performance!',
    comment: 'This derailleur is absolutely fantastic. Smooth shifting and very reliable. The wireless technology works flawlessly even in rough terrain. Highly recommended for serious cyclists.',
    date: '2024-03-15',
    verified: true,
    helpful: 24
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'Priya Sharma',
    rating: 4,
    title: 'Great quality but pricey',
    comment: 'The build quality is exceptional and shifting is buttery smooth. Installation was straightforward. Only complaint is the price, but you get what you pay for.',
    date: '2024-03-10',
    verified: true,
    helpful: 18
  },
  {
    id: '3',
    productId: '1',
    userId: 'user3',
    userName: 'Amit Patel',
    rating: 5,
    title: 'Worth every rupee',
    comment: 'Upgraded from a mechanical system and the difference is night and day. Battery life is excellent, and the wireless setup keeps my bike looking clean. Best purchase this year!',
    date: '2024-02-28',
    verified: true,
    helpful: 31
  },
  {
    id: '4',
    productId: '2',
    userId: 'user4',
    userName: 'Sneha Reddy',
    rating: 5,
    title: 'Best helmet I have owned',
    comment: 'Extremely comfortable and lightweight. The ventilation is perfect for long rides in hot weather. Safety certifications give me peace of mind. Highly recommend!',
    date: '2024-03-12',
    verified: true,
    helpful: 15
  },
  {
    id: '5',
    productId: '2',
    userId: 'user5',
    userName: 'Vikram Singh',
    rating: 4,
    title: 'Good helmet with minor fit issues',
    comment: 'Overall a solid helmet with good protection. The fit system works well but took some adjustment. Looks great and feels secure. Would buy again.',
    date: '2024-03-05',
    verified: false,
    helpful: 8
  }
];

export const getProductReviews = (productId: string): Review[] => {
  return reviews.filter(review => review.productId === productId);
};

export const getAverageRating = (productId: string): number => {
  const productReviews = getProductReviews(productId);
  if (productReviews.length === 0) return 0;
  const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / productReviews.length;
};

export const getRatingDistribution = (productId: string): { [key: number]: number } => {
  const productReviews = getProductReviews(productId);
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  productReviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++;
  });
  
  return distribution;
};
