export const WAGON_ANIMATION_TIMING = 1000;

export const BoardInitialState = () => ({
  wagon_place: 'base',
  flowers: ['red', 'yellow', 'purple', 'blue', 'pink'],
  hide_flower: false,
  flower_on_wagon: true,
  disable_castle_click: true,
  disable_road_click: true,
});

export const PLACES_LEVELS = [
  '1', '2', 'base', '3', '4', 'queen',
  'castle_toll_finish_queen',
  'castle_toll_1', 'castle_toll_2', 'castle_toll_3', 'castle_toll_4', 'castle_toll_queen',
  'castle_return_1', 'castle_return_2', 'castle_return_3', 'castle_return_4', 'castle_return_queen',
  'castle_toll_finish_1', 'castle_toll_finish_2', 'castle_toll_finish_3', 'castle_toll_finish_4',
  'castle_toll_finish_to_end_1', 'castle_full_1', 'castle_full_2', 'castle_full_3', 'castle_full_4', 'castle_full_queen',
];

// castle_toll_finish_to_end_1
