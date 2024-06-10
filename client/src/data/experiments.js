const EXPERIMENTS_LABELS_NAMES = {
    TwoMatricesExperiment: 'TryOrGiveUp',
    Trivia: 'Trivia',
    PointsGame: 'PointsGame',
    PointsGameSh: 'PointsGameSh',
    WordPuzzle: 'WordPuzzle',
    AbstractAndDeclarationEffect: 'AbstractAndDeclarationEffect',
    SignatureAsReminder: 'SignatureAsReminder',
    CognitiveTask: 'CognitiveTask',
    CognitiveTask2: 'CognitiveTask2',
    RepeatedChoice: 'RepeatedChoice',
    QueenGarden: 'QueenGarden',
    GameOfMatrices: 'ReversibleMatrices',
    TheCardsGame: 'SP',
    DFE: 'DFE',
    PL_PATTERN: 'PL_PATTERN',
    ChoiceChallenge: 'MetaSampling',
    SubjectiveStory: 'SignatureTimingEffect',
    CupsGame: 'CupsGame',
    NoCupsGame: 'NoCupsGame',
};

const EXPERIMENTS_NAMES_LABELS = {
    Trivia: 'Trivia',
    TryOrGiveUp: 'TwoMatricesExperiment',
    PointsGame: 'PointsGame',
    PointsGameSh: 'PointsGameSh',
    WordPuzzle: 'WordPuzzle',
    CognitiveTask: 'CognitiveTask',
    CognitiveTask2: 'CognitiveTask2',
    AbstractAndDeclarationEffect: 'AbstractAndDeclarationEffect',
    SignatureAsReminder: 'SignatureAsReminder',
    RepeatedChoice: 'RepeatedChoice',
    QueenGarden: 'QueenGarden',
    SP: 'TheCardsGame',
    DFE: 'DFE',
    PL_PATTERN: 'PL_PATTERN',
    MetaSampling: 'ChoiceChallenge',
    ReversibleMatrices: 'GameOfMatrices',
    SignatureTimingEffect: 'SubjectiveStory',
    CupsGame: 'CupsGame',
    NoCupsGame: 'NoCupsGame',
};

export const GetExperimentName = label => {
    return EXPERIMENTS_LABELS_NAMES[label];
}

export const GetExperimentLabel = exp => {
    return EXPERIMENTS_NAMES_LABELS[exp];
}

const exp_paths = (exp) => {
//console.log("---> exp = "+exp+"   GetExperimentLabel(exp)="+GetExperimentLabel(exp))
    return  {
        main_pathname: '/' + exp + '/main',
        start_pathname: '/' + GetExperimentLabel(exp),
        settings_pathname: '/settings',
        reports_pathname: '/reports',
        consent_editor_pathname: '/consent_form_editor/',
        exp_messages_pathname: '/exp_messages',
        exp_details_pathname: '/exp_details',
        chat_pathname: '/chat',
        todo_pathname: '/todo',
        changes_pathname: '/changes',
        logs_pathname: '/logs',
    }
}

const pathsLabels = {
    main_pathname: 'Main',
    settings_pathname: 'Settings',
    start_pathname: 'Start',
    reports_pathname: 'Reports',
    consent_editor_pathname: 'Consent form editor',
    exp_messages_pathname: 'Experiment messages',
    account_pathname: 'Account',
    exp_details_pathname: 'Experiment details',
    chat_pathname: 'Chat',
    todo_pathname: 'Todo',
    changes_pathname: 'Changes',
    logs_pathname: 'Logs',
};

export const getPathLabel = (pathname) => {
    return pathsLabels[pathname] || pathname;
}

export const getPathLocation = (exp, pathname) => {
    return exp_paths(exp)[pathname];
}

export const getExperimentPaths = experiment => {
    return exp_paths(experiment);
}


