import PropTypes from 'prop-types';

import CognitiveTask from '../../content/cognitive_task/Settings';
import CognitiveTask2 from '../../content/cognitive_task2/Settings';
import DFE from '../../content/dfe/Settings';
import MetaSampling from '../../content/meta_sampling/Settings';
import PL_PATTERN from '../../content/pl_pattern/Settings';
import PointsGame from '../../content/points_game/Settings';
import PointsGameSh from '../../content/points_game_sh/Settings';
import RepeatedChoice from '../../content/repeated_choice/Settings';
import QueenGarden from '../../content/queen_garden/Settings';
import QueenGarden2 from '../../content/queen_garden_2/Settings';
import QueenGarden3 from '../../content/queen_garden_3/Settings';
import SP from '../../content/sp/Settings';
import Trivia from '../../content/trivia/Settings';
import MindGame from '../../content/mind_game/Settings';
import MixedGame from '../../content/mixed_game/Settings';
import TryOrGiveUp from '../../content/try_or_give_up/Settings';
import WordPuzzle from '../../content/word_puzzle/Settings';
import ReversibleMatrices from '../../content/reversible_matrices/Settings';
import SignatureTimingEffect from '../../content/signature_timing_effect/Settings';
import CupsGame from '../../content/cups_game/Settings';
import NoCupsGame from '../../content/no_cups_game/Settings';
import AbstractAndDeclarationEffect from '../../content/abstract_and_declaration_effect/Settings';
import SignatureAsReminder from '../../content/signature_as_reminder/Settings';

const EXPERIMENTS_LIST = {
    CognitiveTask,
    CognitiveTask2,
    DFE,
    MetaSampling,
    PL_PATTERN,
    PointsGame,
    PointsGameSh,
    RepeatedChoice,
    QueenGarden,
    QueenGarden2,
    QueenGarden3,
    SP,
    TryOrGiveUp,
    Trivia,
    MindGame,
    MixedGame,
    WordPuzzle,
    ReversibleMatrices,
    SignatureTimingEffect,
    CupsGame,
    NoCupsGame,
    AbstractAndDeclarationEffect,
    SignatureAsReminder,
};

const loadExpSetting = ({exp}) => {
    return EXPERIMENTS_LIST[exp];
};

loadExpSetting.propTypes = {
    exp: PropTypes.string.isRequired,
    exp_settings: PropTypes.object.isRequired,
};

export default loadExpSetting;


