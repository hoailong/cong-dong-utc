# select p.*, u.user_name, count(c.id_comment) as comments
# from tbl_post p left join tbl_user u on p.created_by = u.id_user
#     left join tbl_comment c on p.id_post = c.id_post
# where id_topic = 2
# group by p.id_post
# order by title desc
# limit 0, 10
#
# select * from tbl_post
# where id_topic = 2 and id_post != 80
# order by created_time desc
# limit 5
#
# select p.*, u.user_name, t.topic_name, t.topic_code, f.src
# from tbl_post p
# left join tbl_user u on p.created_by = u.id_user
# left join tbl_topic t on p.id_topic = t.id_topic
# left join tbl_forum_file f on p.id_post = f.id_post and f.type = 'photo'
# where p.id_post = 30
# group by p.id_post
#
# select p.*, f.src
# from tbl_post p
# left join tbl_forum_file f on p.id_post = f.id_post and f.type = 'photo'
# where p.id_topic = 2 and p.id_post != 30
# group by p.id_post
# order by created_time desc
# limit 5

select p.*, u.user_name, count(c.id_comment) as count_comments, count(distinct l.id_user) as count_likes
from tbl_post p
left join tbl_user u on p.created_by = u.id_user
left join tbl_forum_comment c on p.id_post = c.id_post
left join tbl_forum_like l on p.id_post = l.id_post
where id_topic = 2
group by p.id_post
order by created_time desc

select l.*
from tbl_forum_comment_like l
inner join tbl_forum_comment c
on c.id_comment = l.id_comment
where c.id_post =

delete from tbl_forum_comment_like
where id_comment in (select id_comment from tbl_forum_comment where id_parent = 305)

alter table tbl_doc_comment_like ADD PRIMARY KEY (id_comment, id_user);
alter table tbl_doc_like ADD PRIMARY KEY (id_doc, id_user);

select * from tbl_doc_file where id_doc = 'DT-c0c88a6a-25d5-48fa-b23e-095afabc5252'

select c.created_time, c.id_post, u.user_name, c.content
from tbl_forum_comment c
inner join tbl_user u on c.id_user = u.id_user
order by created_time asc

select p.*, u.user_name, count(distinct c.id_comment) as count_comments, count(distinct l.id_user) as count_likes, lc.created_time as recent_time, lc.id_user as recent_id_user, lc.user_name as recent_user_name
from tbl_post p
left join tbl_user u on p.created_by = u.id_user
left join tbl_forum_comment c on p.id_post = c.id_post
left join tbl_forum_like l on p.id_post = l.id_post
left join (
    select DISTINCT cc.created_time, cc.id_post, cc.id_user, u.user_name
    from tbl_forum_comment cc
    inner join tbl_user u on cc.id_user = u.id_user
    order by cc.created_time desc ) as lc on p.id_post = lc.id_post
where id_topic = 2
group by p.id_post
order by p.created_time desc
limit 0, 10

# mysqldump -u root -p cong_dong_utc > testdb.sql