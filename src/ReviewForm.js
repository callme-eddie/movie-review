import React, { useState } from 'react';

const ReviewForm = ({ onSubmit }) => {
  const [review, setReview] = useState('');

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(review);
    setReview('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={review}
        onChange={handleReviewChange}
        placeholder="Write your review here..."
        required
      />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
