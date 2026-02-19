/feed?page=1&limit => 1-10 => .skip(0) & .limit(10)
/feed?page=2&limit=10 => 11-20;

skip = (page-1)*limit