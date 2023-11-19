export const WAGON_ANIMATION_TIMING = 1000;
export const TREES_ROADS_WIDTH = 0.65*window.innerWidth;
export const TREES_ROADS_HEIGHT = 0.4*window.innerHeight;
export const TREE_WIDTH = 0.7 * (TREES_ROADS_HEIGHT/6);
export const TREE_HEIGHT = TREES_ROADS_HEIGHT/6 + 5;

export const BoardInitialState = (mode) => ({
  wagon_place: 'base',
  flowers: ['red', 'yellow', 'grin', 'blue', 'pink'],
  hide_flower: false,
  disable_castle_click: true,
  disable_road_click: true,
  with_flower: mode !== 'Tutorial'
});

export const PLACES_LEVELS = [
  '1', '2', 'base', '3', '4', 'queen',
  'castle_return_1', 'castle_return_2', 'castle_return_3', 'castle_toll_4', 'castle_toll_queen',
  'castle_toll_1', 'castle_toll_2', 'castle_toll_3', 'castle_toll_4', 'castle_toll_queen',
  'castle_toll_finish_1', 'castle_toll_finish_2', 'castle_toll_finish_3', 'castle_toll_finish_4', 'castle_toll_finish_queen',
  'castle_full_1', 'castle_full_2', 'castle_full_3', 'castle_full_4', 'castle_full_queen',
];
