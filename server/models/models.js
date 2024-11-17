
const {MetaSamplingVersions, MetaSamplingUsersRecords} = require('./all_models/MetaSampling');
const {PLPatternVersions, PLPatternRecords} = require('./all_models/PL_PATTERN');
const {DFEUsersRecords, DFEVersions} = require('./all_models/DFE');
const {SPUsersRecords, SPVersions} = require('./all_models/SP');
const {RepeatedChoiceVersions, RepeatedChoiceUsersRecords} = require('./all_models/RepeatedChoice');
const {QueenGardenVersions, QueenGardenUsersRecords} = require('./all_models/QueenGarden');
const {QueenGarden2Versions, QueenGarden2UsersRecords} = require('./all_models/QueenGarden2');
const {QueenGarden3Versions, QueenGarden3UsersRecords} = require('./all_models/QueenGarden3');
const {PreferancePerformanceVersions, PreferancePerformanceUsersRecords} = require('./all_models/PreferancePerformance');
const {ReversibleMatricesVersions, ReversibleMatricesUsersRecords} = require('./all_models/ReversibleMatrices');
const {SignatureTimingEffectVersions, SignatureTimingEffectUsersRecords} = require('./all_models/SignatureTimingEffect');
const {CupsGameVersions, CupsGameUsersRecords} = require('./all_models/CupsGame');
const {NoCupsGameVersions, NoCupsGameUsersRecords} = require('./all_models/NoCupsGame');
const {CognitiveTask2Versions, CognitiveTask2UsersRecords} = require('./all_models/CognitiveTask2');
const {CognitiveTaskVersions, CognitiveTaskUsersRecords} = require('./all_models/CognitiveTask');
const {WordPuzzleVersions, WordPuzzlePuzzlesModels, WordPuzzleUsersRecords} = require('./all_models/WordPuzzle');
const {AbstractAndDeclarationEffectUsersRecords, AbstractAndDeclarationEffectVersions} = require('./all_models/AbstractAndDeclarationEffect');
const {SignatureAsReminderUsersRecords, SignatureAsReminderVersions} = require('./all_models/SignatureAsReminder');
const {PointsGameShVersions, PointsGameShUsersRecords} = require('./all_models/PointsGameSh');
const {PointsGameVersions, PointsGameUsersRecords} = require('./all_models/PointsGame');
const {MegaDotsVersions, MegaDotsUsersRecords} = require('./all_models/MegaDots');
const {TryOrGiveUpVersions, TryOrGiveUpUsersRecords} = require('./all_models/TryOrGiveUp');
const {TriviaVersions, TriviaUsersRecords} = require('./all_models/Trivia');
const {MindGameVersions, MindGameUsersRecords} = require('./all_models/MindGame');
const {MixedGameVersions, MixedGameUsersRecords} = require('./all_models/MixedGame');
const User = require('./all_models/User');
const ConsentForms = require('./all_models/ConsentForms');
const ActiveSettings = require('./all_models/ActiveSettings');
const RunningCounters = require('./all_models/RunningCounters');
const ExpDevDetails = require('./all_models/ExpDevDetails');
const ToDoList = require('./all_models/ToDoList');
const Chats = require('./all_models/Chats');
const AppSettings = require('./all_models/AppSet');
const VersionChanges = require('./all_models/VersionChanges');
const PasswordForget = require('./all_models/PasswordForget');
const IPListRunning = require('./all_models/IPListRunning');
const RejectedUsers = require('./all_models/RejectedUsers');
const OutsourcePlayIP = require('./all_models/OutsourcePlayIP');
const {getTimeDate} = require('../utils/index');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const asyncHandler = require("express-async-handler");


const isSuperAdminUser = async req => {
    const UserModel = getModelPack('User').User;
    const user_admin = await UserModel.findById(req.user.id);
    return user_admin.permission === 'SuperAdmin';

}

/*
    version: 'test',
    last_modified,
    date_modified,
    Game:
    Payments:
            sign_of_reward,
            show_up_fee,
            exchange_ratio,
            bonus_endowment,

    General:
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
 */

const getModelPack = model => {

    try {
        console.log("=======> model="+model);
        let ggg=AllModels[model];
        console.log("=======> ggg="+ggg);
        return AllModels[model];
    } catch (e) {
        return null;
    }
};

const defaultVersions = {
    MixedGame: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            force_full_screen: "false",
            cond: 'o',
            s_c: false,
            trials: 40,
            reward: 100,
            no_ask: 'None'  // ['None', 'Random', 1-10]
        },
        payments: {
            // COINSIGN: "pound",
            // SHOWUP: 2,
            // EXCHANGERATIO: 100,
            // INITIALBONUS: 0.4,
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            // TIMEOUT: "00:00",
            // EXPNAME: "",
            redirect_to: "",
            need_summary: true,
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    MindGame: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            force_full_screen: "false",
            cond: 'o',
            s_c: false,
            num_of_real_rounds: 40,
            trials: 40,
            reward: 100,
            no_ask: 'None'  // ['None', 'Random', 1-10]
        },
        payments: {
            // COINSIGN: "pound",
            // SHOWUP: 2,
            // EXCHANGERATIO: 100,
            // INITIALBONUS: 0.4,
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            // TIMEOUT: "00:00",
            // EXPNAME: "",
            redirect_to: "",
            need_summary: true,
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    
    Trivia: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            force_full_screen: "false",
            cond: 'o',
            s_c: false,
            trials: 40,
            reward: 100,
            no_ask: 'None'  // ['None', 'Random', 1-10]
        },
        payments: {
            // COINSIGN: "pound",
            // SHOWUP: 2,
            // EXCHANGERATIO: 100,
            // INITIALBONUS: 0.4,
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            // TIMEOUT: "00:00",
            // EXPNAME: "",
            redirect_to: "",
            need_summary: true,
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    TryOrGiveUp: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            r: 2, // rounds
            t: 8, // trials per round
            e_c: 2, // exploration_cost  C
            f: 1, // punishment \ reward  F
            d_p: 1.5, // display_pay_for seconds
            b_c: { // background_color
                r: 10,
                g: 0,
                b: 0,
                a: 1
            },
            mc: 3, // mat cols
            mr: 4, // mat rows
            m1c: {
                r: 95,
                g: 139,
                b: 229,
                a: 1
            }, // mat 1 color
            m2c: {
                r: 190,
                g: 186,
                b: 180,
                a: 1
            },
            H: 12,
            PH: 0.5,
            L: 1,
            MH: 2,
            PMH: 0.5,
            ML: 1,
            g_p: ['1'],
            r_f: ['1', '2', '3', '4', '5', '6'],
            r_c: 'r',
        },
        payments: {
            // COINSIGN: "pound",
            // SHOWUP: 2,
            // EXCHANGERATIO: 100,
            // INITIALBONUS: 0.4,
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            // TIMEOUT: "00:00",
            // EXPNAME: "",
            redirect_to: "",
            need_summary: true,
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    PointsGame: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            force_full_screen: "true",
            p_t: 100, // plus_time
            d_t: 100, // dots_time
            pa_t: 100, // pay_time
            p_c: {
                r: 255,
                g: 0,
                b: 0,
                a: 1}, // points color
            e_c: {
                r: 255,
                g: 50,
                b: 50,
                a: 1
            }, // enforcement background
            enb_c: {
                r: 30,
                g: 255,
                b: 30,
                a: 1
            }, // enforcement no busted background
            g_p: ['0'], // games_play
            r_o: true,
            practice: true,
            r: [], // random_from
            g_b: [
                {
                    g: {
                        l: 'default_game', // game_name
                        c: 'ne', // e -> enforce, ne => np no enforce
                        e_p: 0, // enforce probability
                        f: 10, // fine
                    },
                    pr: {
                        p_s: 10, // profitable side
                        nps: 0, // not profitable side
                    }, // profitable
                    t: {
                        a_p: 1, // Amibgous profit side
                        a_n_p: 1, // Amibgous not profit side
                        c_p: 1, // Clear profit side
                        c_n_p: 1, // Clear not profit side
                    }, // trials
                    d: {
                        a_m: 1, // Amibgous more
                        a_l: 1, // Amibgous less
                        c_m: 1, // Clear more
                        c_l: 1, // Clear less
                    }, // dots
                },
            ],  // games_bank
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    PointsGameSh: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            trials: 100,
            practice_trials: 10,
            show_points_for: 2,
            easy_low: 12,
            easy_high: 13,
            medium_low: 11,
            medium_high: 14,
            hard_low: 10,
            hard_high: 15,
            fair_honest: false,
            fair_dishonest: false,
            unfair_honest: true,
            unfair_dishonest: true,
            hourglass_timer: 3,
            pie_timer: 10,
            low_refund: 1,
            high_refund: 10,
        },
        payments: {
            sign_of_reward: "penny",
            show_up_fee: 0,
            exchange_ratio: 4,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            // redirect_to: "",
            // action_timeout: 30,
            // warning_before_closing: 0,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    MegaDots: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            force_full_screen: "true",
            p_t: 100, // plus_time
            d_t: 100, // dots_time
            pa_t: 100, // pay_time
            p_c: {
                r: 255,
                g: 0,
                b: 0,
                a: 1}, // points color
            e_c: {
                r: 255,
                g: 50,
                b: 50,
                a: 1
            }, // enforcement background
            enb_c: {
                r: 30,
                g: 255,
                b: 30,
                a: 1
            }, // enforcement no busted background
            g_p: ['0'], // games_play
            r_o: true,
            practice: true,
            r: [], // random_from
            g_b: [
                {
                    g: {
                        l: 'default_game', // game_name
                        c: 'ne', // e -> enforce, ne => np no enforce
                        e_p: 0, // enforce probability
                        f: 10, // fine
                    },
                    pr: {
                        p_s: 10, // profitable side
                        nps: 0, // not profitable side
                    }, // profitable
                    t: {
                        a_p: 1, // Amibgous profit side
                        a_n_p: 1, // Amibgous not profit side
                        c_p: 1, // Clear profit side
                        c_n_p: 1, // Clear not profit side
                    }, // trials
                    d: {
                        a_m: 1, // Amibgous more
                        a_l: 1, // Amibgous less
                        c_m: 1, // Clear more
                        c_l: 1, // Clear less
                    }, // dots
                },
            ],  // games_bank
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    WordPuzzle: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            tasks: ['Puzzles'], //['Objects', 'Puzzles', 'Ques'],
            puzzles_time_out: 3600,
            objects_time_out: 120,
            words_show_time_out: 2820,
            record_move_time_out: 500,
            objects_list: [
                "o1",
                "o2",
                "o3",
                "o4",
                "o5",
                "o6",
                "a brick",
                "a cloth hanger",
                "a broom",
                "a paperclip"
            ],
            ques_list: [
                "I feel that I am good at generating novel ideas.",
                "I have confidence in my ability to solve problems creatively.",
                "I have a knack for further developing the ideas of others.",
                "When searching for the words, I mostly concentrated on one area around the first word I found, before moving to the next area on the screen.",
                "The words in the word search puzzles were organized in clusters.",
                "When searching for the words, I mostly search the entire space on the screen.",
                "The words in the word search puzzles were spread in the entire space.",
                "Solving the word search puzzles made me feel emotionally drained.",
                "Solving the word search puzzles made me feel exhausted.",
                "Solving the word search puzzles made me feel frustrated.",
                "Please indicate the level of difficulty to find the target words in the word search puzzle, using the scale below."
            ],
            blocks_order: [
                "a paperclip",
                "a broom",
                "a cloth hanger",
                "a broom"
            ],
            ques_order: [
                "I feel that I am good at generating novel ideas.",
                "I have confidence in my ability to solve problems creatively.",
                "I have a knack for further developing the ideas of others.",
                "When searching for the words, I mostly concentrated on one area around the first word I found, before moving to the next area on the screen.",
                "The words in the word search puzzles were organized in clusters.",
                "The words in the word search puzzles were spread in the entire space.",
                "Solving the word search puzzles made me feel emotionally drained.",
                "Solving the word search puzzles made me feel frustrated.",
                "Please indicate the level of difficulty to find the target words in the word search puzzle, using the scale below."
            ],
            magnifer_shape: "Rect",
            demo_magnifer_radius: 30,
            game_magnifer_radius: 13,
            demo_magnifer_height: 60,
            demo_magnifer_width: 60,
            game_magnifer_height: 27,
            game_magnifer_width: 27,
            force_full_screen: "true",
            active_models: [
                "Sample",
            ],
            active_length: "1",
            active_size: "20X20",
            number_of_puzzles: 1,
            type_of: 'Scattered'
        },
        payments: {
            // show_up_fee: "2.4",
            // exchange_ratio: 100,
            // pay_conversion: "0.01",
            // points_conversion: "1",
            // coin_sign: "£",
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    SignatureTimingEffect: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            magnifier_shape: "Rect", //Circle Ellipse
            magnifier_radius: 30,
            magnifier_radius_y: 15,
            magnifier_height: 60,
            magnifier_width: 60,
            force_full_screen: "true",
            app_back: {
                r: 0,
                g: 0,
                b: 0,
                a: 0.1
            },
            p_s: 0,
            f_l: 'No',
            w_i: 'Yes',
            n_c: 'Yes',
            o_l: 'Hide', //'Nothing', 'Hide', 'Hide And Reset'
            o_m_u: 'Hide', //'Nothing', 'Hide', 'Hide And Reset'
            cursor: 'Hide', //'Show', 'Hide',
            s_b: 'Show', //''
            l_t: 150,
            condition: 'r',  // r n_r
            conds: ['f_d_m', 'f_d_m_a', 'f_d_m_b', 'f_d', 'e_d_m', 'e_d_m_a', 'e_d_m_b', 'e_d'],  //
            stories: [{
                story_txt: 'story text',
                questions: [
                    // {
                    //     ques: 'question#1',
                    //     answers: ['a1', 'a2']
                    // }
                ],
                active: 'True',
            }],
            bonus_ques: [
                // {
                //     ques: 'question#1',
                //     answers: ['a1', 'a2']
                // }
            ],
            c_b: []
        },
        payments: {
            // show_up_fee: "2.4",
            // exchange_ratio: 100,
            // pay_conversion: "0.01",
            // points_conversion: "1",
            // coin_sign: "£",
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    AbstractAndDeclarationEffect: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            force_full_screen: "true",
            app_back: {
                r: 0,
                g: 0,
                b: 0,
                a: 0.1
            },
            cond: 'n_d', // n_d e_d c_d u_d r
            p_s: 0,
            r_t: 100,
            m_m: 10,
            r_s: 'Yes',
            e_d_t: '',
            e_d_t_i: '',
            c_d_t: '',
            c_d_t_i: '',
            stories: [{
                story_txt: 'story text',
                abstract_txt: 'story abstract',
                questions: [
                    // {
                    //     ques: 'question#1',
                    //     answers: ['a1', 'a2'],
                    //     co: 0,
                    // }
                ],
                active: 'True',
            }],
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    SignatureAsReminder: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            f_s: "true",
            b_q: 'Yes',
            app_back: {
                r: 0,
                g: 0,
                b: 0,
                a: 0.1
            },
            a_s: 0,
            cond: 'f_d', // f_d->Declaration at first e_d->Declaration at end
            f_d_txt: '',
            f_d_chk: '',
            e_d_txt: '',
            e_d_txt2: '',
            e_d_chk: '',
            b_ques: [
                // {
                //     ques: 'question#1',
                //     answers: ['a1', 'a2'],
                //     co: 0,
                // }
            ],
            stories: [{
                pages: [],
                questions: [
                    // {
                    //     ques: 'question#1',
                    //     answers: ['a1', 'a2'],
                    //     co: 0,
                    // }
                ],
            }],
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    CupsGame: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            force_full_screen: "true",
            cond: 'g',
            s_c: false,
            trials: 100,
            reward: 100,
            cups_start: 3,
            ball_speed: 1,
            no_ask: 'None'  // ['None', 'Random', 1-10]
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    NoCupsGame: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            force_full_screen: "true",
            trials: 100,
            e_a: false,
            btn: [
                {p: 0, w: 0, l: 0},
                {p: 10, w: 0, l: 0},
                {p: 20, w: 0, l: 0},
                {p: 30, w: 0, l: 0},
                {p: 40, w: 0, l: 0},
                {p: 50, w: 0, l: 0},
                {p: 60, w: 0, l: 0},
                {p: 70, w: 0, l: 0},
                {p: 80, w: 0, l: 0},
                {p: 90, w: 0, l: 0},
                {p: 0, w: 0, l: 0},
            ]
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    CognitiveTask: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            pl_task: true,
            rt_task: true,
            rd_task: true,
            pattern_task: true,
            nfc_task: true,
            pl_number_of_trials: 200,
            pl_prob_common_bottom: 0.67,
            pl_feedback_sec: 0.5,
            pl_feedback_color: "#50a4e3",
            pattern_number_of_trials: 200,
            pattern_feedback_sec: 0.5,
            pattern_risk_rare_value: -10,
            pattern_risk_common_value: 1,
            num_of_trials_to_rare_event: 10,
            pattern_safe_value: 0,
            rd_number_of_trials: 100,
            rd_feedback_sec: 0.5,
            rd_risk_rare_value: -10,
            rd_risk_common_value: 1,
            rd_rare_prob: 0.1,
            rd_safe_value: 0,
            rt_number_of_trials: 100,
            rt_feedback_sec: 0.5,
            rt_risk_rare_value: 10,
            rt_risk_common_value: -1,
            rt_rare_prob: 0.1,
            rt_safe_value: 0,
            language_hebrew: false,
            language_english: true,
            language_german: false,
            pl_prob_common_button: 0.7,
            pl_task_check: true,
            rt_task_check: false,
            rd_task_check: true,
            pattern_task_check: false,
            nfc_task_check: true,
            random_task_order: false,
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio_pl: 100,
            exchange_ratio_rt: 100,
            exchange_ratio_rd: 100,
            exchange_ratio_pattern: 100,
            bonus_endowment: 0.4
            // location_1_name: "Online",
            // show_up1_l1: "2.5",
            // show_up1_l2: "5",
            // show_up2_l1: "3.5",
            // show_up2_l2: "55",
            // location_2_name: "Online ",
            // pay_sign_l1: "£",
            // pay_sign_l2: "£",
            // exchange_rate_pl_l1: "100",
            // exchange_rate_rt_l1: "100",
            // exchange_rate_rd_l1: "100",
            // exchange_rate_pattern_l1: "100",
            // exchange_rate_pl_l2: "2",
            // exchange_rate_rt_l2: "1",
            // exchange_rate_rd_l2: "1",
            // exchange_rate_pattern_l2: "1",
            // bonus_endowment1: "1.1",
        },
        general: {
            need_summary: true,
            // Prolific_code: "49125E54",
            // Running_label: "Real2"
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    CognitiveTask2: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            math_problems_bank: [
                {
                    math_problem: "(8*9)-8=",
                    presented_number: "64",
                    correct_choice: "true",
                    of_stock: "Practice",
                    index: 0
                },
                {
                    math_problem: "(5*9)-1=",
                    presented_number: "44",
                    correct_choice: "true",
                    of_stock: "Practice",
                    index: 1
                },
                {
                    math_problem: "(8*2)-8=",
                    presented_number: "2",
                    correct_choice: "false",
                    of_stock: "Practice",
                    index: 2
                },
                {
                    math_problem: "(9*1)+3=",
                    presented_number: "12",
                    correct_choice: "true",
                    of_stock: "Practice",
                    index: 3
                },
                {
                    math_problem: "(5*9)-5=",
                    presented_number: "45",
                    correct_choice: "false",
                    of_stock: "Practice",
                    index: 4
                },
                {
                    math_problem: "(2/1)-2=",
                    presented_number: "6",
                    correct_choice: "false",
                    of_stock: "Practice",
                    index: 5
                },
                {
                    math_problem: "(1/1)+9=",
                    presented_number: "10",
                    correct_choice: "true",
                    of_stock: "Practice",
                    index: 6
                },
                {
                    math_problem: "(2*6)-4=",
                    presented_number: "6",
                    correct_choice: "false",
                    of_stock: "Practice",
                    index: 7
                },
                {
                    math_problem: "(4*4)-4=",
                    presented_number: "8",
                    correct_choice: "false",
                    of_stock: "Practice",
                    index: 8
                },
                {
                    math_problem: "(4*5)-5=",
                    presented_number: "11",
                    correct_choice: "false",
                    of_stock: "Practice",
                    index: 9
                },
                {
                    math_problem: "(5*8)-9=",
                    presented_number: "40",
                    correct_choice: "false",
                    of_stock: "Practice",
                    index: 10
                },
                {
                    math_problem: "(6/3)+1=",
                    presented_number: "3",
                    correct_choice: "true",
                    of_stock: "Practice",
                    index: 11
                },
                {
                    math_problem: "(6/6)-0=",
                    presented_number: "1",
                    correct_choice: "true",
                    of_stock: "Practice",
                    index: 12
                },
                {
                    math_problem: "(3*7)-4=",
                    presented_number: "17",
                    correct_choice: "true",
                    of_stock: "Practice",
                    index: 13
                },
                {
                    math_problem: "(5*6)+1=",
                    presented_number: "31",
                    correct_choice: "true",
                    of_stock: "Practice",
                    index: 14
                },
                {
                    math_problem: "(4/2)+9=",
                    presented_number: "12",
                    correct_choice: "false",
                    of_stock: "Practice",
                    index: 15
                },
                {
                    math_problem: "(7/1)+6=",
                    presented_number: "13",
                    correct_choice: "true",
                    of_stock: "Practice",
                    index: 16
                },
                {
                    math_problem: "(1/1)+5=",
                    presented_number: "5",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 17
                },
                {
                    math_problem: "(2*9)-9=",
                    presented_number: "9",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 18
                },
                {
                    math_problem: "(8/2)+9=",
                    presented_number: "7",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 19
                },
                {
                    math_problem: "(5*5)+7=",
                    presented_number: "32",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 20
                },
                {
                    math_problem: "(9/1)+2=",
                    presented_number: "10",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 21
                },
                {
                    math_problem: "(8/2)-2=",
                    presented_number: "2",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 22
                },
                {
                    math_problem: "(2/2)+7=",
                    presented_number: "9",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 23
                },
                {
                    math_problem: "(9*1)-8=",
                    presented_number: "1",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 24
                },
                {
                    math_problem: "(4/2)-1=",
                    presented_number: "1",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 25
                },
                {
                    math_problem: "(4*5)-4=",
                    presented_number: "15",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 26
                },
                {
                    math_problem: "(3*4)/6=",
                    presented_number: "6",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 27
                },
                {
                    math_problem: "(3*3)-1=",
                    presented_number: "8",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 28
                },
                {
                    math_problem: "(5/5)+3=",
                    presented_number: "1",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 29
                },
                {
                    math_problem: "(5*5)-6=",
                    presented_number: "18",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 30
                },
                {
                    math_problem: "(3*6)/2=",
                    presented_number: "8",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 31
                },
                {
                    math_problem: "(3*2)-4=",
                    presented_number: "2",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 32
                },
                {
                    math_problem: "(4/4)+4=",
                    presented_number: "8",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 33
                },
                {
                    math_problem: "(3*8)-1=",
                    presented_number: "23",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 34
                },
                {
                    math_problem: "(9*1)-5=",
                    presented_number: "4",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 35
                },
                {
                    math_problem: "(6/1)+2=",
                    presented_number: "8",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 36
                },
                {
                    math_problem: "(5*6)-9=",
                    presented_number: "31",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 37
                },
                {
                    math_problem: "(5*6)-5=",
                    presented_number: "30",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 38
                },
                {
                    math_problem: "(1*9)+7=",
                    presented_number: "19",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 39
                },
                {
                    math_problem: "(8*2)+2=",
                    presented_number: "16",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 40
                },
                {
                    math_problem: "(5*6)-4=",
                    presented_number: "26",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 41
                },
                {
                    math_problem: "(4/4)-1=",
                    presented_number: "0",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 42
                },
                {
                    math_problem: "(4*6)-5=",
                    presented_number: "19",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 43
                },
                {
                    math_problem: "(6*3)+5=",
                    presented_number: "21",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 44
                },
                {
                    math_problem: "(5/5)+5=",
                    presented_number: "6",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 45
                },
                {
                    math_problem: "(5*2)/2=",
                    presented_number: "5",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 46
                },
                {
                    math_problem: "(9/1)+4=",
                    presented_number: "12",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 47
                },
                {
                    math_problem: "(4*3)+4=",
                    presented_number: "16",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 48
                },
                {
                    math_problem: "(1*8)-6=",
                    presented_number: "0",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 49
                },
                {
                    math_problem: "(5/5)-1=",
                    presented_number: "0",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 50
                },
                {
                    math_problem: "(3*4)/2=",
                    presented_number: "5",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 51
                },
                {
                    math_problem: "(4/1)-2=",
                    presented_number: "1",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 52
                },
                {
                    math_problem: "(4*5)+8=",
                    presented_number: "28",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 53
                },
                {
                    math_problem: "(8/2)+2=",
                    presented_number: "2",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 54
                },
                {
                    math_problem: "(4*2)+6=",
                    presented_number: "14",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 55
                },
                {
                    math_problem: "(3/3)+2=",
                    presented_number: "3",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 56
                },
                {
                    math_problem: "(8/8)+3=",
                    presented_number: "4",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 57
                },
                {
                    math_problem: "(5*7)+4=",
                    presented_number: "30",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 58
                },
                {
                    math_problem: "(3*8)-4=",
                    presented_number: "18",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 59
                },
                {
                    math_problem: "(5*7)-5=",
                    presented_number: "30",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 60
                },
                {
                    math_problem: "(1*2)+1=",
                    presented_number: "3",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 61
                },
                {
                    math_problem: "(2*4)+8=",
                    presented_number: "16",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 62
                },
                {
                    math_problem: "(2/2)-1=",
                    presented_number: "1",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 63
                },
                {
                    math_problem: "(8*2)-2=",
                    presented_number: "14",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 64
                },
                {
                    math_problem: "(5*5)-5=",
                    presented_number: "20",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 65
                },
                {
                    math_problem: "(5*8)-9=",
                    presented_number: "31",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 66
                },
                {
                    math_problem: "(5/5)-1=",
                    presented_number: "4",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 67
                },
                {
                    math_problem: "(2*7)-5=",
                    presented_number: "6",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 68
                },
                {
                    math_problem: "(3/3)+6=",
                    presented_number: "9",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 69
                },
                {
                    math_problem: "(1*1)+9=",
                    presented_number: "9",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 70
                },
                {
                    math_problem: "(1/1)-1=",
                    presented_number: "2",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 71
                },
                {
                    math_problem: "(1*3)+1=",
                    presented_number: "3",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 72
                },
                {
                    math_problem: "(8*2)+5=",
                    presented_number: "22",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 73
                },
                {
                    math_problem: "(7*3)-3=",
                    presented_number: "18",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 74
                },
                {
                    math_problem: "(7*2)-4=",
                    presented_number: "10",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 75
                },
                {
                    math_problem: "(9/1)+5=",
                    presented_number: "18",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 76
                },
                {
                    math_problem: "(8*8)-8=",
                    presented_number: "56",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 77
                },
                {
                    math_problem: "(5*8)-4=",
                    presented_number: "36",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 78
                },
                {
                    math_problem: "(4/4)+8=",
                    presented_number: "12",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 79
                },
                {
                    math_problem: "(4/4)-1=",
                    presented_number: "1",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 80
                },
                {
                    math_problem: "(5*5)-4=",
                    presented_number: "21",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 81
                },
                {
                    math_problem: "(2*2)-1=",
                    presented_number: "3",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 82
                },
                {
                    math_problem: "(8/2)-1=",
                    presented_number: "1",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 83
                },
                {
                    math_problem: "(4*2)-6=",
                    presented_number: "2",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 84
                },
                {
                    math_problem: "(5*5)+5=",
                    presented_number: "20",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 85
                },
                {
                    math_problem: "(3/3)+2=",
                    presented_number: "1",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 86
                },
                {
                    math_problem: "(5*5)-9=",
                    presented_number: "11",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 87
                },
                {
                    math_problem: "(9*1)-9=",
                    presented_number: "1",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 88
                },
                {
                    math_problem: "(1*4)+4=",
                    presented_number: "0",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 89
                },
                {
                    math_problem: "(9*1)+1=",
                    presented_number: "10",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 90
                },
                {
                    math_problem: "(8/4)+3=",
                    presented_number: "5",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 91
                },
                {
                    math_problem: "(10*2)-5=",
                    presented_number: "15",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 92
                },
                {
                    math_problem: "(2*3)+8=",
                    presented_number: "14",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 93
                },
                {
                    math_problem: "(4/4)+7=",
                    presented_number: "12",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 94
                },
                {
                    math_problem: "(5*8)-5=",
                    presented_number: "45",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 95
                },
                {
                    math_problem: "(4/4)+1=",
                    presented_number: "2",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 96
                },
                {
                    math_problem: "(2*5)-5=",
                    presented_number: "2",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 97
                },
                {
                    math_problem: "(5/5)+1=",
                    presented_number: "6",
                    correct_choice: "false",
                    of_stock: "Real",
                    index: 98
                },
                {
                    math_problem: "(3*5)-6=",
                    presented_number: "9",
                    correct_choice: "true",
                    of_stock: "Real",
                    index: 99
                }
            ],
            raven_source: {
                1: {
                    correct: "5",
                    of: "Real"
                },
                2: {
                    correct: "1",
                    of: "Practice"
                },
                3: {
                    correct: "7",
                    of: "Practice"
                },
                4: {
                    correct: "4",
                    of: "Real"
                },
                5: {
                    correct: "3",
                    of: "None"
                },
                6: {
                    correct: "1",
                    of: "None"
                },
                7: {
                    correct: "6",
                    of: "None"
                },
                8: {
                    correct: "1",
                    of: "Real"
                },
                9: {
                    correct: "8",
                    of: "None"
                },
                10: {
                    correct: "4",
                    of: "None"
                },
                11: {
                    correct: "5",
                    of: "Real"
                },
                12: {
                    correct: "6"
                },
                13: {
                    correct: "2"
                },
                15: {
                    of: "Real",
                    correct: "2"
                },
                16: {
                    correct: "4"
                },
                17: {
                    correct: "6"
                },
                18: {
                    of: "Real",
                    correct: "7"
                },
                19: {
                    correct: "3"
                },
                20: {
                    correct: "8"
                },
                21: {
                    of: "Real",
                    correct: "8"
                },
                22: {
                    correct: "7"
                },
                23: {
                    of: "Real",
                    correct: "6"
                },
                24: {
                    correct: "3"
                },
                25: {
                    of: "Real",
                    correct: "7"
                },
                26: {
                    correct: "2"
                },
                27: {
                    correct: "7"
                },
                28: {
                    correct: "5"
                },
                29: {
                    correct: "6"
                },
                30: {
                    of: "Real",
                    correct: "5"
                },
                31: {
                    of: "Real",
                    correct: "4"
                },
                32: {
                    correct: "8"
                },
                33: {
                    correct: "5"
                },
                35: {
                    of: "Real",
                    correct: "3"
                },
                36: {
                    correct: "2"
                }
            },
            aospan_math_practice_trials: 15,
            aospan_practice_random_order: "False",
            aospan_real_random_order: "True",
            aospan_real_repeat_each_set: 3,
            aospan_real_trials_sets1: 3,
            aospan_real_trials_sets2: 4,
            aospan_real_trials_sets3: 5,
            aospan_real_trials_sets4: 6,
            aospan_real_trials_sets5: 7,
            aospan_display_letter_time: 1,
            raven_random_order: "False",
            raven_real_trials: 12,
            raven_practice_trials: 2,
            raven_display_selection_time: 5000,
            raven1_Duration: 600000,
            language_hebrew: false,
            language_english: true,
            language_german: false,
            raven_task: true,
            aospan_task: true,
            wms_task: true,
            wms_digit_display_time: 1,
            wms_delay_between_numbers: 200,
            raven_higher_smaller_then: 5,
            aospan_higher_smaller_then: 65
        },
        payments: {
            // exchange_rate_pattern_l1: 100,
            // exchange_rate_rd_l1: 100,
            // exchange_rate_rt_l1: 100,
            // exchange_rate_pl_l1: 100,
            // pay_sign_l1: "£",
            // show_up2_l1: "3.5",
            // show_up1_l1: "2.5",
            // exchange_rate_pattern_l2: "1",
            // exchange_rate_rd_l2: "1",
            // exchange_rate_rt_l2: "1",
            // exchange_rate_pl_l2: "1",
            // pay_sign_l2: "$",
            // show_up2_l2: "1",
            // show_up1_l2: "1",
            // location_1_name: "loc1",
            // location_2_name: "loc2",
            // bonus_endowment1: "1.1",
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio_pl: 100,
            exchange_ratio_rt: 100,
            exchange_ratio_rd: 100,
            exchange_ratio_pattern: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            // Prolific_code: "70A2369B",
            // Running_label: "Real",
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    // ColoredMatrices: {
    //     version: 'test',
    //     last_modified: '-',
    //     date_modified: '-',
    //     game: {
    //         number_of_blocks: "1",
    //         amount_of_reward: "0.5",
    //         reward_display: "0.8",
    //         delay_last_choice: "0.8",
    //         probability_of_reward: "0.5",
    //         number_of_choices_per_matrix: "1",
    //         color_1: "#f65142",
    //         color_2: "#5366f7",
    //         dark_color_1: "#ca3a33",
    //         dark_color_2: "#404fb2",
    //         game_of: "Both",
    //     },
    //     payments: {
    //         // show_up_fee: "0.8",
    //         // sign_of_reward: "£",
    //         sign_of_reward: "£",
    //         show_up_fee: 1,
    //         exchange_ratio: 100,
    //         bonus_endowment: 0.4
    //     },
    //     general: {
    //         // prolific_code: "",
    //         // action_time: "60",
    //         // second_warning: "10",
    //         // running_name: "",
    //         redirect_to: "",
    //         action_time: 60,
    //         second_warning: 10,
    //         consent_form: 'Yes'
    //     },
    // },
    SP: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            condition: "Mixed", // Blocked
            mode: 'g',  // l g2 gp
            s_p: 0, // start_points
            Nrounds: "2",
            Ncards: "10",
            c_a_t: 0,
            NumberOfPointsY: "3000",
            cards_beforeX: "2",
            MeanDis1: 400,
            // strong card text
            // other cards text
            StdDis1: 200,
            MeanDis2: 4000,
            StdDis2: 200,
            colors: {
                MeanDis1: {
                    cb: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                    cbo: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                    c_txt: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                    s_txt: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                    d_a: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                    d_s_d: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                },
                MeanDis2: {
                    cb: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                    cbo: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                    c_txt: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                    s_txt: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                    d_a: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                    d_s_d: {
                        r: 95,
                        g: 139,
                        b: 229,
                        a: 1
                    },
                },
            },
            rDis1: [0, 100],
            rDis2: [0, 100],
            ud: 'Yes'
        },
        payments: {
            // show_up_fee: 0,
            // sign_of_reward: "£",
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    DFE: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            blocks: 1,
            trials: "200",
            high_risky_value: "3",
            low_risky_value: "-4",
            pattern_size: "10",
            pattern_template: [
                "high_risky_value",
                "high_risky_value",
                "high_risky_value",
                "high_risky_value",
                "low_risky_value",
                "high_risky_value",
                "low_risky_value",
                "high_risky_value",
                "high_risky_value",
                "low_risky_value"
            ],
            spacebar_time: "500",
            safe_outcome: "0",
        },
        payments: {
            // show_up_fee: "1",
            // sign_of_reward: "£",
            // exchange_ratio: "400",
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    PL_PATTERN: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            blocks: 1,
            trials: "200",
            pattern_size: "10",
            pattern_template: [
                "FREQUENT",
                "FREQUENT",
                "FREQUENT",
                "FREQUENT",
                "RARE",
                "FREQUENT",
                "RARE",
                "FREQUENT",
                "FREQUENT",
                "RARE"
            ],
            spacebar_time: "500",
        },
        payments: {
            // show_up_fee: "1",
            // sign_of_reward: "£",
            // exchange_ratio: "200",
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    MetaSampling: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            real_trials: 10,
            practice_trials: 4,
            sampling_delay: 1,
            random_o: 'Yes',
            con: 'g', // WithGap WithoutGap Random Alternate
            problems_bank: [
                {
                    difficulty_level: "Highest",
                    EV_gap: 1,
                    values_inferior_option: {
                        low: 52,
                        high: 58
                    },
                    values_superior_option: {
                        low: 53,
                        high: 59
                    },
                    level: "Real"
                },
                {
                    difficulty_level: "High",
                    EV_gap: 2,
                    values_inferior_option: {
                        low: 52,
                        high: 58
                    },
                    values_superior_option: {
                        low: 54,
                        high: 60
                    },
                    level: "Practice"
                },
                {
                    difficulty_level: "Med-High",
                    EV_gap: 3,
                    values_inferior_option: {
                        low: 52,
                        high: 58
                    },
                    values_superior_option: {
                        low: 55,
                        high: 61
                    },
                    level: "Real"
                },
                {
                    difficulty_level: "Medium",
                    EV_gap: 4,
                    values_inferior_option: {
                        low: 52,
                        high: 58
                    },
                    values_superior_option: {
                        low: 56,
                        high: 62
                    },
                    level: "Real"
                },
                {
                    difficulty_level: "Med-Low",
                    EV_gap: 5,
                    values_inferior_option: {
                        low: 52,
                        high: 58
                    },
                    values_superior_option: {
                        low: 57,
                        high: 63
                    },
                    level: "Real"
                },
                {
                    difficulty_level: "Low",
                    EV_gap: 6,
                    values_inferior_option: {
                        low: 52,
                        high: 58
                    },
                    values_superior_option: {
                        low: 58,
                        high: 64
                    },
                    level: "Real"
                },
                {
                    difficulty_level: "Lowest",
                    EV_gap: 7,
                    values_inferior_option: {
                        low: 52,
                        high: 58
                    },
                    values_superior_option: {
                        low: 59,
                        high: 65
                    },
                    level: "Practice"
                },
                {
                    difficulty_level: "Highest",
                    EV_gap: 1,
                    values_inferior_option: {
                        low: 51,
                        high: 57
                    },
                    values_superior_option: {
                        low: 52,
                        high: 58
                    },
                    level: "Practice"
                },
                {
                    difficulty_level: "High",
                    EV_gap: 2,
                    values_inferior_option: {
                        low: 50,
                        high: 56
                    },
                    values_superior_option: {
                        low: 52,
                        high: 58
                    },
                    level: "Real"
                },
                {
                    difficulty_level: "Med-High",
                    EV_gap: 3,
                    values_inferior_option: {
                        low: 49,
                        high: 55
                    },
                    values_superior_option: {
                        low: 52,
                        high: 58
                    },
                    level: "Real"
                },
                {
                    difficulty_level: "Medium",
                    EV_gap: 4,
                    values_inferior_option: {
                        low: 48,
                        high: 54
                    },
                    values_superior_option: {
                        low: 52,
                        high: 58
                    },
                    level: "Real"
                },
                {
                    difficulty_level: "Med-Low",
                    EV_gap: 6,
                    values_inferior_option: {
                        low: 47,
                        high: 53
                    },
                    values_superior_option: {
                        low: 52,
                        high: 58
                    },
                    level: "Real"
                },
                {
                    difficulty_level: "Low",
                    EV_gap: 6,
                    values_inferior_option: {
                        low: 46,
                        high: 52
                    },
                    values_superior_option: {
                        low: 52,
                        high: 58
                    },
                    level: "Practice"
                },
                {
                    difficulty_level: "Lowest",
                    EV_gap: 7,
                    values_inferior_option: {
                        low: 45,
                        high: 51
                    },
                    values_superior_option: {
                        low: 52,
                        high: 58
                    },
                    level: "Real"
                }
            ]
        },
        payments: {
            // show_up_fee: 1,
            // sign_of_reward: "£",
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    ReversibleMatrices: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            num_of_mat_rule: 'NoLimit',
            num_of_mat: 20,
            stage2_obligatory: 'Yes',
            sampling_delay: 1,
            stage1_clicks_rule: 'NoLimit',
            stage1_clicks: 25,
            stage2_clicks_rule: 'Limit',
            stage2_clicks: 25,
            skip_matrix_btn: 'No',
            matrices_bank: [
                {
                    active: 'True',
                    size: "12X12",
                    dist: [
                        {
                            value: 1,
                            prob: 1,
                        },
                        {
                            value: 300,
                            prob: 1,
                        }
                    ]
                },
            ],
            pm_bank: [
                {
                    dist: [3, 2, 1],
                    MatColor: 'rgb(217,134,134)'
                },
                {
                    // green mat
                    dist: [12, 11],
                    dist2: [12, 23, 4],
                    MatColor: 'rgb(61,122,38)',
                },
                {
                    dist: [77, 55],
                    MatColor: 'rgb(152,175,255)',
                },
                {
                    // empty mat
                    dist: [13, 17],
                    MatColor: 'rgb(203,144,234)',
                },
            ],
            mem_task: [],
            l_s: 1 // mem task letter show
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    RepeatedChoice: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            pl_task_check: true,
            rd_task_check: true,
            rt_task_check: true,
            // dfe_pattern_task_check: true,
            // pl_pattern_task_check: true,
            language: 'English', // German
            random_task_order: 'true',
            rx: 'first_once', //full first_always
            pattern: 'first_once',
            tasks: [],

            pl_number_of_trials: "200",
            pl_prob_common_button: "0.7",
            pl_feedback_sec: "0.5",
            rd_number_of_trials: "100",
            rt_number_of_trials: "100",
            rd_feedback_sec: "0.5",
            rd_risk_rare_value: "-10",
            rd_risk_common_value: "1",
            rd_rare_prob: "0.1",
            rd_safe_value: "0",
            rt_feedback_sec: "0.5",
            rt_risk_rare_value: "10",
            rt_risk_common_value: "-1",
            rt_rare_prob: "0.1",
            rt_safe_value: "0",
            pl_feedback_color: "#0c0c92",
            pattern_number_of_trials: "200",
            pattern_spacebar_time: "0.5",

            // pl_pattern_size: "10",
            pl_pattern_template: [
                "F",
                "F",
                "F",
                "F",
                "R",
                "F",
                "R",
                "F",
                "F",
                "R"
            ],

            dfe_pattern_safe_outcome: "0",
            dfe_pattern_high_risky_value: "3",
            dfe_pattern_low_risky_value: "-4",
            // dfe_pattern_size: "10",
            dfe_pattern_template: [
                "H",
                "H",
                "H",
                "H",
                "L",
                "H",
                "L",
                "H",
                "H",
                "L"
            ],
        },
        payments: {
            // show_up: "3",
            // bonus_endowment: "1.1",
            // pay_sign: "£",
            // exchange_rate_pl: "100",
            // exchange_rate_rt: "100",
            // exchange_rate_rd: "100",
            // exchange_rate_pl_pattern: "200",
            // exchange_rate_dfe_pattern: "400",
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio_pl: 100,
            exchange_ratio_rt: 100,
            exchange_ratio_rd: 100,
            exchange_ratio_pl_pattern: 100,
            exchange_ratio_dfe_pattern: 100,
            bonus_endowment: 0.4
        },
        general: {
            // Prolific_code: "",
            // RunningName: "MayPilot4",
            // action_time: 60,
            // second_warning: 10,
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'Yes'
        },
    },
    QueenGarden: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            c_l_txt: 'Zorea',
            c_r_txt: 'kingdom',
            ch_txt: 'CROWN_HIGHWAY',
            r1_txt: 'Road #1',
            r2_txt: 'Road #2',
            r3_txt: 'Road #3',
            r4_txt: 'Road #4',
            qg_txt: 'Crown road',
            w_t: 'Yes',
            w_p: 'Yes',
            pt: 1,
            r_h: 's', // road hover: n-none a-all r-road s-signpost
            tutorial_f_p: 1,
            tutorial_r_t: 1,
            g_o: 'r', // games order r-random n_r no random (Ascending)
            cond: 'U', // R-Risk D-Dishonest Ra-Random U-Uniform distribution
            display_time:1,
            type_1_score:3,
            type_1_probability:75,
            type_2_score:5,
            type_2_probability:10,
            pt_g: { // practice_game
                t: 3, // Trials
                // r_v: 1, // Reward Value
                // m_t_c: 1, // Mileage/Travel/Toll Cost:
                p0: 0.05,  // first Probability
                a: 0.2, // Adaptability
                // pe: 1, // Penalty
                // e_c: 1, // Equipment Cost
                r_v: 1, // Reward Value
                t_c: 1, // Toll Cost:
                c_c: 1, // Toll Cost:
            },
            g_b: [
                {
                    active: 'Yes',
                    t: 3, // Trials
                    // r_v: 1, // Reward Value
                    // m_t_c: 1, // Mileage/Travel/Toll Cost:
                    p0: 0.05,  // first Probability
                    a: 0.2, // Adaptability
                    r_v: 1, // Reward Value
                    t_c: 1, // Toll Cost:
                    c_c: 1, // Toll Cost:
                    // pe: 1, // Penalty
                    // e_c: 1, // Equipment Cost
                },
                {
                    active: 'No',
                    t: 3, // Trials
                    // r_v: 1, // Reward Value
                    // m_t_c: 1, // Mileage/Travel/Toll Cost:
                    p0: 0.05,  // first Probability
                    a: 0.2, // Adaptability
                    r_v: 1, // Reward Value
                    t_c: 1, // Toll Cost:
                    c_c: 1, // Toll Cost:
                    // pe: 1, // Penalty
                    // e_c: 1, // Equipment Cost
                },
            ]
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'No'
        },
    },
    QueenGarden2: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            c_l_txt: 'Zorea',
            c_r_txt: 'kingdom',
            ch_txt: 'CROWN_HIGHWAY',
            r1_txt: 'Road #1',
            r2_txt: 'Road #2',
            r3_txt: 'Road #3',
            r4_txt: 'Road #4',
            qg_txt: 'Crown road',
            w_t: 'Yes',
            w_p: 'Yes',
            pt: 1,
            r_h: 's', // road hover: n-none a-all r-road s-signpost
            tutorial_f_p: 1,
            tutorial_r_t: 1,
            g_o: 'r', // games order r-random n_r no random (Ascending)
            cond: 'U', // R-Risk D-Dishonest Ra-Random U-Uniform distribution
            display_time:1,
            type_1_score:3,
            type_1_probability:75,
            type_2_score:5,
            type_2_probability:10,
            pt_g: { // practice_game
                t: 3, // Trials
                // r_v: 1, // Reward Value
                // m_t_c: 1, // Mileage/Travel/Toll Cost:
                p0: 0.05,  // first Probability
                a: 0.2, // Adaptability
                // pe: 1, // Penalty
                // e_c: 1, // Equipment Cost
                r_v: 1, // Reward Value
                t_c: 1, // Toll Cost:
                c_c: 1, // Toll Cost:
            },
            g_b: [
                {
                    active: 'Yes',
                    t: 3, // Trials
                    // r_v: 1, // Reward Value
                    // m_t_c: 1, // Mileage/Travel/Toll Cost:
                    p0: 0.05,  // first Probability
                    a: 0.2, // Adaptability
                    r_v: 1, // Reward Value
                    t_c: 1, // Toll Cost:
                    c_c: 1, // Toll Cost:
                    // pe: 1, // Penalty
                    // e_c: 1, // Equipment Cost
                },
                {
                    active: 'No',
                    t: 3, // Trials
                    // r_v: 1, // Reward Value
                    // m_t_c: 1, // Mileage/Travel/Toll Cost:
                    p0: 0.05,  // first Probability
                    a: 0.2, // Adaptability
                    r_v: 1, // Reward Value
                    t_c: 1, // Toll Cost:
                    c_c: 1, // Toll Cost:
                    // pe: 1, // Penalty
                    // e_c: 1, // Equipment Cost
                },
            ]
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'No'
        },
    },
    QueenGarden3: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            c_l_txt: 'Zorea',
            c_r_txt: 'kingdom',
            ch_txt: 'CROWN_HIGHWAY',
            r1_txt: 'Road #1',
            r2_txt: 'Road #2',
            r3_txt: 'Road #3',
            r4_txt: 'Road #4',
            qg_txt: 'Crown road',
            w_t: 'Yes',
            w_p: 'Yes',
            pt: 1,
            r_h: 's', // road hover: n-none a-all r-road s-signpost
            tutorial_f_p: 1,
            tutorial_r_t: 1,
            g_o: 'r', // games order r-random n_r no random (Ascending)
            cond: 'U', // R-Risk D-Dishonest Ra-Random U-Uniform distribution
            display_time:1,
            type_1_score:3,
            type_1_probability:75,
            type_2_score:5,
            type_2_probability:10,
            pt_g: { // practice_game
                t: 3, // Trials
                // r_v: 1, // Reward Value
                // m_t_c: 1, // Mileage/Travel/Toll Cost:
                p0: 0.05,  // first Probability
                a: 0.2, // Adaptability
                // pe: 1, // Penalty
                // e_c: 1, // Equipment Cost
                r_v: 1, // Reward Value
                t_c: 1, // Toll Cost:
                c_c: 1, // Toll Cost:
            },
            g_b: [
                {
                    active: 'Yes',
                    t: 3, // Trials
                    // r_v: 1, // Reward Value
                    // m_t_c: 1, // Mileage/Travel/Toll Cost:
                    p0: 0.05,  // first Probability
                    a: 0.2, // Adaptability
                    r_v: 1, // Reward Value
                    t_c: 1, // Toll Cost:
                    c_c: 1, // Toll Cost:
                    // pe: 1, // Penalty
                    // e_c: 1, // Equipment Cost
                },
                {
                    active: 'No',
                    t: 3, // Trials
                    // r_v: 1, // Reward Value
                    // m_t_c: 1, // Mileage/Travel/Toll Cost:
                    p0: 0.05,  // first Probability
                    a: 0.2, // Adaptability
                    r_v: 1, // Reward Value
                    t_c: 1, // Toll Cost:
                    c_c: 1, // Toll Cost:
                    // pe: 1, // Penalty
                    // e_c: 1, // Equipment Cost
                },
            ]
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'No'
        },
    },
    PreferancePerformance: {
        version: 'test',
        last_modified: '-',
        date_modified: '-',
        game: {
            c_l_txt: 'Zorea',
            c_r_txt: 'kingdom',
            ch_txt: 'CROWN_HIGHWAY',
            r1_txt: 'Road #1',
            r2_txt: 'Road #2',
            r3_txt: 'Road #3',
            r4_txt: 'Road #4',
            qg_txt: 'Crown road',
            w_t: 'Yes',
            w_p: 'Yes',
            pt: 1,
            r_h: 's', // road hover: n-none a-all r-road s-signpost
            tutorial_f_p: 1,
            tutorial_r_t: 1,
            g_o: 'r', // games order r-random n_r no random (Ascending)
            cond: 'U', // R-Risk D-Dishonest Ra-Random U-Uniform distribution
            display_time:1,
            type_1_score:3,
            type_1_probability:75,
            type_2_score:5,
            type_2_probability:10,
            pt_g: { // practice_game
               // t: 3, // Trials
                // r_v: 1, // Reward Value
                // m_t_c: 1, // Mileage/Travel/Toll Cost:
              //  p0: 0.05,  // first Probability
               // a: 0.2, // Adaptability
                // pe: 1, // Penalty
                // e_c: 1, // Equipment Cost
               // r_v: 1, // Reward Value
               // t_c: 1, // Toll Cost:
               // c_c: 1, // Toll Cost:
                
				
            },
            
            g_b: [
                {
                    active: 'Yes',
                    //t: 3, // Trials
                    // r_v: 1, // Reward Value
                    // m_t_c: 1, // Mileage/Travel/Toll Cost:
                   // p0: 0.05,  // first Probability
                   // a: 0.2, // Adaptability
                   // r_v: 1, // Reward Value
                   // t_c: 1, // Toll Cost:
                   // c_c: 1, // Toll Cost:
					type_1_blocks_num: 8,
					type_1_trials_num: 20,
					type_2_blocks_num: 8,
					type_2_trials_num: 20,
                    // pe: 1, // Penalty
                    // e_c: 1, // Equipment Cost
                },
                {
                    active: 'Yes',
                   // t: 3, // Trials
                    // r_v: 1, // Reward Value
                    // m_t_c: 1, // Mileage/Travel/Toll Cost:
                   // p0: 0.05,  // first Probability
                  //  a: 0.2, // Adaptability
                  //  r_v: 1, // Reward Value
                  //  t_c: 1, // Toll Cost:
                  //  c_c: 1, // Toll Cost:
					type_1_blocks_num: 8,
					type_1_trials_num: 20,
					type_2_blocks_num: 8,
					type_2_trials_num: 20,
                    // pe: 1, // Penalty
                    // e_c: 1, // Equipment Cost
                },
                {
                    active: 'Yes',
                   // t: 3, // Trials
                    // r_v: 1, // Reward Value
                    // m_t_c: 1, // Mileage/Travel/Toll Cost:
                   // p0: 0.05,  // first Probability
                  //  a: 0.2, // Adaptability
                  //  r_v: 1, // Reward Value
                  //  t_c: 1, // Toll Cost:
                  //  c_c: 1, // Toll Cost:
					type_1_blocks_num: 8,
					type_1_trials_num: 20,
					type_2_blocks_num: 8,
					type_2_trials_num: 20,
                    // pe: 1, // Penalty
                    // e_c: 1, // Equipment Cost
                },
            ]
        },
        payments: {
            sign_of_reward: "£",
            show_up_fee: 1,
            exchange_ratio: 100,
            bonus_endowment: 0.4
        },
        general: {
            need_summary: true,
            redirect_to: "",
            action_time: 60,
            second_warning: 10,
            consent_form: 'No'
        },
    },
}

const AllModels = {
    MixedGame: {
        versions: MixedGameVersions,
        records: MixedGameUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    MindGame: {
        versions: MindGameVersions,
        records: MindGameUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    Trivia: {
        versions: TriviaVersions,
        records: TriviaUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    PreferancePerformance: {
        versions: PreferancePerformanceVersions,
        records: PreferancePerformanceUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    TryOrGiveUp: {
        versions: TryOrGiveUpVersions,
        records: TryOrGiveUpUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    PointsGame: {
        versions: PointsGameVersions,
        records: PointsGameUsersRecords,
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    PointsGameSh: {
        versions: PointsGameShVersions,
        records: PointsGameShUsersRecords,
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    MegaDots: {
        versions: MegaDotsVersions,
        records: MegaDotsUsersRecords,
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    WordPuzzle: {
        versions: WordPuzzleVersions,
        records: WordPuzzleUsersRecords,
        extra: {
            puzzles_models: WordPuzzlePuzzlesModels
        },
        tables: ['game', 'payment', 'summary', 'objects', 'ques,', 'KeyTable'],
    },
    CognitiveTask: {
        versions: CognitiveTaskVersions,
        records: CognitiveTaskUsersRecords,
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    CognitiveTask2: {
        versions: CognitiveTask2Versions,
        records: CognitiveTask2UsersRecords,
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    RepeatedChoice: {
        versions: RepeatedChoiceVersions,
        records: RepeatedChoiceUsersRecords,
        tables: ['game', 'payment', 'summary', 'SupportTools', 'ComprehensionChecks', 'KeyTable'],
    },
    QueenGarden: {
        versions: QueenGardenVersions,
        records: QueenGardenUsersRecords,
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    QueenGarden2: {
        versions: QueenGarden2Versions,
        records: QueenGarden2UsersRecords,
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    QueenGarden3: {
        versions: QueenGarden3Versions,
        records: QueenGarden3UsersRecords,
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    SP: {
        versions: SPVersions,
        records: SPUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable', 'NFC'],
    },
    DFE: {
        versions: DFEVersions,
        records: DFEUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    PL_PATTERN: {
        versions: PLPatternVersions,
        records: PLPatternRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    MetaSampling: {
        versions: MetaSamplingVersions,
        records: MetaSamplingUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    ReversibleMatrices: {
        versions: ReversibleMatricesVersions,
        records: ReversibleMatricesUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    SignatureTimingEffect: {
        versions: SignatureTimingEffectVersions,
        records: SignatureTimingEffectUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    AbstractAndDeclarationEffect: {
        versions: AbstractAndDeclarationEffectVersions,
        records: AbstractAndDeclarationEffectUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    SignatureAsReminder: {
        versions: SignatureAsReminderVersions,
        records: SignatureAsReminderUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    CupsGame: {
        versions: CupsGameVersions,
        records: CupsGameUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    NoCupsGame: {
        versions: NoCupsGameVersions,
        records: NoCupsGameUsersRecords,
        extra: {},
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    ConsentForms,
    ActiveSettings,
    RunningCounters,
    ExpDevDetails,
    ToDoList,
    Chats,
    AppSettings,
    VersionChanges,
    //
    User,
    RejectedUsers,
    OutsourcePlayIP,
    IPListRunning,
    PasswordForget,
};

const addNewExperiment = asyncHandler(async (req, res) => {

    if (!(await isSuperAdminUser(req)))
        return res.json({error: 'Illegal command'});

    const dirs = {
        logs: 'logs'
    };

    const {NewExp} = req.body;

    if (!NewExp)
        return res.json({error: 'Illegal command'});

    let exp_exist = await getModelPack('ExpDevDetails').ExpDevDetails.findOne({exp: NewExp});
    if (exp_exist){
        return res.json({error: 'Exp exist'});
    }

    try {
        let Model = getModelPack('ConsentForms').ConsentForms;
        let new_model = {
            exp: NewExp,
            version: 'test',
            consent_form: {
                body: '',
                radio_consent_text: '',
                radio_not_consent_text: ''
            },
            last_modified: '-',
            date_modified: getTimeDate().date
        };
        let newModel = new Model(new_model);
        await newModel.save();
        console.log("---> 123")
        Model = getModelPack('ActiveSettings').ActiveSettings;
        new_model = {
            exp: NewExp,
            version: 'test',
            mode: 'Real',
            running_name: 'test',
            last_modified: '-',
            date_modified: getTimeDate().date,
        };
        newModel = new Model(new_model);
        await newModel.save();

        Model = getModelPack('RunningCounters').RunningCounters;
        new_model = {
            exp: NewExp,
            running_name: 'test',
            counter: 0
        };

        newModel = new Model(new_model);
        await newModel.save();

        Model = getModelPack('ExpDevDetails').ExpDevDetails;
        new_model = {
            exp: NewExp,
            status: 'READY',
            created_by: 'ggolan@technion.ac.il',
            date_modified: getTimeDate().date,
            date_created: getTimeDate().date
        };
        newModel = new Model(new_model);
        await newModel.save();

        Model = getModelPack('VersionChanges').VersionChanges;
        new_model = {
            exp: NewExp,
        };

        newModel = new Model(new_model);
        await newModel.save();

        Model = getModelPack(NewExp).records;

        newModel = new Model({o:'o'});
        await newModel.save();
        Model.deleteMany();

        Model = getModelPack(NewExp).versions;
        await Model.deleteMany();

        newModel = new Model(defaultVersions[NewExp]);
        await newModel.save();

        await fs.writeFileSync(dirs.logs + '/' + NewExp + '.log', '' );
        await fs.writeFileSync(dirs.logs + '/' + NewExp + '.err', '' );

        console.log('FINISH');

        let exps_list = await getModelPack('ExpDevDetails').ExpDevDetails.distinct('exp');

        return res.json({msg: 'Success', exps_list});
    }
    catch (e) {
        console.log('error: ', e);
        return res.json({error: 'Error'});
    }
    /* ############### VERSIONS CHANGES ################## */
});

const UsersData = [
    {
        name: 'Oren Gal',
        email: 'oren@technion.ac.il',
        password: bcrypt.hashSync('12345', 10),
        permission: 'SuperAdmin',
        gender: 'Male',
        age: 54,
        // Experiments: [],
    },
    ];
const UsersData2 = [
    {
        name: 'Guy Golan',
        email: 'ggolan@technion.ac.il',
        password: bcrypt.hashSync('12345', 10),
        permission: 'SuperAdmin',
        gender: 'Male',
        age: 54,
        // Experiments: [],
    },
    {
        name: 'Kinneret Teodorescu',
        email: 'kinnerett@technion.ac.il',
        password: bcrypt.hashSync('12345', 10),
        permission: 'SuperAdmin',
        gender: 'Female',
        age: 40,
        Experiments: [],
    },
    {
        name: 'Rakefet Ackerman',
        email: 'ackerman@technion.ac.il',
        password: bcrypt.hashSync('12345', 10),
        permission: 'Admin',
        gender: 'Female',
        age: 1,
        Experiments: ['MetaSampling'],
        chat_last_seen: {
            MetaSampling: 0
        }
    },
    {
        name: '',
        email: 'asafmoran1@gmail.com',
        password: bcrypt.hashSync('12345', 10),
        permission: 'Admin',
        gender: 'Male',
        age: 1,
    },
    {
        name: '',
        email: 'cschulze@mpib-berlin.mpg.de',
        password: bcrypt.hashSync('12345', 10),
        permission: 'Admin',
        gender: 'Female',
        age: 1,
    },
    {
        name: '',
        email: 'oplonsky@gmail.com',
        password: bcrypt.hashSync('12345', 10),
        permission: 'Admin',
        gender: 'Male',
        age: 1,
    },
    {
        name: '',
        email: 'ori.nizri.tal@gmail.com',
        password: bcrypt.hashSync('12345', 10),
        permission: 'Admin',
        gender: 'Male',
        age: 1,
    },
    {
        name: '',
        email: 'yuval.hart@mail.huji.ac.il',
        password: bcrypt.hashSync('12345', 10),
        permission: 'Admin',
        gender: 'Male',
        age: 1,
    },
    {
        name: '',
        email: 'levavruth@campus.technion.ac.il',
        password: bcrypt.hashSync('12345', 10),
        permission: 'Admin',
        gender: 'Female',
        age: 1,
        Experiments: ['WordPuzzle'],
        chat_last_seen: {
            WordPuzzle: 0
        }
    },
    {
        name: 'Danielle',
        email: 'danieller@campus.technion.ac.il',
        password: bcrypt.hashSync('12345', 10),
        permission: 'Admin',
        gender: 'Female',
        age: 25,
        Experiments: ['ReversibleMatrices'],
        chat_last_seen: {
            ReversibleMatrices: 0
        }
    },
    {
        name: 'rylski',
        email: 'rylski@campus.technion.ac.il',
        password: bcrypt.hashSync('12345', 10),
        permission: 'Admin',
        gender: 'Female',
        age: 18,
        Experiments: ['SignatureTimingEffect'],
        chat_last_seen: {
            SignatureTimingEffect: 0
        }
    },
    {
        name: 'Vered',
        email: 'vered.zohar@campus.technion.ac.il',
        password: bcrypt.hashSync('12345', 10),
        permission: 'Admin',
        gender: 'Female',
        age: 25,
        Experiments: ['CupsGame'],
        chat_last_seen: {
            CupsGame: 0
        }
    },
    {
        name: '',
        email: 'erevido@gmail.com',
        password: bcrypt.hashSync('12345', 10),
        permission: 'Admin',
        gender: 'Male',
        age: 1,
        Experiments: ['SignatureTimingEffect'],
        chat_last_seen: {
            SignatureTimingEffect: 0
        }
    },
];

const defaultPuzzlesModels = [
    {
        "puzzle_id": "SSD_Pilot3",
        "puzzle_data": {
            "stereo": {
                "start_index": 363,
                "length": 6,
                "steps": 1,
                "WordTag": "2"
            },
            "zipper": {
                "start_index": 341,
                "length": 6,
                "steps": 1,
                "WordTag": "2"
            },
            "coffee": {
                "start_index": 265,
                "length": 6,
                "steps": 20,
                "WordTag": "2"
            },
            "mother": {
                "start_index": 261,
                "length": 6,
                "steps": 21,
                "WordTag": "2"
            },
            "summer": {
                "start_index": 201,
                "length": 6,
                "steps": 20,
                "WordTag": "2"
            },
            "powder": {
                "start_index": 264,
                "length": 6,
                "steps": 21,
                "WordTag": "2"
            },
            "canvas": {
                "start_index": 265,
                "length": 6,
                "steps": 21,
                "WordTag": "2"
            },
            "staple": {
                "start_index": 73,
                "length": 6,
                "steps": 1,
                "WordTag": "1"
            },
            "anchor": {
                "start_index": 72,
                "length": 6,
                "steps": 20,
                "WordTag": "1"
            },
            "insect": {
                "start_index": 173,
                "length": 6,
                "steps": 1,
                "WordTag": "1"
            },
            "number": {
                "start_index": 92,
                "length": 6,
                "steps": 21,
                "WordTag": "1"
            },
            "weasel": {
                "start_index": 33,
                "length": 6,
                "steps": 21,
                "WordTag": "1"
            },
            "gravel": {
                "start_index": 35,
                "length": 6,
                "steps": 20,
                "WordTag": "1"
            },
            "carrot": {
                "start_index": 11,
                "length": 6,
                "steps": 20,
                "WordTag": "1"
            }
        },
        "puzzle_type": "Grouped",
        "puzzle_length": 14,
        "puzzle_size": "20X20",
        "puzzle_rows": 20,
        "puzzle_cols": 20
    },
    {
        "puzzle_data":
            {
                "juice":{"start_index":210,"length":5,"steps":30,"WordTag":"tag 2"},"scone":{"start_index":122,"length":5,"steps":1,"WordTag":"tag 2"},"oil":{"start_index":124,"length":3,"steps":30,"WordTag":"tag 2"},"kale":{"start_index":272,"length":4,"steps":31,"WordTag":"tag 2"},"salt":{"start_index":451,"length":4,"steps":1,"WordTag":"tag 2"},"cracker":{"start_index":541,"length":7,"steps":31,"WordTag":"tag 2"},"crab":{"start_index":630,"length":4,"steps":30,"WordTag":"tag 2"},"jelly":{"start_index":781,"length":5,"steps":1,"WordTag":"tag 2"},"spaghetti":{"start_index":872,"length":9,"steps":1,"WordTag":"tag 2"},"cinnamon":{"start_index":889,"length":8,"steps":1,"WordTag":"tag 2"},"tahini":{"start_index":852,"length":6,"steps":1,"WordTag":"tag 2"},"pizza":{"start_index":700,"length":5,"steps":31,"WordTag":"tag 2"},"raisin":{"start_index":729,"length":6,"steps":1,"WordTag":"tag 2"},"paprika":{"start_index":638,"length":7,"steps":1,"WordTag":"tag 2"},"croissant":{"start_index":579,"length":9,"steps":1,"WordTag":"tag 2"},"falafel":{"start_index":427,"length":7,"steps":30,"WordTag":"tag 2"},"nachos":{"start_index":246,"length":6,"steps":30,"WordTag":"tag 2"},"corn":{"start_index":188,"length":4,"steps":30,"WordTag":"tag 2"},"cucumber":{"start_index":188,"length":8,"steps":31,"WordTag":"tag 2"},"zucchini":{"start_index":251,"length":8,"steps":30,"WordTag":"tag 2"},"banana":{"start_index":343,"length":6,"steps":30,"WordTag":"tag 2"},"sugar":{"start_index":466,"length":5,"steps":1,"WordTag":"tag 2"},"almond":{"start_index":469,"length":6,"steps":30,"WordTag":"tag 2"},"truffle":{"start_index":676,"length":7,"steps":1,"WordTag":"tag 2"},"butter":{"start_index":648,"length":6,"steps":30,"WordTag":"tag 2"},"steak":{"start_index":339,"length":5,"steps":30,"WordTag":"tag 2"},"mandarin":{"start_index":131,"length":8,"steps":1,"WordTag":"tag 2"},"muesli":{"start_index":225,"length":6,"steps":31,"WordTag":"tag 2"},"lime":{"start_index":113,"length":4,"steps":30,"WordTag":"tag 2"},"date":{"start_index":232,"length":4,"steps":30,"WordTag":"tag 2"},"blackberry":{"start_index":26,"length":10,"steps":30,"WordTag":"tag 2"},"ham":{"start_index":85,"length":3,"steps":1,"WordTag":"tag 2"},"strudel":{"start_index":358,"length":7,"steps":30,"WordTag":"tag 2"},"flour":{"start_index":414,"length":5,"steps":1,"WordTag":"tag 2"},"eggplant":{"start_index":622,"length":8,"steps":1,"WordTag":"tag 2"},"peach":{"start_index":625,"length":5,"steps":30,"WordTag":"tag 2"},"cheese":{"start_index":744,"length":6,"steps":1,"WordTag":"tag 2"},"pudding":{"start_index":647,"length":7,"steps":31,"WordTag":"tag 2"},"lamb":{"start_index":499,"length":4,"steps":1,"WordTag":"tag 2"},"clementine":{"start_index":37,"length":10,"steps":1,"WordTag":"tag 2"}
            },
        "puzzle_type":"Scattered",
        "puzzle_id":"S4",
        "puzzle_length":40,
        "puzzle_size":"30X30",
        "puzzle_rows":30,
        "puzzle_cols":30
    },
    {
        "puzzle_data":
            {
                "sample":{"start_index":42,"length":6,"steps":1,"WordTag":"SampleTag"}
            },
        "puzzle_type": "Scattered",
        "puzzle_id": "Sample",
        "puzzle_length": 1,
        "puzzle_size":"20X20",
        "puzzle_rows":20,
        "puzzle_cols":20
    },
    {"puzzle_data":{"guava":{"start_index":92,"length":5,"steps":31,"WordTag":"tag 2"},"papaya":{"start_index":69,"length":6,"steps":30,"WordTag":"tag 2"},"parsley":{"start_index":251,"length":7,"steps":31,"WordTag":"tag 2"},"curry":{"start_index":181,"length":5,"steps":31,"WordTag":"tag 2"},"chili":{"start_index":141,"length":5,"steps":1,"WordTag":"tag 2"},"honey":{"start_index":142,"length":5,"steps":30,"WordTag":"tag 2"},"wafer":{"start_index":294,"length":5,"steps":31,"WordTag":"tag 2"},"apricot":{"start_index":321,"length":7,"steps":30,"WordTag":"tag 2"},"pie":{"start_index":351,"length":3,"steps":1,"WordTag":"tag 2"},"coffee":{"start_index":441,"length":6,"steps":1,"WordTag":"tag 2"},"ginger":{"start_index":391,"length":6,"steps":1,"WordTag":"tag 2"},"pumpkin":{"start_index":480,"length":7,"steps":1,"WordTag":"tag 2"},"cherry":{"start_index":544,"length":6,"steps":1,"WordTag":"tag 2"},"meat":{"start_index":819,"length":4,"steps":1,"WordTag":"tag 2"},"marshmallow":{"start_index":751,"length":11,"steps":1,"WordTag":"tag 2"},"orange":{"start_index":660,"length":6,"steps":1,"WordTag":"tag 2"},"donut":{"start_index":578,"length":5,"steps":31,"WordTag":"tag 2"},"pomegranate":{"start_index":582,"length":11,"steps":1,"WordTag":"tag 2"},"pineapple":{"start_index":582,"length":9,"steps":31,"WordTag":"tag 2"},"carrot":{"start_index":656,"length":6,"steps":30,"WordTag":"tag 2"},"kiwi":{"start_index":539,"length":4,"steps":30,"WordTag":"tag 2"},"mushroom":{"start_index":886,"length":8,"steps":1,"WordTag":"tag 2"},"tuna":{"start_index":338,"length":4,"steps":30,"WordTag":"tag 2"},"cake":{"start_index":400,"length":4,"steps":1,"WordTag":"tag 2"},"oregano":{"start_index":47,"length":7,"steps":1,"WordTag":"tag 2"},"bread":{"start_index":194,"length":5,"steps":1,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"S2 - new","puzzle_length":26,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"celery":{"start_index":90,"length":6,"steps":30,"WordTag":"tag"},"grape":{"start_index":242,"length":5,"steps":31,"WordTag":"tag"},"oatmeal":{"start_index":62,"length":7,"steps":1,"WordTag":"tag"},"bacon":{"start_index":247,"length":5,"steps":1,"WordTag":"tag"},"mango":{"start_index":132,"length":5,"steps":1,"WordTag":"tag"},"biscuit":{"start_index":111,"length":7,"steps":1,"WordTag":"tag"},"yogurt":{"start_index":25,"length":6,"steps":30,"WordTag":"tag"},"coconut":{"start_index":298,"length":7,"steps":30,"WordTag":"tag"},"watermelon":{"start_index":889,"length":10,"steps":1,"WordTag":"tag"},"noodles":{"start_index":833,"length":7,"steps":1,"WordTag":"tag"},"cookie":{"start_index":740,"length":6,"steps":1,"WordTag":"tag"},"avocado":{"start_index":615,"length":7,"steps":1,"WordTag":"tag"},"broccoli":{"start_index":529,"length":8,"steps":1,"WordTag":"tag"},"tofu":{"start_index":625,"length":4,"steps":1,"WordTag":"tag"},"sushi":{"start_index":313,"length":5,"steps":31,"WordTag":"tag"},"guacamole":{"start_index":135,"length":9,"steps":31,"WordTag":"tag"},"bolognese":{"start_index":204,"length":9,"steps":30,"WordTag":"tag"},"radish":{"start_index":420,"length":6,"steps":1,"WordTag":"tag"},"hummus":{"start_index":483,"length":6,"steps":30,"WordTag":"tag"},"mustard":{"start_index":573,"length":7,"steps":1,"WordTag":"tag"},"spinach":{"start_index":457,"length":7,"steps":1,"WordTag":"tag"},"salmon":{"start_index":666,"length":6,"steps":30,"WordTag":"tag"},"chocolate":{"start_index":784,"length":9,"steps":1,"WordTag":"tag"},"egg":{"start_index":668,"length":3,"steps":1,"WordTag":"tag"},"potato":{"start_index":520,"length":6,"steps":31,"WordTag":"tag"},"pasta":{"start_index":750,"length":5,"steps":31,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"S3 - new","puzzle_length":26,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"scone":{"start_index":122,"length":5,"steps":1,"WordTag":"tag"},"oil":{"start_index":124,"length":3,"steps":30,"WordTag":"tag"},"salt":{"start_index":451,"length":4,"steps":1,"WordTag":"tag"},"cracker":{"start_index":541,"length":7,"steps":31,"WordTag":"tag"},"crab":{"start_index":630,"length":4,"steps":30,"WordTag":"tag"},"jelly":{"start_index":781,"length":5,"steps":1,"WordTag":"tag"},"spaghetti":{"start_index":872,"length":9,"steps":1,"WordTag":"tag"},"cinnamon":{"start_index":889,"length":8,"steps":1,"WordTag":"tag"},"pizza":{"start_index":700,"length":5,"steps":31,"WordTag":"tag"},"croissant":{"start_index":579,"length":9,"steps":1,"WordTag":"tag"},"falafel":{"start_index":427,"length":7,"steps":30,"WordTag":"tag"},"cucumber":{"start_index":188,"length":8,"steps":31,"WordTag":"tag"},"sugar":{"start_index":466,"length":5,"steps":1,"WordTag":"tag"},"almond":{"start_index":469,"length":6,"steps":30,"WordTag":"tag"},"butter":{"start_index":648,"length":6,"steps":30,"WordTag":"tag"},"mandarin":{"start_index":131,"length":8,"steps":1,"WordTag":"tag"},"blackberry":{"start_index":26,"length":10,"steps":30,"WordTag":"tag"},"ham":{"start_index":85,"length":3,"steps":1,"WordTag":"tag"},"peach":{"start_index":625,"length":5,"steps":30,"WordTag":"tag"},"cheese":{"start_index":744,"length":6,"steps":1,"WordTag":"tag"},"pudding":{"start_index":647,"length":7,"steps":31,"WordTag":"tag"},"clementine":{"start_index":37,"length":10,"steps":1,"WordTag":"tag"},"banana":{"start_index":211,"length":6,"steps":31,"WordTag":"tag"},"corn":{"start_index":444,"length":4,"steps":31,"WordTag":"tag"},"zucchini":{"start_index":198,"length":8,"steps":30,"WordTag":"tag"},"date":{"start_index":353,"length":4,"steps":1,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"S4 - new ","puzzle_length":26,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"schnitzel":{"start_index":34,"length":9,"steps":30,"WordTag":"tag"},"asparagus":{"start_index":3,"length":9,"steps":31,"WordTag":"tag"},"pepper":{"start_index":65,"length":6,"steps":1,"WordTag":"tag"},"cauliflower":{"start_index":242,"length":11,"steps":30,"WordTag":"tag"},"lettuce":{"start_index":702,"length":7,"steps":30,"WordTag":"tag"},"garlic":{"start_index":364,"length":6,"steps":1,"WordTag":"tag"},"artichoke":{"start_index":365,"length":9,"steps":31,"WordTag":"tag"},"salad":{"start_index":719,"length":5,"steps":30,"WordTag":"tag"},"hamburger":{"start_index":283,"length":9,"steps":30,"WordTag":"tag"},"crepe":{"start_index":374,"length":5,"steps":31,"WordTag":"tag"},"muffin":{"start_index":409,"length":6,"steps":1,"WordTag":"tag"},"milk":{"start_index":409,"length":4,"steps":30,"WordTag":"tag"},"ketchup":{"start_index":148,"length":7,"steps":30,"WordTag":"tag"},"peanut":{"start_index":354,"length":6,"steps":1,"WordTag":"tag"},"baloney":{"start_index":326,"length":7,"steps":30,"WordTag":"tag"},"chips":{"start_index":593,"length":5,"steps":1,"WordTag":"tag"},"bagel":{"start_index":631,"length":5,"steps":31,"WordTag":"tag"},"tortilla":{"start_index":742,"length":8,"steps":1,"WordTag":"tag"},"walnut":{"start_index":587,"length":6,"steps":31,"WordTag":"tag"},"apple":{"start_index":203,"length":5,"steps":1,"WordTag":"tag"},"pancake":{"start_index":76,"length":7,"steps":31,"WordTag":"tag"},"fig":{"start_index":143,"length":3,"steps":1,"WordTag":"tag"},"onion":{"start_index":196,"length":5,"steps":30,"WordTag":"tag"},"beer":{"start_index":228,"length":4,"steps":30,"WordTag":"tag"},"nectarine":{"start_index":857,"length":9,"steps":1,"WordTag":"tag"},"parmesan":{"start_index":76,"length":8,"steps":1,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"S1 - new","puzzle_length":26,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"oil":{"start_index":124,"length":3,"steps":30,"WordTag":"tag"},"kale":{"start_index":272,"length":4,"steps":31,"WordTag":"tag"},"salt":{"start_index":451,"length":4,"steps":1,"WordTag":"tag"},"cracker":{"start_index":541,"length":7,"steps":31,"WordTag":"tag"},"crab":{"start_index":630,"length":4,"steps":30,"WordTag":"tag"},"jelly":{"start_index":781,"length":5,"steps":1,"WordTag":"tag"},"spaghetti":{"start_index":872,"length":9,"steps":1,"WordTag":"tag"},"cinnamon":{"start_index":889,"length":8,"steps":1,"WordTag":"tag"},"tahini":{"start_index":852,"length":6,"steps":1,"WordTag":"tag"},"pizza":{"start_index":700,"length":5,"steps":31,"WordTag":"tag"},"raisin":{"start_index":729,"length":6,"steps":1,"WordTag":"tag"},"paprika":{"start_index":638,"length":7,"steps":1,"WordTag":"tag"},"croissant":{"start_index":579,"length":9,"steps":1,"WordTag":"tag"},"falafel":{"start_index":427,"length":7,"steps":30,"WordTag":"tag"},"nachos":{"start_index":246,"length":6,"steps":30,"WordTag":"tag"},"corn":{"start_index":188,"length":4,"steps":30,"WordTag":"tag"},"cucumber":{"start_index":188,"length":8,"steps":31,"WordTag":"tag"},"zucchini":{"start_index":251,"length":8,"steps":30,"WordTag":"tag"},"banana":{"start_index":343,"length":6,"steps":30,"WordTag":"tag"},"sugar":{"start_index":466,"length":5,"steps":1,"WordTag":"tag"},"almond":{"start_index":469,"length":6,"steps":30,"WordTag":"tag"},"truffle":{"start_index":676,"length":7,"steps":1,"WordTag":"tag"},"butter":{"start_index":648,"length":6,"steps":30,"WordTag":"tag"},"steak":{"start_index":339,"length":5,"steps":30,"WordTag":"tag"},"mandarin":{"start_index":131,"length":8,"steps":1,"WordTag":"tag"},"muesli":{"start_index":225,"length":6,"steps":31,"WordTag":"tag"},"lime":{"start_index":113,"length":4,"steps":30,"WordTag":"tag"},"date":{"start_index":232,"length":4,"steps":30,"WordTag":"tag"},"blackberry":{"start_index":26,"length":10,"steps":30,"WordTag":"tag"},"ham":{"start_index":85,"length":3,"steps":1,"WordTag":"tag"},"strudel":{"start_index":358,"length":7,"steps":30,"WordTag":"tag"},"flour":{"start_index":414,"length":5,"steps":1,"WordTag":"tag"},"eggplant":{"start_index":622,"length":8,"steps":1,"WordTag":"tag"},"peach":{"start_index":625,"length":5,"steps":30,"WordTag":"tag"},"cheese":{"start_index":744,"length":6,"steps":1,"WordTag":"tag"},"pudding":{"start_index":647,"length":7,"steps":31,"WordTag":"tag"},"lamb":{"start_index":499,"length":4,"steps":1,"WordTag":"tag"},"clementine":{"start_index":37,"length":10,"steps":1,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"S4-2","puzzle_length":38,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"parsley":{"start_index":0,"length":7,"steps":31,"WordTag":"tag"},"orange":{"start_index":30,"length":6,"steps":30,"WordTag":"tag"},"carrot":{"start_index":2,"length":6,"steps":30,"WordTag":"tag"},"marshmallow":{"start_index":4,"length":11,"steps":1,"WordTag":"tag"},"kiwi":{"start_index":34,"length":4,"steps":31,"WordTag":"tag"},"pineapple":{"start_index":64,"length":9,"steps":1,"WordTag":"tag"},"meat":{"start_index":154,"length":4,"steps":1,"WordTag":"tag"},"chili":{"start_index":158,"length":5,"steps":1,"WordTag":"tag"},"pomegranate":{"start_index":210,"length":11,"steps":1,"WordTag":"tag"},"guava":{"start_index":214,"length":5,"steps":31,"WordTag":"tag"},"mushroom":{"start_index":472,"length":8,"steps":30,"WordTag":"tag"},"curry":{"start_index":556,"length":5,"steps":1,"WordTag":"tag"},"tuna":{"start_index":527,"length":4,"steps":30,"WordTag":"tag"},"wafer":{"start_index":588,"length":5,"steps":30,"WordTag":"tag"},"bread":{"start_index":707,"length":5,"steps":1,"WordTag":"tag"},"coffee":{"start_index":621,"length":6,"steps":1,"WordTag":"tag"},"oregano":{"start_index":566,"length":7,"steps":30,"WordTag":"tag"},"pumpkin":{"start_index":244,"length":7,"steps":1,"WordTag":"tag"},"cherry":{"start_index":44,"length":6,"steps":30,"WordTag":"tag"},"honey":{"start_index":74,"length":5,"steps":1,"WordTag":"tag"},"cake":{"start_index":685,"length":4,"steps":1,"WordTag":"tag"},"ginger":{"start_index":568,"length":6,"steps":30,"WordTag":"tag"},"apricot":{"start_index":741,"length":7,"steps":1,"WordTag":"tag"},"papaya":{"start_index":620,"length":6,"steps":30,"WordTag":"tag"},"pie":{"start_index":533,"length":3,"steps":31,"WordTag":"tag"},"donut":{"start_index":443,"length":5,"steps":31,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"G2 - new","puzzle_length":26,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"watermelon":{"start_index":34,"length":10,"steps":30,"WordTag":"tag"},"mustard":{"start_index":35,"length":7,"steps":30,"WordTag":"tag"},"avocado":{"start_index":9,"length":7,"steps":1,"WordTag":"tag"},"celery":{"start_index":12,"length":6,"steps":31,"WordTag":"tag"},"egg":{"start_index":105,"length":3,"steps":30,"WordTag":"tag"},"biscuit":{"start_index":66,"length":7,"steps":1,"WordTag":"tag"},"broccoli":{"start_index":127,"length":8,"steps":1,"WordTag":"tag"},"yogurt":{"start_index":161,"length":6,"steps":30,"WordTag":"tag"},"sushi":{"start_index":250,"length":5,"steps":1,"WordTag":"tag"},"pasta":{"start_index":192,"length":5,"steps":30,"WordTag":"tag"},"coockie":{"start_index":69,"length":7,"steps":30,"WordTag":"tag"},"coconut":{"start_index":659,"length":7,"steps":30,"WordTag":"tag"},"noodles":{"start_index":769,"length":7,"steps":1,"WordTag":"tag"},"mango":{"start_index":628,"length":5,"steps":30,"WordTag":"tag"},"spinach":{"start_index":860,"length":7,"steps":1,"WordTag":"tag"},"guacamole":{"start_index":890,"length":9,"steps":1,"WordTag":"tag"},"grape":{"start_index":834,"length":5,"steps":1,"WordTag":"tag"},"hummus":{"start_index":620,"length":6,"steps":31,"WordTag":"tag"},"bacon":{"start_index":655,"length":5,"steps":31,"WordTag":"tag"},"oatmeal":{"start_index":15,"length":7,"steps":31,"WordTag":"tag"},"bolognese":{"start_index":799,"length":9,"steps":1,"WordTag":"tag"},"radish":{"start_index":678,"length":6,"steps":30,"WordTag":"tag"},"potato":{"start_index":596,"length":6,"steps":30,"WordTag":"tag"},"chocolate":{"start_index":617,"length":9,"steps":30,"WordTag":"tag"},"salmon":{"start_index":592,"length":6,"steps":30,"WordTag":"tag"},"tofu":{"start_index":101,"length":4,"steps":31,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"G3 - new","puzzle_length":26,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"zucchini":{"start_index":571,"length":8,"steps":30,"WordTag":"tag"},"ham":{"start_index":574,"length":3,"steps":31,"WordTag":"tag"},"cinnamon":{"start_index":720,"length":8,"steps":1,"WordTag":"tag"},"mandarin":{"start_index":582,"length":8,"steps":30,"WordTag":"tag"},"croissant":{"start_index":696,"length":9,"steps":1,"WordTag":"tag"},"cheese":{"start_index":21,"length":6,"steps":1,"WordTag":"tag"},"blackberry":{"start_index":28,"length":10,"steps":30,"WordTag":"tag"},"cracker":{"start_index":21,"length":7,"steps":30,"WordTag":"tag"},"cucumber":{"start_index":21,"length":8,"steps":31,"WordTag":"tag"},"butter":{"start_index":87,"length":6,"steps":30,"WordTag":"tag"},"jelly":{"start_index":170,"length":5,"steps":1,"WordTag":"tag"},"oil":{"start_index":203,"length":3,"steps":1,"WordTag":"tag"},"peach":{"start_index":262,"length":5,"steps":1,"WordTag":"tag"},"salt":{"start_index":291,"length":4,"steps":1,"WordTag":"tag"},"date":{"start_index":234,"length":4,"steps":30,"WordTag":"tag"},"falafel":{"start_index":233,"length":7,"steps":31,"WordTag":"tag"},"corn":{"start_index":83,"length":4,"steps":1,"WordTag":"tag"},"pizza":{"start_index":59,"length":5,"steps":30,"WordTag":"tag"},"spaghetti":{"start_index":291,"length":9,"steps":31,"WordTag":"tag"},"crab":{"start_index":572,"length":4,"steps":31,"WordTag":"tag"},"banana":{"start_index":665,"length":6,"steps":1,"WordTag":"tag"},"pudding":{"start_index":787,"length":7,"steps":1,"WordTag":"tag"},"sugar":{"start_index":570,"length":5,"steps":31,"WordTag":"tag"},"almond":{"start_index":755,"length":6,"steps":1,"WordTag":"tag"},"clementine":{"start_index":840,"length":10,"steps":1,"WordTag":"tag"},"scone":{"start_index":752,"length":5,"steps":31,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"G4 - new","puzzle_length":26,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"hamburger":{"start_index":270,"length":9,"steps":31,"WordTag":"tag"},"walnut":{"start_index":300,"length":6,"steps":1,"WordTag":"tag"},"garlic":{"start_index":330,"length":6,"steps":30,"WordTag":"tag"},"bagel":{"start_index":363,"length":5,"steps":1,"WordTag":"tag"},"onion":{"start_index":368,"length":5,"steps":30,"WordTag":"tag"},"muffin":{"start_index":393,"length":6,"steps":1,"WordTag":"tag"},"beer":{"start_index":422,"length":4,"steps":1,"WordTag":"tag"},"chips":{"start_index":480,"length":5,"steps":1,"WordTag":"tag"},"pepper":{"start_index":483,"length":6,"steps":30,"WordTag":"tag"},"salad":{"start_index":484,"length":5,"steps":30,"WordTag":"tag"},"peanut":{"start_index":545,"length":6,"steps":1,"WordTag":"tag"},"artichoke":{"start_index":632,"length":9,"steps":1,"WordTag":"tag"},"cauliflower":{"start_index":19,"length":11,"steps":31,"WordTag":"tag"},"asparagus":{"start_index":50,"length":9,"steps":30,"WordTag":"tag"},"lettuce":{"start_index":112,"length":7,"steps":1,"WordTag":"tag"},"baloney":{"start_index":139,"length":7,"steps":30,"WordTag":"tag"},"pancake":{"start_index":110,"length":7,"steps":31,"WordTag":"tag"},"milk":{"start_index":262,"length":4,"steps":1,"WordTag":"tag"},"crepe":{"start_index":294,"length":5,"steps":1,"WordTag":"tag"},"tortilla":{"start_index":516,"length":8,"steps":1,"WordTag":"tag"},"fig":{"start_index":540,"length":3,"steps":31,"WordTag":"tag"},"nectarine":{"start_index":17,"length":9,"steps":1,"WordTag":"tag"},"schnitzel":{"start_index":29,"length":9,"steps":30,"WordTag":"tag"},"apple":{"start_index":14,"length":5,"steps":31,"WordTag":"tag"},"ketchup":{"start_index":27,"length":7,"steps":30,"WordTag":"tag"},"parmesan":{"start_index":573,"length":8,"steps":1,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"G1 - new","puzzle_length":26,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"asd":{"start_index":37,"length":3,"steps":1,"WordTag":"tag"},"poi":{"start_index":43,"length":3,"steps":30,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"Test2","puzzle_length":2,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"tre":{"start_index":67,"length":3,"steps":30,"WordTag":"tag"},"sdf":{"start_index":103,"length":3,"steps":31,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"Test3","puzzle_length":2,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"fgdf":{"start_index":38,"length":4,"steps":1,"WordTag":"tag"},"fgfdg":{"start_index":92,"length":5,"steps":31,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"Test4","puzzle_length":2,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"ggd":{"start_index":68,"length":3,"steps":30,"WordTag":"tag"},"fdfdghfg":{"start_index":71,"length":8,"steps":1,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"Test5","puzzle_length":2,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_data":{"hjghjgjhg":{"start_index":44,"length":9,"steps":1,"WordTag":"tag"},"hxdfxfdfgb":{"start_index":44,"length":10,"steps":21,"WordTag":"tag"},"hcghcgdfgdg":{"start_index":44,"length":11,"steps":20,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"Test2015","puzzle_length":3,"puzzle_size":"20X15","puzzle_rows":15,"puzzle_cols":20},{"puzzle_data":{"asd":{"start_index":49,"length":3,"steps":16,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"Test1512","puzzle_length":1,"puzzle_size":"15X12","puzzle_rows":12,"puzzle_cols":15},{"puzzle_data":{"uuu":{"start_index":50,"length":3,"steps":15,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"Test1512-2","puzzle_length":1,"puzzle_size":"15X12","puzzle_rows":12,"puzzle_cols":15},{"puzzle_data":{"guava":{"start_index":426,"length":5,"steps":26,"WordTag":"tag"},"papaya":{"start_index":475,"length":6,"steps":1,"WordTag":"tag"},"honey":{"start_index":500,"length":5,"steps":26,"WordTag":"tag"},"pie":{"start_index":405,"length":3,"steps":25,"WordTag":"tag"},"ginger":{"start_index":550,"length":6,"steps":1,"WordTag":"tag"},"pumpkin":{"start_index":406,"length":7,"steps":25,"WordTag":"tag"},"cherry":{"start_index":354,"length":6,"steps":25,"WordTag":"tag"},"meat":{"start_index":456,"length":4,"steps":26,"WordTag":"tag"},"orange":{"start_index":579,"length":6,"steps":1,"WordTag":"tag"},"donut":{"start_index":525,"length":5,"steps":1,"WordTag":"tag"},"carrot":{"start_index":409,"length":6,"steps":25,"WordTag":"tag"},"kiwi":{"start_index":350,"length":4,"steps":26,"WordTag":"tag"},"oregano":{"start_index":408,"length":7,"steps":25,"WordTag":"tag"},"bread":{"start_index":278,"length":5,"steps":26,"WordTag":"tag"},"mushroom":{"start_index":300,"length":8,"steps":1,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"G2  - new new","puzzle_length":15,"puzzle_size":"25X25","puzzle_rows":25,"puzzle_cols":25},{"puzzle_data":{"schnitzel":{"start_index":62,"length":9,"steps":26,"WordTag":"tag"},"lettuce":{"start_index":16,"length":7,"steps":26,"WordTag":"tag"},"garlic":{"start_index":194,"length":6,"steps":26,"WordTag":"tag"},"salad":{"start_index":141,"length":5,"steps":1,"WordTag":"tag"},"hamburger":{"start_index":35,"length":9,"steps":1,"WordTag":"tag"},"muffin":{"start_index":18,"length":6,"steps":26,"WordTag":"tag"},"fig":{"start_index":65,"length":3,"steps":26,"WordTag":"tag"},"cauliflower":{"start_index":24,"length":11,"steps":25,"WordTag":"tag"},"artichoke":{"start_index":163,"length":9,"steps":1,"WordTag":"tag"},"onion":{"start_index":48,"length":5,"steps":25,"WordTag":"tag"},"bagel":{"start_index":173,"length":5,"steps":25,"WordTag":"tag"},"asparagus":{"start_index":36,"length":9,"steps":25,"WordTag":"tag"},"pepper":{"start_index":87,"length":6,"steps":25,"WordTag":"tag"},"apple":{"start_index":240,"length":5,"steps":1,"WordTag":"tag"},"milk":{"start_index":90,"length":4,"steps":1,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"G1 - new new","puzzle_length":15,"puzzle_size":"25X25","puzzle_rows":25,"puzzle_cols":25},{"puzzle_data":{"schnitzel":{"start_index":0,"length":9,"steps":26,"WordTag":"tag"},"bagel":{"start_index":72,"length":5,"steps":25,"WordTag":"tag"},"pepper":{"start_index":303,"length":6,"steps":25,"WordTag":"tag"},"lettuce":{"start_index":363,"length":7,"steps":26,"WordTag":"tag"},"muffin":{"start_index":89,"length":6,"steps":26,"WordTag":"tag"},"hamburger":{"start_index":32,"length":9,"steps":1,"WordTag":"tag"},"garlic":{"start_index":477,"length":6,"steps":26,"WordTag":"tag"},"cauliflower":{"start_index":223,"length":11,"steps":25,"WordTag":"tag"},"artichoke":{"start_index":587,"length":9,"steps":1,"WordTag":"tag"},"apple":{"start_index":291,"length":5,"steps":1,"WordTag":"tag"},"onion":{"start_index":126,"length":5,"steps":25,"WordTag":"tag"},"fig":{"start_index":136,"length":3,"steps":26,"WordTag":"tag"},"asparagus":{"start_index":282,"length":9,"steps":25,"WordTag":"tag"},"milk":{"start_index":435,"length":4,"steps":1,"WordTag":"tag"},"salad":{"start_index":236,"length":5,"steps":1,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"S1 - new new","puzzle_length":15,"puzzle_size":"25X25","puzzle_rows":25,"puzzle_cols":25},{"puzzle_data":{"guava":{"start_index":57,"length":5,"steps":26,"WordTag":"tag"},"papaya":{"start_index":454,"length":6,"steps":1,"WordTag":"tag"},"honey":{"start_index":419,"length":5,"steps":26,"WordTag":"tag"},"pie":{"start_index":96,"length":3,"steps":25,"WordTag":"tag"},"ginger":{"start_index":585,"length":6,"steps":1,"WordTag":"tag"},"pumpkin":{"start_index":201,"length":7,"steps":25,"WordTag":"tag"},"cherry":{"start_index":313,"length":6,"steps":25,"WordTag":"tag"},"meat":{"start_index":501,"length":4,"steps":26,"WordTag":"tag"},"orange":{"start_index":231,"length":6,"steps":1,"WordTag":"tag"},"carrot":{"start_index":192,"length":6,"steps":25,"WordTag":"tag"},"kiwi":{"start_index":26,"length":4,"steps":26,"WordTag":"tag"},"oregano":{"start_index":123,"length":7,"steps":25,"WordTag":"tag"},"bread":{"start_index":279,"length":5,"steps":26,"WordTag":"tag"},"mushroom":{"start_index":36,"length":8,"steps":1,"WordTag":"tag"},"donut":{"start_index":515,"length":5,"steps":1,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"S2 - new new","puzzle_length":15,"puzzle_size":"25X25","puzzle_rows":25,"puzzle_cols":25},{"puzzle_data":{"watermelon":{"start_index":1,"length":10,"steps":1,"WordTag":"tag"},"avocado":{"start_index":2,"length":7,"steps":25,"WordTag":"tag"},"broccoli":{"start_index":0,"length":8,"steps":26,"WordTag":"tag"},"biscuit":{"start_index":0,"length":7,"steps":25,"WordTag":"tag"},"yogurt":{"start_index":51,"length":6,"steps":1,"WordTag":"tag"},"sushi":{"start_index":28,"length":5,"steps":26,"WordTag":"tag"},"coconut":{"start_index":78,"length":7,"steps":25,"WordTag":"tag"},"egg":{"start_index":7,"length":3,"steps":26,"WordTag":"tag"},"mango":{"start_index":30,"length":5,"steps":1,"WordTag":"tag"},"chocolate":{"start_index":104,"length":9,"steps":25,"WordTag":"tag"},"pasta":{"start_index":250,"length":5,"steps":1,"WordTag":"tag"},"grape":{"start_index":76,"length":5,"steps":25,"WordTag":"tag"},"cookie":{"start_index":57,"length":6,"steps":26,"WordTag":"tag"},"potato":{"start_index":108,"length":6,"steps":1,"WordTag":"tag"},"celery":{"start_index":79,"length":6,"steps":26,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"G3 - new new","puzzle_length":15,"puzzle_size":"25X25","puzzle_rows":25,"puzzle_cols":25},{"puzzle_data":{"sushi":{"start_index":26,"length":5,"steps":26,"WordTag":"tag"},"broccoli":{"start_index":264,"length":8,"steps":26,"WordTag":"tag"},"egg":{"start_index":44,"length":3,"steps":26,"WordTag":"tag"},"cookie":{"start_index":377,"length":6,"steps":26,"WordTag":"tag"},"celery":{"start_index":437,"length":6,"steps":26,"WordTag":"tag"},"watermelon":{"start_index":84,"length":10,"steps":25,"WordTag":"tag"},"yogurt":{"start_index":198,"length":6,"steps":25,"WordTag":"tag"},"mango":{"start_index":151,"length":5,"steps":25,"WordTag":"tag"},"pasta":{"start_index":41,"length":5,"steps":25,"WordTag":"tag"},"potato":{"start_index":452,"length":6,"steps":25,"WordTag":"tag"},"avocado":{"start_index":188,"length":7,"steps":1,"WordTag":"tag"},"biscuit":{"start_index":355,"length":7,"steps":1,"WordTag":"tag"},"coconut":{"start_index":581,"length":7,"steps":1,"WordTag":"tag"},"chocolate":{"start_index":30,"length":9,"steps":1,"WordTag":"tag"},"grape":{"start_index":519,"length":5,"steps":1,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"S3 - new new","puzzle_length":15,"puzzle_size":"25X25","puzzle_rows":25,"puzzle_cols":25},{"puzzle_data":{"watermelon":{"start_index":1,"length":10,"steps":1,"WordTag":"tag"},"avocado":{"start_index":2,"length":7,"steps":23,"WordTag":"tag"},"biscuit":{"start_index":0,"length":7,"steps":23,"WordTag":"tag"},"yogurt":{"start_index":47,"length":6,"steps":1,"WordTag":"tag"},"sushi":{"start_index":26,"length":5,"steps":24,"WordTag":"tag"},"broccoli":{"start_index":0,"length":8,"steps":24,"WordTag":"tag"},"coconut":{"start_index":72,"length":7,"steps":23,"WordTag":"tag"},"egg":{"start_index":7,"length":3,"steps":24,"WordTag":"tag"},"mango":{"start_index":28,"length":5,"steps":1,"WordTag":"tag"},"chocolate":{"start_index":96,"length":9,"steps":23,"WordTag":"tag"},"pasta":{"start_index":230,"length":5,"steps":1,"WordTag":"tag"},"grape":{"start_index":31,"length":5,"steps":23,"WordTag":"tag"},"potato":{"start_index":73,"length":6,"steps":24,"WordTag":"tag"},"cake":{"start_index":165,"length":4,"steps":24,"WordTag":"tag"},"celery":{"start_index":236,"length":6,"steps":1,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"G3","puzzle_length":15,"puzzle_size":"23X23","puzzle_rows":23,"puzzle_cols":23},{"puzzle_data":{"schnitzel":{"start_index":0,"length":9,"steps":24,"WordTag":"tag"},"hamburger":{"start_index":32,"length":9,"steps":1,"WordTag":"tag"},"lettuce":{"start_index":361,"length":7,"steps":24,"WordTag":"tag"},"garlic":{"start_index":461,"length":6,"steps":1,"WordTag":"tag"},"salad":{"start_index":267,"length":5,"steps":1,"WordTag":"tag"},"muffin":{"start_index":109,"length":6,"steps":24,"WordTag":"tag"},"fig":{"start_index":79,"length":3,"steps":24,"WordTag":"tag"},"cauliflower":{"start_index":116,"length":11,"steps":23,"WordTag":"tag"},"artichoke":{"start_index":492,"length":9,"steps":1,"WordTag":"tag"},"onion":{"start_index":297,"length":5,"steps":23,"WordTag":"tag"},"bagel":{"start_index":44,"length":5,"steps":23,"WordTag":"tag"},"asparagus":{"start_index":218,"length":9,"steps":23,"WordTag":"tag"},"apple":{"start_index":174,"length":5,"steps":1,"WordTag":"tag"},"pepper":{"start_index":237,"length":6,"steps":23,"WordTag":"tag"},"milk":{"start_index":348,"length":4,"steps":24,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"S1","puzzle_length":15,"puzzle_size":"23X23","puzzle_rows":23,"puzzle_cols":23},{"puzzle_data":{"watermelon":{"start_index":24,"length":10,"steps":1,"WordTag":"tag"},"avocado":{"start_index":66,"length":7,"steps":23,"WordTag":"tag"},"broccoli":{"start_index":243,"length":8,"steps":24,"WordTag":"tag"},"sushi":{"start_index":92,"length":5,"steps":24,"WordTag":"tag"},"coconut":{"start_index":324,"length":7,"steps":23,"WordTag":"tag"},"egg":{"start_index":419,"length":3,"steps":24,"WordTag":"tag"},"chocolate":{"start_index":40,"length":9,"steps":23,"WordTag":"tag"},"pasta":{"start_index":380,"length":5,"steps":1,"WordTag":"tag"},"grape":{"start_index":390,"length":5,"steps":23,"WordTag":"tag"},"potato":{"start_index":208,"length":6,"steps":24,"WordTag":"tag"},"celery":{"start_index":194,"length":6,"steps":1,"WordTag":"tag"},"cake":{"start_index":81,"length":4,"steps":24,"WordTag":"tag"},"biscuit":{"start_index":262,"length":7,"steps":23,"WordTag":"tag"},"yogurt":{"start_index":497,"length":6,"steps":1,"WordTag":"tag"},"mango":{"start_index":120,"length":5,"steps":1,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"S3","puzzle_length":15,"puzzle_size":"23X23","puzzle_rows":23,"puzzle_cols":23},{"puzzle_data":{"honey":{"start_index":408,"length":5,"steps":24,"WordTag":"tag"},"pie":{"start_index":66,"length":3,"steps":23,"WordTag":"tag"},"ginger":{"start_index":24,"length":6,"steps":23,"WordTag":"tag"},"pumpkin":{"start_index":238,"length":7,"steps":1,"WordTag":"tag"},"cherry":{"start_index":312,"length":6,"steps":23,"WordTag":"tag"},"meat":{"start_index":414,"length":4,"steps":24,"WordTag":"tag"},"papaya":{"start_index":396,"length":6,"steps":1,"WordTag":"tag"},"orange":{"start_index":152,"length":6,"steps":1,"WordTag":"tag"},"donut":{"start_index":34,"length":5,"steps":1,"WordTag":"tag"},"carrot":{"start_index":228,"length":6,"steps":23,"WordTag":"tag"},"soy":{"start_index":231,"length":3,"steps":24,"WordTag":"tag"},"oregano":{"start_index":73,"length":7,"steps":23,"WordTag":"tag"},"bread":{"start_index":259,"length":5,"steps":24,"WordTag":"tag"},"mushroom":{"start_index":515,"length":8,"steps":1,"WordTag":"tag"},"guava":{"start_index":52,"length":5,"steps":24,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"S2","puzzle_length":15,"puzzle_size":"23X23","puzzle_rows":23,"puzzle_cols":23},{"puzzle_data":{"gravel":{"start_index":45,"length":6,"steps":25,"WordTag":"tag"},"staple":{"start_index":93,"length":6,"steps":1,"WordTag":"tag"},"anchor":{"start_index":92,"length":6,"steps":25,"WordTag":"tag"},"weasel":{"start_index":40,"length":6,"steps":26,"WordTag":"tag"},"number":{"start_index":117,"length":6,"steps":26,"WordTag":"tag"},"insect":{"start_index":218,"length":6,"steps":1,"WordTag":"tag"},"carrot":{"start_index":244,"length":6,"steps":1,"WordTag":"tag"},"stereo":{"start_index":578,"length":6,"steps":1,"WordTag":"tag"},"zipper":{"start_index":551,"length":6,"steps":1,"WordTag":"tag"},"coffee":{"start_index":455,"length":6,"steps":25,"WordTag":"tag"},"powder":{"start_index":454,"length":6,"steps":26,"WordTag":"tag"},"canvas":{"start_index":455,"length":6,"steps":26,"WordTag":"tag"},"mother":{"start_index":451,"length":6,"steps":26,"WordTag":"tag"},"summer":{"start_index":376,"length":6,"steps":25,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"SSD_pilot","puzzle_length":14,"puzzle_size":"25X25","puzzle_rows":25,"puzzle_cols":25},{"puzzle_data":{"try":{"start_index":53,"length":3,"steps":1,"WordTag":"tag"}},"puzzle_type":"Scattered","puzzle_id":"tryyyy","puzzle_length":1,"puzzle_size":"25X25","puzzle_rows":25,"puzzle_cols":25},{"puzzle_data":{"gravel":{"start_index":39,"length":6,"steps":22,"WordTag":"tag"},"weasel":{"start_index":37,"length":6,"steps":23,"WordTag":"tag"},"staple":{"start_index":81,"length":6,"steps":1,"WordTag":"tag"},"anchor":{"start_index":80,"length":6,"steps":22,"WordTag":"tag"},"number":{"start_index":102,"length":6,"steps":23,"WordTag":"tag"},"insect":{"start_index":191,"length":6,"steps":1,"WordTag":"tag"},"carrot":{"start_index":144,"length":6,"steps":23,"WordTag":"tag"},"stereo":{"start_index":443,"length":6,"steps":1,"WordTag":"tag"},"zipper":{"start_index":419,"length":6,"steps":1,"WordTag":"tag"},"coffee":{"start_index":335,"length":6,"steps":22,"WordTag":"tag"},"powder":{"start_index":334,"length":6,"steps":23,"WordTag":"tag"},"canvas":{"start_index":335,"length":6,"steps":23,"WordTag":"tag"},"mother":{"start_index":331,"length":6,"steps":23,"WordTag":"tag"},"summer":{"start_index":287,"length":6,"steps":22,"WordTag":"tag"}},"puzzle_type":"Grouped","puzzle_id":"22Pilot_SSD","puzzle_length":14,"puzzle_size":"22X22","puzzle_rows":22,"puzzle_cols":22},{"puzzle_data":{"stereo":{"start_index":0,"length":6,"steps":19,"WordTag":"tag 1"},"summer":{"start_index":72,"length":6,"steps":1,"WordTag":"tag 1"},"mother":{"start_index":4,"length":6,"steps":18,"WordTag":"tag 1"},"powder":{"start_index":21,"length":6,"steps":1,"WordTag":"tag 1"},"coffee":{"start_index":109,"length":6,"steps":1,"WordTag":"tag 1"},"canvas":{"start_index":109,"length":6,"steps":19,"WordTag":"tag 1"},"number":{"start_index":228,"length":6,"steps":1,"WordTag":"tag 1"},"anchor":{"start_index":210,"length":6,"steps":18,"WordTag":"tag 2"},"carrot":{"start_index":246,"length":6,"steps":1,"WordTag":"tag 2"},"gravel":{"start_index":299,"length":6,"steps":1,"WordTag":"tag 2"},"staple":{"start_index":137,"length":6,"steps":19,"WordTag":"tag 2"},"weasel":{"start_index":208,"length":6,"steps":1,"WordTag":"tag 2"},"insect":{"start_index":155,"length":6,"steps":18,"WordTag":"tag 2"},"zipper":{"start_index":42,"length":6,"steps":18,"WordTag":"tag 2"}},"puzzle_type":"Scattered","puzzle_id":"18x18 try unrelated2","puzzle_length":14,"puzzle_size":"18X18","puzzle_rows":18,"puzzle_cols":18},{"puzzle_data":{"gravel":{"start_index":45,"length":6,"steps":25,"WordTag":"1"},"staple":{"start_index":93,"length":6,"steps":1,"WordTag":"1"},"anchor":{"start_index":92,"length":6,"steps":25,"WordTag":"1"},"weasel":{"start_index":43,"length":6,"steps":26,"WordTag":"1"},"number":{"start_index":117,"length":6,"steps":26,"WordTag":"1"},"insect":{"start_index":218,"length":6,"steps":1,"WordTag":"1"},"zipper":{"start_index":551,"length":6,"steps":1,"WordTag":"2"},"stereo":{"start_index":578,"length":6,"steps":1,"WordTag":"2"},"coffee":{"start_index":455,"length":6,"steps":25,"WordTag":"2"},"powder":{"start_index":454,"length":6,"steps":26,"WordTag":"2"},"canvas":{"start_index":455,"length":6,"steps":26,"WordTag":"2"},"mother":{"start_index":451,"length":6,"steps":26,"WordTag":"2"},"summer":{"start_index":376,"length":6,"steps":25,"WordTag":"2"},"carrot":{"start_index":165,"length":6,"steps":26,"WordTag":"1"}},"puzzle_type":"Grouped","puzzle_id":"ssd_pilot","puzzle_length":14,"puzzle_size":"25X25","puzzle_rows":25,"puzzle_cols":25},{"puzzle_id":"G4","puzzle_data":{"juice":{"start_index":396,"length":5,"steps":1,"WordTag":"2"},"crab":{"start_index":399,"length":4,"steps":31,"WordTag":"2"},"pudding":{"start_index":452,"length":7,"steps":1,"WordTag":"2"},"eggplant":{"start_index":428,"length":8,"steps":30,"WordTag":"2"},"sugar":{"start_index":486,"length":5,"steps":1,"WordTag":"2"},"banana":{"start_index":519,"length":6,"steps":1,"WordTag":"2"},"steak":{"start_index":483,"length":5,"steps":30,"WordTag":"2"},"zucchini":{"start_index":571,"length":8,"steps":30,"WordTag":"2"},"tahini":{"start_index":572,"length":6,"steps":1,"WordTag":"2"},"ham":{"start_index":574,"length":3,"steps":31,"WordTag":"2"},"scone":{"start_index":486,"length":5,"steps":30,"WordTag":"2"},"cinnamon":{"start_index":720,"length":8,"steps":1,"WordTag":"2"},"raisin":{"start_index":490,"length":6,"steps":30,"WordTag":"2"},"almond":{"start_index":520,"length":6,"steps":31,"WordTag":"2"},"mandarin":{"start_index":582,"length":8,"steps":30,"WordTag":"2"},"muesli":{"start_index":611,"length":6,"steps":30,"WordTag":"2"},"croissant":{"start_index":696,"length":9,"steps":1,"WordTag":"2"},"lime":{"start_index":669,"length":4,"steps":30,"WordTag":"2"},"strudel":{"start_index":783,"length":7,"steps":1,"WordTag":"2"},"clementine":{"start_index":814,"length":10,"steps":1,"WordTag":"2"},"cheese":{"start_index":21,"length":6,"steps":1,"WordTag":"1"},"blackberry":{"start_index":28,"length":10,"steps":30,"WordTag":"1"},"cracker":{"start_index":21,"length":7,"steps":30,"WordTag":"1"},"cucumber":{"start_index":21,"length":8,"steps":31,"WordTag":"1"},"lamb":{"start_index":85,"length":4,"steps":30,"WordTag":"1"},"butter":{"start_index":87,"length":6,"steps":30,"WordTag":"1"},"paprika":{"start_index":89,"length":7,"steps":30,"WordTag":"1"},"kale":{"start_index":141,"length":4,"steps":1,"WordTag":"1"},"jelly":{"start_index":170,"length":5,"steps":1,"WordTag":"1"},"oil":{"start_index":203,"length":3,"steps":1,"WordTag":"1"},"peach":{"start_index":262,"length":5,"steps":1,"WordTag":"1"},"salt":{"start_index":291,"length":4,"steps":1,"WordTag":"1"},"date":{"start_index":234,"length":4,"steps":30,"WordTag":"1"},"falafel":{"start_index":233,"length":7,"steps":31,"WordTag":"1"},"truffle":{"start_index":353,"length":7,"steps":1,"WordTag":"1"},"flour":{"start_index":357,"length":5,"steps":30,"WordTag":"1"},"corn":{"start_index":475,"length":4,"steps":1,"WordTag":"1"},"nachos":{"start_index":415,"length":6,"steps":30,"WordTag":"1"},"pizza":{"start_index":508,"length":5,"steps":30,"WordTag":"1"},"spaghetti":{"start_index":509,"length":9,"steps":30,"WordTag":"1"}},"puzzle_type":"Grouped","puzzle_length":40,"puzzle_size":"30X30","puzzle_rows":30,"puzzle_cols":30},{"puzzle_id":"G1","puzzle_data":{"salad":{"start_index":415,"length":5,"steps":24,"WordTag":"2"},"artichoke":{"start_index":439,"length":9,"steps":1,"WordTag":"2"},"onion":{"start_index":376,"length":5,"steps":23,"WordTag":"2"},"bagel":{"start_index":332,"length":5,"steps":23,"WordTag":"2"},"asparagus":{"start_index":323,"length":9,"steps":1,"WordTag":"2"},"pepper":{"start_index":279,"length":6,"steps":23,"WordTag":"2"},"garlic":{"start_index":392,"length":6,"steps":1,"WordTag":"2"},"fig":{"start_index":350,"length":3,"steps":1,"WordTag":"2"},"schnitzel":{"start_index":44,"length":9,"steps":23,"WordTag":"1"},"hamburger":{"start_index":35,"length":9,"steps":1,"WordTag":"1"},"lettuce":{"start_index":61,"length":7,"steps":24,"WordTag":"1"},"muffin":{"start_index":134,"length":6,"steps":23,"WordTag":"1"},"cauliflower":{"start_index":104,"length":11,"steps":24,"WordTag":"1"},"apple":{"start_index":58,"length":5,"steps":1,"WordTag":"1"},"milk":{"start_index":106,"length":4,"steps":24,"WordTag":"1"}},"puzzle_type":"Grouped","puzzle_length":15,"puzzle_size":"23X23","puzzle_rows":23,"puzzle_cols":23},{"puzzle_id":"G2","puzzle_data":{"ginger":{"start_index":44,"length":6,"steps":23,"WordTag":"1"},"pumpkin":{"start_index":84,"length":7,"steps":1,"WordTag":"1"},"meat":{"start_index":86,"length":4,"steps":23,"WordTag":"1"},"donut":{"start_index":59,"length":5,"steps":24,"WordTag":"1"},"carrot":{"start_index":105,"length":6,"steps":24,"WordTag":"1"},"mushroom":{"start_index":112,"length":8,"steps":23,"WordTag":"1"},"bread":{"start_index":176,"length":5,"steps":1,"WordTag":"1"},"soy":{"start_index":62,"length":3,"steps":1,"WordTag":"1"},"papaya":{"start_index":373,"length":6,"steps":23,"WordTag":"2"},"honey":{"start_index":369,"length":5,"steps":24,"WordTag":"2"},"pie":{"start_index":373,"length":3,"steps":24,"WordTag":"2"},"cherry":{"start_index":346,"length":6,"steps":1,"WordTag":"2"},"orange":{"start_index":326,"length":6,"steps":24,"WordTag":"2"},"guava":{"start_index":466,"length":5,"steps":1,"WordTag":"2"},"oregano":{"start_index":484,"length":7,"steps":1,"WordTag":"2"}},"puzzle_type":"Grouped","puzzle_length":15,"puzzle_size":"23X23","puzzle_rows":23,"puzzle_cols":23}];

/*
for(let i=0; i<defaultPuzzlesModels.length; i++ ) {
    for (let word in defaultPuzzlesModels[i].puzzle_data){
        if (!('WordTag' in defaultPuzzlesModels[i].puzzle_data[word])) {
            defaultPuzzlesModels[i].puzzle_data[word]['WordTag'] = 'tag';
        }
    }
}
function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
 */

const PuzzleSeeder = async () => {
    try {
        console.log('MODELS');


        /* ############### PUZZLES MODELS ################## */
        let Model = getModelPack('WordPuzzle').extra.puzzles_models;
        await Model.deleteMany();
        await Model.insertMany(defaultPuzzlesModels);

        // WordPuzzlePuzzlesModels
        /* ############### PUZZLES MODELS ################## */
        return 'Complete';

    }
    catch (e) {
        console.log('MODELS ERROR');

    }
};

const Seeder = async () => {
    try {
        /*  ############### Directories ################## */
        const dirs = {
            expDev: 'uploads/expDev',
            logs: 'logs'
        };

        console.log('Directories');

        for (let dir in dirs){
            if (!fs.existsSync(dirs[dir])){
                fs.mkdirSync(dirs[dir]);
            }
        }
        /*  ############### Directories ################## */

        console.log('EMPTY_COLLECTIONS');
console.log("---> EMPTY_COLLECTIONS")
        const EXP_LIST = Object.keys(defaultVersions);

        let Model, new_model;
        /* ############### EMPTY COLLECTIONS ################## */
        Model = getModelPack('RejectedUsers').RejectedUsers;
        new_model = new Model({
            exp: '-',
            user_id: '-',
            ip: '-',
            date: '-',
            time: '-',
            diff: '-',
        });
        await new_model.save();
        await Model.deleteMany();

        Model = getModelPack('OutsourcePlayIP').OutsourcePlayIP;
        new_model = new Model({
            exp: '-',
            ip: '-',
            date: '-',
            time: '-',
            type: 'REDIRECT'
        });
        await new_model.save();
        await Model.deleteMany();

        Model = getModelPack('IPListRunning').IPListRunning;
        new_model = new Model({
            exp: '-',
            user_id: '-',
            ip: '-',
            date: '-',
            time: '-',
            now_date: '-',
        });
        await new_model.save();
        await Model.deleteMany();

        Model = getModelPack('PasswordForget').PasswordForget;
        new_model = new Model({
            email: '-',
            new_password: '-',
        });
        await new_model.save();
        await Model.deleteMany();
        /* ############### EMPTY COLLECTIONS ################## */

        Model = getModelPack('AppSettings').AppSettings;
        await Model.deleteMany();

        /* ############### USER ################## */
        Model = getModelPack('User').User;
        await Model.deleteMany();
        await Model.insertMany(UsersData2);
        /* ############### USER ################## */


        console.log('CONSENT FORM');
        /* ############### CONSENT FORM ################## */
        Model = getModelPack('ConsentForms').ConsentForms;
        await Model.deleteMany();

        for (let i=0; i<EXP_LIST.length; i++){
            let new_model = {
                exp: EXP_LIST[i],
                version: 'test',
                consent_form: {
                    body: '',
                    radio_consent_text: '',
                    radio_not_consent_text: ''
                },
                last_modified: '-',
                date_modified: getTimeDate().date
            };

            let newModel = new Model(new_model);
            await newModel.save();
        }
        /* ############### CONSENT FORM ################## */

        console.log('ACTIVE SET');


        /* ############### ACTIVE SETTINGS ################## */
        Model = getModelPack('ActiveSettings').ActiveSettings;
        await Model.deleteMany();

        for (let i=0; i<EXP_LIST.length; i++){
            let new_model = {
                exp: EXP_LIST[i],
                version: 'test',
                mode: 'Real',
                running_name: 'test',
                last_modified: '-',
                date_modified: getTimeDate().date,
            };

            let newModel = new Model(new_model);
            await newModel.save();
        }
        /* ############### ACTIVE SETTINGS ################## */

        console.log('RUNNING');


        /* ############### RUNNING COUNTERS ################## */
        Model = getModelPack('RunningCounters').RunningCounters;
        await Model.deleteMany();

        for (let i=0; i<EXP_LIST.length; i++){
            let new_model = {
                exp: EXP_LIST[i],
                running_name: 'test',
                counter: 0
            };

            let newModel = new Model(new_model);
            await newModel.save();
        }
        /* ############### RUNNING COUNTERS ################## */

        console.log('EXP DET');


        /* ############### EXPERIMENT DETAILS ################## */
        Model = getModelPack('ExpDevDetails').ExpDevDetails;
        await Model.deleteMany();

        for (let i=0; i<EXP_LIST.length; i++){
            let new_model = {
                exp: EXP_LIST[i],
                status: (EXP_LIST[i] === 'WordPuzzle' || EXP_LIST[i] === 'RepeatedChoice') ? 'READY' : 'DEV',
                created_by: 'ggolan@technion.ac.il',
                date_modified: getTimeDate().date,
                date_created: getTimeDate().date
            };

            let newModel = new Model(new_model);
            await newModel.save();
        }
        /* ############### EXPERIMENT DETAILS ################## */

        console.log('TODO');


        /* ############### EXP_TODO LIST ################## */
        Model = getModelPack('ToDoList').ToDoList;
        await Model.deleteMany();

        for (let i=0; i<EXP_LIST.length; i++){
            let new_model = {
                exp: EXP_LIST[i],
            };

            let newModel = new Model(new_model);
            await newModel.save();
        }
        /* ############### EXP_TODO LIST ################## */

        console.log('CHATS');


        /* ############### CHATS ################## */
        Model = getModelPack('Chats').Chats;
        await Model.deleteMany();

        // for (let i=0; i<EXP_LIST.length; i++){
        //     let new_model = {
        //         exp: EXP_LIST[i],
        //     };
        //
        //     let newModel = new Model(new_model);
        //     await newModel.save();
        // }
        /* ############### CHATS ################## */

        console.log('VERSIONS');

        /* ############### VERSIONS CHANGES ################## */
        Model = getModelPack('VersionChanges').VersionChanges;
        await Model.deleteMany();

        for (let i=0; i<EXP_LIST.length; i++){
            let new_model = {
                exp: EXP_LIST[i],
            };

            let newModel = new Model(new_model);
            await newModel.save();
        }
        /* ############### VERSIONS CHANGES ################## */


        console.log('MODELS');


        /* ############### PUZZLES MODELS ################## */
        Model = getModelPack('WordPuzzle').extra.puzzles_models;
        await Model.deleteMany();
        await Model.insertMany(defaultPuzzlesModels);

        // WordPuzzlePuzzlesModels
        /* ############### PUZZLES MODELS ################## */

        console.log('EXPSSSS');

        /* ############### EXPERIMENTS ################## */

        for (let i=0; i<EXP_LIST.length; i++){
            console.log('EXP_LIST[i]', EXP_LIST[i]);
            Model = getModelPack(EXP_LIST[i]).records;
            console.log('Model', Model);

            let newModel = new Model({o:'o'});
            await newModel.save();

            await Model.deleteMany();

            Model = getModelPack(EXP_LIST[i]).versions;
            await Model.deleteMany();

            newModel = new Model(defaultVersions[EXP_LIST[i]]);
            await newModel.save();

            if (!fs.existsSync(dirs.expDev + '/' + EXP_LIST[i])){
                fs.mkdirSync(dirs.expDev + '/' + EXP_LIST[i]);
            }
        }

        /* ############### EXPERIMENTS ################## */

        console.log('FINISH expDev');

        return 'Complete';
    }
    catch (e) {
console.log('---------------------');
console.log('e', e);
console.log('---------------------');
        process.exit(1);
    }

};

const UsersSeeder = async () => {
    try {
        let Model = getModelPack('User').User;
        await Model.deleteMany();
        await Model.insertMany(UsersData2);

        console.log('FINISH Users');

        return 'Complete';
    }
    catch (e) {
        console.log('---------------------');
        console.log('e', e);
        console.log('---------------------');
        process.exit(1);
    }
};

const DevReset = async () => {
    try {
        let UserModel = getModelPack('User').User;
        // const password = '12345';
        const password = await bcrypt.hashSync('12345', 10);

        let user = await UserModel.findOneAndUpdate({email: 'ggolan@technion.ac.il'}, {password});
        console.log('user', user);
        // await user.save();

        const isMatch = await bcrypt.compare(password, '12345');

        console.log('isMatch', isMatch);
        console.log('FINISH DevReset');

        return 'Complete';
    }
    catch (e) {
        console.log('---------------------');
        console.log('e', e);
        console.log('---------------------');
        process.exit(1);
    }
};

module.exports = {
    getModelPack,
    AllModels,
    AllExperiments: Object.keys(defaultVersions),
    Seeder,
    UsersSeeder,
    defaultVersions,
    PuzzleSeeder,
    addNewExperiment,
    DevReset
};

/*
app.use('*', async (req, res, next) => {
  if (first_load){
    first_load = false;
    let ExpDevDetailsModel = getModelPack('ExpDevDetails').ExpDevDetails;
    let ActiveSettingsModel = getModelPack('ActiveSettings').ActiveSettings;
    let ChatsModel = getModelPack('Chats');
    let ToDoListModel = getModelPack('ToDoList');
    let VersionChangesModel = getModelPack('VersionChanges');
    let consentFormModel = getModelPack('ConsentForms').ConsentForms;
    let UserModel = getModelPack('User');

    let user = await UserModel.find();
    if (!user || user.length === 0){
      const salt = await bcrypt.genSalt(10);
      let password = await bcrypt.hash('21ed011985', salt);

      let default_user = {
        age: "1",
        date: new Date(),
        email: "ggolan@technion.ac.il",
        gender: "Male",
        name: "Guy",
        password,
        permission: "Admin"
      }

      user = new UserModel(default_user);

      await user.save();
      let new_user_permissions = new UsersPermmissions({
        email: 'ggolan@technion.ac.il',
        permission: 'SuperAdmin',
        experiments: [],
      });

      await new_user_permissions.save();
    }

    let CurrentDateTime = getTimeDate();
    try {
      for (let i=0; i<AllExperiments.length; i++){

        let model_pack = getModelPack(AllExperiments[i]);
        let exist_set = await model_pack.settings.findOne({version: 'test'});
        if(!exist_set) {
          let new_set_obj = Object.assign({}, model_pack.default_settings, {version: 'test'});
          let new_settings = new model_pack.settings(new_set_obj);
          await new_settings.save();
        }

        let exp_dev_details_exist = await ExpDevDetailsModel.findOne({exp_name: AllExperiments[i]});
        if (!exp_dev_details_exist){
          let exp_dev_details_new = new ExpDevDetailsModel({
            exp_name: AllExperiments[i], url: AllExperiments[i], date_modified: CurrentDateTime.date,
            created_by: 'auto', date_created: CurrentDateTime.date
          });
          await exp_dev_details_new.save();
        }

        let active_settings_exist = await ActiveSettingsModel.findOne({exp: AllExperiments[i]});

        if (!active_settings_exist){
          active_settings_exist = new ActiveSettingsModel({
            exp: AllExperiments[i],
            version: 'test',
            mode: 'Test',
            running_name: 'test',
            last_modified: '-',
            date_modified: CurrentDateTime.date,
          });
          await active_settings_exist.save();
        }

        let exp_chat = await ChatsModel.findOne({exp_name: AllExperiments[i]}).select('chat');

        if (!exp_chat){
          exp_chat = new ChatsModel({
            exp_name: AllExperiments[i],
            chat: []
          });

          await exp_chat.save();
        }

        let exp_todo = await ToDoListModel.findOne({exp_name: AllExperiments[i]});

        if (!exp_todo){
          exp_todo = new ToDoListModel({
            exp_name: AllExperiments[i],
            todo: []
          });

          await exp_todo.save();
        }

        let exp_version_changes = await VersionChangesModel.findOne({exp_name: AllExperiments[i]}).select('version_changes');

        if (!exp_version_changes){
          exp_version_changes = new VersionChangesModel({
            exp_name: AllExperiments[i],
            version_changes: []
          });

          await exp_version_changes.save();
        }

        let consentForm = await consentFormModel.findOne({exp: AllExperiments[i]});

        if (!consentForm) {
          consentForm = new consentFormModel({
            exp: AllExperiments[i],
            consent_form: {
              body: '',
              radio_consent_text: '',
              radio_not_consent_text: ''
            },
            last_modified: '-',
            date_modified: CurrentDateTime.date
          });

          await consentForm.save();
        }
      }
    }
    catch (e){
      console.log('--> e', e.message);

    }
  }
  next()
})
 */
