Table AUTH {
  id int [pk]
  email text
  password text
}

Table USER {
  id int [pk, ref: > AUTH.id]
  username text
  name text
  preferences JSONB
  lastname text
  token int
  age int
  has_subscription bool
  xp int
}

Table QUEST {
  id int [pk]
  title text
  description text
  amount_target int
  key_target text
  xp int
 
}

Table QUEST_PROGRESS {
  id int [pk]
  id_user int [ref: > USER.id]
  id_quest int
  progression int
  valided bool
}

Table WEBNOVELS {
  id int [pk]
  id_author int [ref: > USER.id]
  pitch text
  synopsis text
  characters jsonb
  genre text
  publish bool
  is_over bool
}

Table WEBNOVELS_EPISODE {
  id int [pk]
  id_webnovels int [ref: > WEBNOVELS.id]
  number int
  content text
}

Table WEBNOVELS_HISTORY {
  id int [pk]
  id_webnovels int [ref: > WEBNOVELS.id]
  id_user int [ref: > USER.id]
  id_webnovels_episode int [ref: > WEBNOVELS_EPISODE.id]
  is_over bool
}

Table WEBNOVELS_LIKES {
  id int [pk]
  id_webnovels int [ref: > WEBNOVELS.id]
  id_user int [ref: > USER.id]
}

Table WEBNOVELS_COMMENT {
  id int [pk]
  id_webnovels int [ref: > WEBNOVELS.id]
  id_user int [ref: > USER.id]
  parent_comment_id int [ref: > WEBNOVELS_COMMENT.id, null]
  content text
}

Table SHOP_TOKEN {
  id int [pk]
  price float
  title text
  token_amount int
}

Table SHOP_SUBSCRIPTION {
  id int [pk]
  price float
  title text
}

Table USER_NOTIFICATION {
  id int [pk]
  id_user int [ref: > USER.id]
  title text
  message text
  is_read bool
  created_at timestamp
}

Table TRANSACTION {
  id int [pk]
  id_user int [ref: > USER.id]
  id_shop_token int [ref: > SHOP_TOKEN.id, null]
  id_shop_subscription int [ref: > SHOP_SUBSCRIPTION.id, null]
  status text
  date date
}

Ref: "QUEST_PROGRESS"."id_quest" < "QUEST"."id"
