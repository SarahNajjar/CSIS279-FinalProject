import { useDispatch, useSelector } from "react-redux";
import {
    fetchReviewsAsync,
    fetchReviewByIdAsync,
    createReviewAsync,
    updateReviewAsync,
    deleteReviewAsync,
} from "../store/reviews/reviewsSlice";

export function useReviews() {
    const dispatch = useDispatch();

    const {
        reviews,
        selectedReview,
        status,
        error
    } = useSelector((state) => state.reviews);

    return {
        reviews,
        selectedReview,
        status,
        error,

        loadReviews: () => dispatch(fetchReviewsAsync()),
        loadReview: (id) => dispatch(fetchReviewByIdAsync(id)),
        createReview: (data) => dispatch(createReviewAsync(data)),
        updateReview: (data) => dispatch(updateReviewAsync(data)),
        deleteReview: (id) => dispatch(deleteReviewAsync(id)),
    };
}
