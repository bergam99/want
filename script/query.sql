SELECT 
  publisher, 
  COUNT(*) AS review_count, 
  SUM(like_count) AS total_likes
FROM t_reviews
WHERE publisher IS NOT NULL
GROUP BY publisher;
