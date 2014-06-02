--test data for website development

--Basic registered user(userame:"oneone",passpord:"111111")
INSERT INTO `replaceport`.`users` (`id`, `username`, `password`, `email`, `alias`, `status`, `verify`, `locale`, `expires`, `created`, `modified`) VALUES ('1', 'oneone', '96e79218965eb72c92a549dd5a330112', 'one@one.com', 'OneOne', 'active', NULL, 'en', '2015-05-31 04:55:12', '2014-05-10 04:55:25', '2014-05-10 04:55:32');

--Project owner user(userame:"twotwo",passpord:"222222")
INSERT INTO `replaceport`.`users` (`id`, `username`, `password`, `email`, `alias`, `status`, `verify`, `locale`, `expires`, `created`, `modified`) VALUES ('2', 'twotwo', 'e3ceb5881a0a1fdaad01296d7554868d', 'two@two.com', 'TwoTwo', 'active', NULL, 'en', '2014-05-31 05:01:06', '2014-05-10 05:01:14', '2014-05-10 05:01:20');

--Project contributor user(userame:"threethree",passpord:"333333")
INSERT INTO `replaceport`.`users` (`id`, `username`, `password`, `email`, `alias`, `status`, `verify`, `locale`, `expires`, `created`, `modified`) VALUES ('3', 'threethree', '1a100d2c0dab19c4430e7d73762b3423', 'three@three.com', 'ThreeThree', 'active', NULL, 'en', '2014-05-31 05:03:38', '2014-05-10 05:03:44', '2014-05-10 05:03:50');

--Website moderator user(userame:"fourfour",passpord:"444444")
INSERT INTO `replaceport`.`users` (`id`, `username`, `password`, `email`, `alias`, `status`, `verify`, `locale`, `expires`, `created`, `modified`) VALUES ('4', 'fourfour', '73882ab1fa529d7273da0db6b49cc4f3', 'four@four.com', 'FourFour', 'moderator', NULL, 'en', '2014-05-31 05:06:08', '2014-05-10 05:06:14', '2014-05-10 05:06:19');



--First test project, initial upload data by twotwo
INSERT INTO `replaceport`.`projects` (`id`, `key`, `category_id`, `owner_id`, `image_id`, `thumb_id`, `title`, `summary`, `version`, `description`, `comments`, `rating`, `created`, `modified`) VALUES ('1', 'twos-mod', '3', '1', '3', '4', 'Two''s Module', 'This is the first test mod fixture around which user interfaction will be developed.', '1.0', 'This is the first test mod fixture around which user interfaction will be developed.

[B]title test[/B]

This description area is going to use BB tags to display the project description. This will allow users to format their description and include links, etc, directly into the description.

This field is a TEXT field so project owner''s will get over 65000 characters to describe their module. A bit more than twitter.', '4', '2014-05-10 23:27:14', '2014-05-10 23:27:22');

INSERT INTO `replaceport`.`contributors` (`id`, `user_id`, `project_id`, `status`, `created`, `modified`) VALUES ('1', '2', '1', 'owner', '2014-05-11 02:35:09', '2014-05-11 02:35:09');

INSERT INTO `replaceport`.`changelogs` (`id`, `project_id`, `contributor_id`, `public`, `game_major`, `game_minor`, `game_revision`, `game_build`, `project_major`, `project_minor`, `project_revision`, `project_build`, `comment`, `created`, `modified`) VALUES ('1', '1', '1', '1', '0', '23', '5', NULL, '1', '0', NULL, NULL, 'This is the first upload of the project. Like the project description field this will store formatting using BB which will be created in a tinyMCE UI applet.

[U]format test[/U]

In the chagelog field, because this description can be long, there will be an accordian list of changes with a toggle to view this description. Cool.

I''m thinking of making all project changelogs downloadable as a single file.', '2014-05-10 23:33:15', '2014-05-10 23:34:09');

INSERT INTO `replaceport`.`files` (`id`, `project_id`, `changelog_id`, `name`, `format`, `location`, `mirror`, `size`, `attributes`, `created`, `modified`) VALUES ('1', '1', '1', 'twos-mod.1.0', 'zip', 'release/', NULL, '181', NULL, '2014-05-11 00:17:03', '2014-05-11 00:17:03');

INSERT INTO `replaceport`.`files` (`id`, `project_id`, `changelog_id`, `name`, `format`, `location`, `mirror`, `size`, `attributes`, `created`, `modified`) VALUES ('3', '1', NULL, 'banner', 'png', 'images/', NULL, '239256', '{"title":"My Rocket","width":2400,"height":2400}', '2014-05-11 04:42:27', '2014-05-11 04:42:32');

INSERT INTO `replaceport`.`files` (`id`, `project_id`, `changelog_id`, `name`, `format`, `location`, `mirror`, `size`, `attributes`, `created`, `modified`) VALUES ('4', '1', NULL, 'thumbnail', 'png', 'images/', NULL, '239256', '{"title":"My Rocket","width":2400,"height":2400}', '2014-05-11 04:42:27', '2014-05-11 04:42:32');

INSERT INTO `replaceport`.`files` (`id`, `project_id`, `changelog_id`, `name`, `format`, `location`, `mirror`, `size`, `attributes`, `created`, `modified`) VALUES ('5', '1', NULL, 'readme', 'txt', 'assets/', NULL, '1287', NULL, '2014-05-11 04:48:04', '2014-05-11 04:48:09');

INSERT INTO `replaceport`.`tags` (`id`, `project_id`, `tag`, `active`, `created`) VALUES ('1', '1', 'test', '1', '2014-05-11 00:22:43');



--Test user interaction with test project
INSERT INTO `replaceport`.`ratings` (`id`, `user_id`, `project_id`, `value`, `created`) VALUES ('1', '1', '1', '4', '2014-05-11 00:26:54');

INSERT INTO `replaceport`.`watchlists` (`id`, `user_id`, `project_id`, `status`, `created`, `modified`) VALUES ('1', '1', '1', '1', '2014-05-11 00:27:46', '2014-05-11 00:27:53');

INSERT INTO `replaceport`.`comments` (`id`, `project_id`, `user_id`, `comment`, `created`, `modified`) VALUES ('1', '1', '1', 'This is a comment. Like all description fields this field uses BB code to store data formatting.

[I] formatting test[/I]

In the script the actual comment is going to be reduced by an arbitrary amount. Maybe somewhere in the vicinity of 500 words, which would translate to about 8000chars.', '2014-05-11 00:30:53', '2014-05-11 00:30:59');

INSERT INTO `replaceport`.`reports` (`id`, `user_id`, `project_id`, `comment`, `status`, `outcome`, `created`, `modified`) VALUES ('1', '1', '1', 'I don''t like this module after all. It sucks!', 'active', NULL, '2014-05-11 00:32:30', '2014-05-11 00:32:37');

INSERT INTO `replaceport`.`downloads` (`id`, `project_id`, `file_id`, `created`) VALUES ('1', '1', '1', '2014-05-11 00:34:03');



--Adding a contributor
INSERT INTO `replaceport`.`contributors` (`id`, `user_id`, `project_id`, `status`, `created`, `modified`) VALUES ('2', '3', '1', 'developer', '2014-05-11 02:47:56', '2014-05-11 02:48:04');

--Adding an internal file version
INSERT INTO `replaceport`.`changelogs` (`id`, `project_id`, `contributor_id`, `public`, `game_major`, `game_minor`, `game_revision`, `game_build`, `project_major`, `project_minor`, `project_revision`, `project_build`, `comment`, `created`, `modified`) VALUES ('2', '1', '2', '0', '0', '23', '5', NULL, '1', '0', '0', '1', 'This is an untested build by the new contributor', '2014-05-11 02:58:01', '2014-05-11 02:58:11');

INSERT INTO `replaceport`.`files` (`id`, `project_id`, `changelog_id`, `name`, `format`, `location`, `mirror`, `size`, `attributes`, `created`, `modified`) VALUES ('2', '1', '2', 'twos-mod.1.0.0.1', 'zip', 'builds/', NULL, '181', NULL, '2014-05-11 03:02:22', '2014-05-11 03:02:30');



--Adding a module extension by external author(threethree)
INSERT INTO `replaceport`.`projects` (`id`, `key`, `category_id`, `owner_id`, `image_id`, `thumb_id`, `title`, `summary`, `version`, `description`, `comments`, `rating`, `created`, `modified`) VALUES ('2', 'threes-mod', '11', '3', '7', '8', 'Three''s Module', 'This is a part file which uses Two''s Module to work', '1.0', 'I cannot be bothered writing a long description for this module. Ha!

One thing to note, this module will have comments disabled.', '0', '2014-05-11 04:53:48', '2014-05-11 04:53:52');

INSERT INTO `replaceport`.`contributors` (`id`, `user_id`, `project_id`, `status`, `created`, `modified`) VALUES ('3', '3', '2', 'owner', '2014-05-11 06:06:03', '2014-05-11 06:06:10');

INSERT INTO `replaceport`.`changelogs` (`id`, `project_id`, `contributor_id`, `public`, `game_major`, `game_minor`, `game_revision`, `game_build`, `project_major`, `project_minor`, `project_revision`, `project_build`, `comment`, `created`, `modified`) VALUES ('3', '2', '3', '1', '0', '23', '5', NULL, '1', '0', NULL, NULL, 'This is the first release of a part for twotwo''s module', '2014-05-11 06:07:55', '2014-05-11 06:08:08');

INSERT INTO `replaceport`.`dependencies` (`id`, `project_id`, `changelog_id`, `require_id`, `created`, `modified`) VALUES ('1', '2', '3', '1', '2014-05-11 06:09:24', '2014-05-11 06:09:30');

INSERT INTO `replaceport`.`files` (`id`, `project_id`, `changelog_id`, `name`, `format`, `location`, `mirror`, `size`, `attributes`, `created`, `modified`) VALUES ('6', '2', '3', 'threes-mod.1.0', 'zip', 'release/', NULL, '181', NULL, '2014-05-11 04:58:01', '2014-05-11 04:58:06');

INSERT INTO `replaceport`.`files` (`id`, `project_id`, `changelog_id`, `name`, `format`, `location`, `mirror`, `size`, `attributes`, `created`, `modified`) VALUES ('7', '2', NULL, 'banner', 'png', 'images/', NULL, '239256', '{"title":"My Rocket","width":2400,"height":2400}', '2014-05-11 04:58:06', '2014-05-11 04:58:06');

INSERT INTO `replaceport`.`files` (`id`, `project_id`, `changelog_id`, `name`, `format`, `location`, `mirror`, `size`, `attributes`, `created`, `modified`) VALUES ('8', '2', NULL, 'thumbnail', 'png', 'images/', NULL, '239256', '{"title":"My Rocket","width":2400,"height":2400}', '2014-05-11 04:58:06', '2014-05-11 04:58:06');

INSERT INTO `replaceport`.`tags` (`id`, `project_id`, `tag`, `active`, `created`) VALUES ('2', '2', 'rocket', '1', '2014-05-11 06:10:26');