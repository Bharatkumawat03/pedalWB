import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Star, ThumbsUp, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import productService from '@/services/productService';
import { toast } from 'sonner';

interface ReviewsSectionProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

const ReviewsSection = ({ productId, averageRating, totalReviews }: ReviewsSectionProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user;

  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [ratingDistribution, setRatingDistribution] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [canRate, setCanRate] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (isAuthenticated) {
      checkCanRate();
    }
  }, [productId, isAuthenticated]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductReviews(productId, 1, 10, 'newest', 'review');
      setReviews(response.data || []);
      setRatingDistribution(response.ratingDistribution || {});
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const checkCanRate = async () => {
    try {
      const response = await productService.canUserRate(productId);
      setCanRate(response.data?.canRate || false);
      setHasRated(response.data?.hasRated || false);
      setExistingRating(response.data?.existingRating || null);
      
      if (existingRating) {
        setRating(existingRating.rating || 0);
      }
    } catch (error: any) {
      console.error('Error checking rating eligibility:', error);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to rate this product');
      return;
    }

    try {
      setSubmitting(true);
      await productService.submitRating(productId, rating);
      toast.success('Rating submitted successfully!');
      setShowRatingForm(false);
      setHasRated(true);
      await fetchReviews();
      await checkCanRate();
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewTitle.trim() || !reviewComment.trim() || rating === 0) {
      toast.error('Please fill in all fields and select a rating');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to review this product');
      return;
    }

    try {
      setSubmitting(true);
      await productService.submitReview(productId, {
        rating,
        title: reviewTitle,
        comment: reviewComment
      });
      toast.success('Review submitted successfully! It will be published after approval.');
      setShowReviewForm(false);
      setReviewTitle('');
      setReviewComment('');
      setRating(0);
      setHasRated(true);
      await fetchReviews();
      await checkCanRate();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingPercentage = (stars: number): number => {
    const total = Object.values(ratingDistribution).reduce((sum: number, count: any) => {
      const numCount = typeof count === 'number' ? count : Number(count) || 0;
      return sum + numCount;
    }, 0);
    if (total === 0) return 0;
    const starCountValue = ratingDistribution[stars];
    let starCount = 0;
    if (typeof starCountValue === 'number') {
      starCount = starCountValue;
    } else {
      starCount = Number(starCountValue) || 0;
    }
    return (starCount / total) * 100;
  };

  const totalRatings = Object.values(ratingDistribution).reduce((sum: number, count: any) => sum + (Number(count) || 0), 0);

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="text-center space-y-4">
              <div>
                <div className="text-5xl font-bold text-foreground mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Based on {String(totalRatings)} {totalRatings === 1 ? 'rating' : 'ratings'}
                </p>
              </div>
              
              {isAuthenticated && canRate && !hasRated && (
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      setShowRatingForm(!showRatingForm);
                      setShowReviewForm(false);
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    Rate this Product
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowReviewForm(!showReviewForm);
                      setShowRatingForm(false);
                    }}
                    className="w-full"
                    variant="default"
                  >
                    Write a Review
                  </Button>
                </div>
              )}

              {isAuthenticated && canRate && hasRated && (
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      setShowReviewForm(!showReviewForm);
                      setShowRatingForm(false);
                    }}
                    className="w-full"
                    variant="default"
                    disabled={existingRating?.type === 'review'}
                  >
                    {existingRating?.type === 'review' ? 'Review Already Submitted' : 'Write a Review'}
                  </Button>
                  {existingRating?.type === 'rating' && (
                    <Button 
                      onClick={() => {
                        setShowRatingForm(true);
                        setShowReviewForm(false);
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      Update Rating
                    </Button>
                  )}
                </div>
              )}

              {isAuthenticated && !canRate && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You can only rate/review products after delivery
                  </AlertDescription>
                </Alert>
              )}

              {!isAuthenticated && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please login to rate or review this product
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-medium">{stars}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <Progress value={getRatingPercentage(stars)} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {Number(ratingDistribution[stars]) || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Form (Rating Only) */}
      {showRatingForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Rate this Product</h3>
            <form onSubmit={handleSubmitRating} className="space-y-4">
              <div>
                <Label>Your Rating *</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  You can add a written review later
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Rating'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRatingForm(false);
                    if (!existingRating) setRating(0);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Review Form (Rating + Text) */}
      {showReviewForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Write Your Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label>Your Rating *</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="review-title">Review Title *</Label>
                <Input
                  id="review-title"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Give your review a title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="review-comment">Your Review *</Label>
                <Textarea
                  id="review-comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product"
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewTitle('');
                    setReviewComment('');
                    if (!existingRating) setRating(0);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground">Customer Reviews</h3>
        
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Loading reviews...</p>
            </CardContent>
          </Card>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id || review.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.user?.firstName?.charAt(0).toUpperCase() || 
                         review.userName?.charAt(0).toUpperCase() || 
                         'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">
                              {review.user?.firstName && review.user?.lastName
                                ? `${review.user.firstName} ${review.user.lastName}`
                                : review.userName || 'Anonymous'}
                            </span>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt || review.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {review.title && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">
                            {review.title}
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Helpful ({review.helpful || 0})
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
