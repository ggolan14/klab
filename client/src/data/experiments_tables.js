export const AllExperiments ={
    Trivia: {
        main_pathname: '/Trivia/main',
        settings_pathname: '/Trivia/settings',
        start_pathname: '/Trivia/start',
        reports_pathname: '/Trivia/reports',
        consent_pathname: '/Trivia/consent',
        exp_messages_pathname: '/Trivia/exp_messages',
    },
    TryOrGiveUp: {
        main_pathname: '/TryOrGiveUp/main',
        settings_pathname: '/TryOrGiveUp/settings',
        start_pathname: '/TryOrGiveUp/start',
        reports_pathname: '/TryOrGiveUp/reports',
        consent_pathname: '/TryOrGiveUp/consent',
        exp_messages_pathname: '/TryOrGiveUp/exp_messages',
    },
    PointsGame: {
        main_pathname: '/PointsGame/main',
        settings_pathname: '/PointsGame/settings',
        start_pathname: '/PointsGame/start',
        reports_pathname: '/PointsGame/reports',
        consent_pathname: '/PointsGame/consent',
        exp_messages_pathname: '/PointsGame/exp_messages',
    },
    PointsGameSh: {
        main_pathname: '/PointsGameSh/main',
        settings_pathname: '/PointsGameSh/settings',
        start_pathname: '/PointsGameSh/start',
        reports_pathname: '/PointsGameSh/reports',
        consent_pathname: '/PointsGameSh/consent',
        exp_messages_pathname: '/PointsGameSh/exp_messages',
    },
    WordPuzzle: {
        main_pathname: '/WordPuzzle/main',
        settings_pathname: '/WordPuzzle/settings',
        start_pathname: '/WordPuzzle/start',
        reports_pathname: '/WordPuzzle/reports',
        consent_pathname: '/WordPuzzle/consent',
        exp_messages_pathname: '/WordPuzzle/exp_messages',
    },
    CognitiveTask: {
        main_pathname: '/CognitiveTask/main',
        settings_pathname: '/CognitiveTask/settings',
        start_pathname: '/CognitiveTask/start',
        reports_pathname: '/CognitiveTask/reports',
        consent_pathname: '/CognitiveTask/consent',
        exp_messages_pathname: '/CognitiveTask/exp_messages',
    },
    CognitiveTask2: {
        main_pathname: '/CognitiveTask2/main',
        settings_pathname: '/CognitiveTask2/settings',
        start_pathname: '/CognitiveTask2/start',
        reports_pathname: '/CognitiveTask2/reports',
        consent_pathname: '/CognitiveTask2/consent',
        exp_messages_pathname: '/CognitiveTask2/exp_messages',
    },
    RepeatedChoice: {
        main_pathname: '/RepeatedChoice/main',
        settings_pathname: '/RepeatedChoice/settings',
        start_pathname: '/RepeatedChoice/start',
        reports_pathname: '/RepeatedChoice/reports',
        consent_pathname: '/RepeatedChoice/consent',
        exp_messages_pathname: '/RepeatedChoice/exp_messages',
    },
    QueenGarden: {
        main_pathname: '/QueenGarden/main',
        settings_pathname: '/QueenGarden/settings',
        start_pathname: '/QueenGarden/start',
        reports_pathname: '/QueenGarden/reports',
        consent_pathname: '/QueenGarden/consent',
        exp_messages_pathname: '/QueenGarden/exp_messages',
    },
    SP: {
        main_pathname: '/SP/main',
        settings_pathname: '/SP/settings',
        start_pathname: '/SP/start',
        reports_pathname: '/SP/reports',
        consent_pathname: '/SP/consent',
        exp_messages_pathname: '/SP/exp_messages',
    },
    DFE: {
        main_pathname: '/DFE/main',
        settings_pathname: '/DFE/settings',
        start_pathname: '/DFE/start',
        reports_pathname: '/DFE/reports',
        consent_pathname: '/DFE/consent',
        exp_messages_pathname: '/DFE/exp_messages',
    },
    PL_PATTERN: {
        main_pathname: '/PL_PATTERN/main',
        settings_pathname: '/PL_PATTERN/settings',
        start_pathname: '/PL_PATTERN/start',
        reports_pathname: '/PL_PATTERN/reports',
        consent_pathname: '/PL_PATTERN/consent',
        exp_messages_pathname: '/PL_PATTERN/exp_messages',
    },
    MetaSampling: {
        main_pathname: '/MetaSampling/main',
        settings_pathname: '/MetaSampling/settings',
        start_pathname: '/MetaSampling/start',
        reports_pathname: '/MetaSampling/reports',
        consent_pathname: '/MetaSampling/consent',
        exp_messages_pathname: '/MetaSampling/exp_messages',
    },
    ReversibleMatrices: {
        main_pathname: '/ReversibleMatrices/main',
        settings_pathname: '/ReversibleMatrices/settings',
        start_pathname: '/ReversibleMatrices/start',
        reports_pathname: '/ReversibleMatrices/reports',
        consent_pathname: '/ReversibleMatrices/consent',
        exp_messages_pathname: '/ReversibleMatrices/exp_messages',
    },
    SignatureTimingEffect: {
        main_pathname: '/SignatureTimingEffect/main',
        settings_pathname: '/SignatureTimingEffect/settings',
        start_pathname: '/SignatureTimingEffect/start',
        reports_pathname: '/SignatureTimingEffect/reports',
        consent_pathname: '/SignatureTimingEffect/consent',
        exp_messages_pathname: '/SignatureTimingEffect/exp_messages',
    },
    CupsGame: {
        main_pathname: '/CupsGame/main',
        settings_pathname: '/CupsGame/settings',
        start_pathname: '/CupsGame/start',
        reports_pathname: '/CupsGame/reports',
        consent_pathname: '/CupsGame/consent',
        exp_messages_pathname: '/CupsGame/exp_messages',
    },
    NoCupsGame: {
        main_pathname: '/NoCupsGame/main',
        settings_pathname: '/NoCupsGame/settings',
        start_pathname: '/NoCupsGame/start',
        reports_pathname: '/NoCupsGame/reports',
        consent_pathname: '/NoCupsGame/consent',
        exp_messages_pathname: '/NoCupsGame/exp_messages',
    },
    AbstractAndDeclarationEffect: {
        main_pathname: '/AbstractAndDeclarationEffect/main',
        settings_pathname: '/AbstractAndDeclarationEffect/settings',
        start_pathname: '/AbstractAndDeclarationEffect/start',
        reports_pathname: '/AbstractAndDeclarationEffect/reports',
        consent_pathname: '/AbstractAndDeclarationEffect/consent',
        exp_messages_pathname: '/AbstractAndDeclarationEffect/exp_messages',
    },
};

export const isValidExperiment = experiment => {
    if (AllExperiments[experiment]  !== undefined)
        return true;
    return false;
}

export const getExperimentPaths = experiment => {
    return AllExperiments[experiment];
}

const ExperimentsTablesCols = {
    Trivia: {
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    TryOrGiveUp: {
        // game:
    },
    PointsGame: {
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    PointsGameSh: {
        tables: ['game', 'payment', 'summary', 'KeyTable'],
    },
    WordPuzzle: {
        tables: ['game', 'payment', 'summary', 'objects', 'ques,', 'KeyTable'],
    },
    CognitiveTask: {
        game: ['pl', 'rd', 'rt', 'pattern', 'nfc'],
    },
    CognitiveTask2: {},
    RepeatedChoice: {
    },
    SP: {
    },
    DFE: {
        game: [],
        payment: {},
        summary: {},
        KeyTable: {}
    },
    PL_PATTERN: {
    },
    MetaSampling: {
        game: [],
        payment: {},
        summary: {},
        KeyTable: {}
    },
}


