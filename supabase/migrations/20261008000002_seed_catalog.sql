-- Shared catalog seed: Tampa + Nashville places, badges, quests, feed picks.
-- Dates are relative to when this runs. Re-seed (or edit quests.ends_at) when they expire.

insert into public.places (id, name, city, neighborhood, lat, lng, cuisines, price_tier, is_new_opening, opened_on) values
  ('p1',  'La Esquina Cubana',          'Tampa',     'Ybor City',         27.9604, -82.4388, '{Cuban,Sandwiches}',         1, false, now() - interval '900 days'),
  ('p2',  'Salt & Ember',               'Tampa',     'Seminole Heights',  27.9930, -82.4640, '{"New American",Wood-fired}', 3, false, now() - interval '900 days'),
  ('p3',  'Sunrise Pho House',          'Tampa',     'Seminole Heights',  27.9985, -82.4560, '{Vietnamese,Noodles}',       2, true,  now() - interval '21 days'),
  ('p4',  'Casa Marisol',               'Tampa',     'Tampa Heights',     27.9650, -82.4630, '{Mexican,Tacos}',            2, false, now() - interval '900 days'),
  ('p5',  'Gulf Pearl Oyster Bar',      'Tampa',     'Channelside',       27.9440, -82.4510, '{Seafood,Oysters}',          3, false, now() - interval '900 days'),
  ('p6',  'Pastelería Luna',            'Tampa',     'Ybor City',         27.9610, -82.4400, '{Bakery,Cuban}',             1, true,  now() - interval '34 days'),
  ('p13', 'Tidewater Dumpling Bar',     'Tampa',     'Channelside',       27.9452, -82.4535, '{Chinese,Dumplings}',        2, false, now() - interval '900 days'),
  ('p7',  'Hattie''s Hot Chicken Shack','Nashville', 'East Nashville',    36.1790, -86.7440, '{"Hot Chicken",Southern}',   1, false, now() - interval '900 days'),
  ('p8',  'Fig & Thistle',              'Nashville', 'The Gulch',         36.1520, -86.7890, '{"New American","Tasting menu"}', 4, true, now() - interval '14 days'),
  ('p9',  'Midnight Noodle Co.',        'Nashville', 'Germantown',        36.1800, -86.7890, '{Japanese,Ramen}',           2, true,  now() - interval '40 days'),
  ('p10', 'Biscuit Church',             'Nashville', '12 South',          36.1230, -86.7900, '{Southern,Brunch}',          2, false, now() - interval '900 days'),
  ('p11', 'Tía Rosa''s Taquería',       'Nashville', 'Wedgewood-Houston', 36.1380, -86.7650, '{Mexican,Tacos}',            1, false, now() - interval '900 days'),
  ('p12', 'Bolt Hot Chicken & Beer',    'Nashville', 'Sylvan Park',       36.1500, -86.8350, '{"Hot Chicken",Southern}',   2, false, now() - interval '900 days'),
  ('p14', 'Magnolia & Mint',            'Nashville', '12 South',          36.1245, -86.7885, '{Brunch,Southern}',          2, false, now() - interval '900 days');

insert into public.badges (id, name, icon, description) values
  ('first-bite',         'First Bite',         '🍴', 'Logged your very first visit.'),
  ('streak-3',           'On a Roll',          '🔥', 'Logged three days in a row.'),
  ('two-cities',         'Two-City Taster',    '✈️', 'Logged visits in two cities.'),
  ('transparent-taster', 'Transparent Taster', '🪟', 'Logged a sponsored visit and named the sponsor.'),
  ('b-cuban',            'Pressed & Proud',    '🥪', 'Finished the Cuban Sandwich Showdown.'),
  ('b-heat',             'Heat Seeker',        '🌶️', 'Finished the Hot Chicken Heat Check.'),
  ('b-scout',            'Opening Scout',      '🔭', 'Visited new Nashville openings early.'),
  ('b-heights',          'Heights Explorer',   '🏘️', 'Got to know Seminole Heights.');

insert into public.quests (id, title, description, city, starts_at, ends_at, rules, reward_points, badge_id, sponsor_name, criteria) values
  ('q1', 'Cuban Sandwich Showdown', 'Compare the Cuban sandwich at two different spots. Pay attention to the bread and the pickle ratio.',
    'Tampa', now() - interval '30 days', now() + interval '60 days',
    '{"Log a Cuban sandwich at 2 different places in Tampa","Repeat visits to the same place count once"}',
    50, 'b-cuban', null, '{"kind":"dish-match","keywords":["cuban"],"target":2}'),
  ('q2', 'Hot Chicken Heat Check', 'Find the heat level that is right for you, at two different joints.',
    'Nashville', now() - interval '30 days', now() + interval '60 days',
    '{"Log a hot chicken dish at 2 different places in Nashville","Note the heat level you ordered"}',
    60, 'b-heat', null, '{"kind":"dish-match","keywords":["hot chicken"],"target":2}'),
  ('q3', 'New in Nashville', 'Be early. Visit two spots that opened in the last few months.',
    'Nashville', now() - interval '30 days', now() + interval '45 days',
    '{"Log 2 recent openings in Nashville","Sponsored quest: say so in your posts"}',
    75, 'b-scout', 'Fork & Compass Travel', '{"kind":"new-openings","target":2}'),
  ('q4', 'Seminole Heights Sampler', 'Pick a neighborhood and get to know it. Two very different tables, one afternoon or a month, up to you.',
    'Tampa', now() - interval '30 days', now() + interval '90 days',
    '{"Log 2 different places in Seminole Heights","Dishes you would order again are a bonus, not a requirement"}',
    40, 'b-heights', null, '{"kind":"neighborhood","neighborhood":"Seminole Heights","target":2}');

insert into public.feed_items (id, place_id, reason, is_sponsored, quest_id) values
  ('f1', 'p3',  'Just opened in Seminole Heights, and you love Vietnamese.', false, 'q4'),
  ('f2', 'p5',  'Happy-hour oysters with a waterfront view.', true, null),
  ('f3', 'p6',  'A new Ybor bakery. A natural next stop on your Cuban sandwich trail.', false, 'q1'),
  ('f4', 'p13', 'Hand-folded dumplings, and a good place to bring a crew.', true, null),
  ('f5', 'p8',  'Tasting menu that opened two weeks ago. Counts toward New in Nashville.', true, 'q3'),
  ('f6', 'p11', 'Great tacos in a spot you have not tried. Matches your love of Mexican.', false, null),
  ('f7', 'p12', 'A second hot chicken stop to finish your Heat Check.', false, 'q2'),
  ('f8', 'p14', 'Southern brunch around the corner from where you ate last time.', false, null);
