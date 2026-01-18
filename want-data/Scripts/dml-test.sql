DELETE FROM want_test.t_users;
DELETE FROM want_test.t_reviews;
DELETE FROM want_test.t_review_likes;

INSERT INTO want_test.t_users (email, password) VALUES
('alice@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456'),
('bob@example.com', '$2a$10$123456abcdefghijklmnopqrstuvwxyz'),
('charlie@example.com', '$2a$10$zyxwvutsrqponmlkjihgfedcba654321');

INSERT INTO want_test.t_reviews (osm_id, user_id, comment, rating, time_stamp, like_count) VALUES
(123456789, 1, 'content1', 5, '2025-12-07 12:05:52+00', 2),
(123456789, 2, 'content2', 4, '2025-12-07 12:08:10+00', 1),
(987654321, 1, 'content3', 2, '2025-12-07 14:00:00+00', 0);

INSERT INTO want_test.t_review_likes (review_id, user_id) VALUES
(1, 2), 
(1, 3), 
(2, 1); 