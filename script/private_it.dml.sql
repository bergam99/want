INSERT INTO private_it.t_users (email, password)
VALUES
    ('user1@example.com', 'pw1'),
    ('user2@example.com', 'pw2');


INSERT INTO private_it.t_reviews (
    osm_id, user_id, comment, rating, amenity, time_stamp
) VALUES 
    (123456789, 1, 'comment1', 5, 'toilet', NOW()),
    (123414121, 2, 'comment2', 3, 'water', NOW()),
    (123456789, 2, 'comment3', 4, 'toilet', NOW());
    



