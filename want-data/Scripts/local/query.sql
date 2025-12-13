select u.email from t_users u;

select * from t_reviews r where r.rating = 5;

select u.email, count(*) as totalReview from t_users u join t_reviews r on u.id = r.user_id group by u.email order by totalreview desc limit 1;

select r.id , like_count from t_reviews r join t_review_likes trl on r.id = trl.review_id order by like_count desc limit 1;

select * from t_users u left join t_reviews r on u.id = r.user_id where r.id isnull;

select * from t_users u join t_review_likes trl on u.id = trl.user_id join t_reviews r on u.id =r.user_id where u.id =4; 

select u.email, r.osm_id, r."comment" from t_users u join t_reviews r on u.id = r.user_id;

select count(*) from t_reviews r;

select u.email, r.comment from t_users u inner join t_reviews r on u.id = r.user_id;

select u.email, r.comment from t_users u left join t_reviews r on u.id = r.user_id; 


SELECT COUNT(*) AS like_count
FROM t_review_likes
WHERE review_id = 1;

