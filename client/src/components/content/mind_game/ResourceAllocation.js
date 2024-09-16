import React, { useState, useEffect } from 'react';
import { getTimeDate } from "../../../utils/app_utils";

let startTimer = 0;
let endTimer = 0;
let totalTimer = 0;
let timeForStep = 0;

const ResourceAllocation = ({ insertLine, sendDataToDB }) => {
    const [step, setStep] = useState(1);
    const [screenOrder, setScreenOrder] = useState([4, 5]); // Initial screen order
    const [userSelection2, setUserSelection2] = useState(null);
    const [userSelection3, setUserSelection3] = useState(null);
    const [userSelection4, setUserSelection4] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [timeSpent, setTimeSpent] = useState({});


    const [answers, setAnswers] = useState({});


    useEffect(() => {
        //console.log("--->  useEffect BEFORE    startTimer = "+startTimer+"   endTimer = "+endTimer+"   totalTimer = "+totalTimer)
        //startTimer = getTimeDate().now;
        //console.log("--->  useEffect AFTER    startTimer = "+startTimer+"   endTimer = "+endTimer+"   totalTimer = "+totalTimer)
        setScreenOrder(screenOrder.sort(() => Math.random() - 0.5));
    }, []);
    useEffect(() => {
        // Set the start time when the step changes
        setStartTime(getTimeDate().now);
    }, [step]);

    const handleNext = () => {
        const endTime = getTimeDate().now;
        timeForStep = endTime - startTime;
        setTimeSpent(prev => ({ ...prev, [step]: timeForStep }));
        if (![1, 2, 3, 7, 9].includes(step)) {
            insertGameLine();
        }
        setStep(step + 1);
    };

    const getQuestioType = () => {
        switch (step) {
            case 4:
            case 5:
                return "ResourceAllocation";
            case 6:
            case 8:
            case 10:
                return "Religion";
            case 11:
                return "FoodPreference";

            default:
                return "Unknown";
        }
    }
    const insertGameLine = () => {
        const db_row = {
            ResourceQuestion: step,  // total 
            QuestionType: getQuestioType(),
            Answer: answers[step],
            Keyword: getQuestioType(),
            TotalYesAnswers: "N/A",
            TotalNoAnswers: "N/A",
            TimeToAnswer: timeForStep,
        };
        insertLine(db_row);
        if (step == 11) {
            sendDataToDB(db_row)
        }
    };



    const handleChange = (e) => {
        setAnswers({
            ...answers,
            [e.target.name]: e.target.value,
        });
    };

    const handleSliderChange = (sliderValue, sliderStep) => {
        console.log("---> handleSliderChange step=" + sliderStep + " sliderValue=" + sliderValue);
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [sliderStep]: sliderValue,
        }));
    };

    const isNextDisabled = () => {
        console.log("---> isNextDisabled   step=" + step + "  userSelection2=" + userSelection2 + "   userSelection3=" + userSelection3 + "   userSelection4=" + userSelection4)

        if (step == 4 && (screenOrder[0] == 4 && userSelection2 === null))  // if slider was not selected , disable the next button.
            return true;
        else if (step == 4 && (screenOrder[0] == 5 && userSelection3 === null))
            return true;

        if (step == 5 && (screenOrder[1] == 4 && userSelection2 === null))
            return true;
        else if (step == 5 && (screenOrder[1] == 5 && userSelection3 === null))
            return true;

        if (step == 8 && userSelection4 == null)
            return true;
        if ([6, 9, 10, 11].includes(step)) {  // if no answer was selected , disable next button
            return !answers[step];
        }

        return false;
    };

    return (
        <div className="trivia-container">
            {step === 1 && <p>
                Imagine that you are a manager at a large company. Two employees named Bill and James also work at the company. Bill and James both do the same job and make the same salary each year. This year, Bill and James received the same evaluations, which were the highest in the company. The company has decided to reward Bill and James for their exceptionally good work.
                The company has a total of three concert packages to give Bill and James, each worth $500. These packages include seats, VIP passes, and free food. The packages are valid for the next few weeks, so if no one gets them, they will be wasted.
            </p>}
            {step === 2 && (
                <div>
                    <p style={{ color: 'lightgray' }}>Imagine that you are a manager at a large company. Two employees named Bill and James also work at the company. Bill and James both do the same job and make the same salary each year. This year, Bill and James received the same evaluations, which were the highest in the company. The company has decided to reward Bill and James for their exceptionally good work.
                        The company has a total of three concert packages to give Bill and James, each worth $500. These packages include seats, VIP passes, and free food. The packages are valid for the next few weeks, so if no one gets them, they will be wasted.
                    </p>
                    <p style={{ color: 'black' }}>
                        Bill and James have each been given one concert package. You have been asked to decide what to do with the third concert package.
                    </p>
                </div>
            )}
            {step === 3 && <p>
                You have decided to flip a coin. If it lands on Heads, you will give the package to Bill; if it lands on Tails, you will give the package to James.
                <br></br>
                <br></br>
                You flipped the coin and it landed on Heads, so you gave Bill the extra package. Both employees know that your decision was made by a coin flip.

            </p>}

            {step === screenOrder[0] && (
                <div>
                    <p style={{ color: 'lightgray' }}>
                        You have decided to flip a coin. If it lands on Heads, you will give the package to Bill; if it lands on Tails, you will give the package to James.
                        <br />
                        <br />
                        You flipped the coin and it landed on Heads, so you gave Bill the extra package. Both employees know that your decision was made by a coin flip.
                    </p>
                    <p style={{ color: 'black' }}>
                        To what extent do you think that James, the employee who lost the coin flip and did not get the extra package, will attribute his loss to manager?
                    </p>
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* Slider and labels */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ marginRight: '12px' }}>Not at all</span>
                            <input
                                type="range"
                                min="1"
                                max="7"
                                step="1"
                                value={userSelection2 || ''}
                                onChange={(e) => {
                                    setUserSelection2(e.target.value);
                                    handleSliderChange(e.target.value, screenOrder[0]); // Save slider value
                                }}
                                style={{
                                    width: '350px',  // Width of the slider
                                    margin: '0 5px',
                                    appearance: 'none',
                                    background: '#ddd',
                                }}
                            />
                            <span style={{ marginLeft: '10px' }}>Great extent</span>
                        </div>

                        {/* Numbers below the slider */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(7, 1fr)`, // 7 equally spaced columns
                                width: '370px',  // Same width as the slider
                                marginTop: '5px',

                            }}
                        >
                            {Array.from({ length: 7 }, (_, i) => (
                                <span key={i} style={{ paddingLeft: '0px', marginRight: '10px', fontSize: '11px', textAlign: 'left' }}>{i + 1}</span>
                            ))}
                        </div>
                    </div>



                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <b style={{ color: 'black' }}>Your selection:&nbsp; </b>
                        {userSelection2 !== null ? (
                            userSelection2
                        ) : (
                            <span style={{ color: 'red' }}>None (please select a value)</span>
                        )}
                    </p>
                </div>
            )}
            {step === screenOrder[1] && (
                <div>
                    <p style={{ color: 'lightgray' }}>
                        You have decided to flip a coin. If it lands on Heads, you will give the package to Bill; if it lands on Tails, you will give the package to James.
                        <br />
                        <br />
                        You flipped the coin and it landed on Heads, so you gave Bill the extra package. Both employees know that your decision was made by a coin flip.
                    </p>
                    <p style={{ color: 'black' }}>
                        To what extent do you think that James, the employee who lost the coin flip and did not get the extra package, will attribute his loss to chance?
                    </p>
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* Slider and labels */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ marginRight: '12px' }}>Not at all</span>
                            <input
                                type="range"
                                min="1"
                                max="7"
                                step="1"
                                value={userSelection3 || ''}
                                onChange={(e) => {
                                    setUserSelection3(e.target.value);
                                    handleSliderChange(e.target.value, screenOrder[1]); // Save slider value
                                }}
                                style={{
                                    width: '350px',  // Width of the slider
                                    margin: '0 5px',
                                    appearance: 'none',
                                    background: '#ddd',
                                }}
                            />
                            <span style={{ marginLeft: '10px' }}>Great extent</span>
                        </div>

                        {/* Numbers below the slider */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(7, 1fr)`, // 7 equally spaced columns
                                width: '370px',  // Same width as the slider
                                marginTop: '5px',

                            }}
                        >
                            {Array.from({ length: 7 }, (_, i) => (
                                <span key={i} style={{ paddingLeft: '0px', marginRight: '10px', fontSize: '11px', textAlign: 'left' }}>{i + 1}</span>
                            ))}
                        </div>
                    </div>



                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <b style={{ color: 'black' }}>Your selection:&nbsp; </b>
                        {userSelection3 !== null ? (
                            userSelection3
                        ) : (
                            <span style={{ color: 'red' }}>None (please select a value)</span>
                        )}
                    </p>
                </div>
            )}

            {step === 6 && (
                <div>
                    <p>According to the scenario, what type of resource was the manager asked to decide upon? </p>
                    <div onChange={handleChange}>
                        <label><input type="radio" name="6" value="1" /> A new computer </label><br />
                        <label><input type="radio" name="6" value="2" /> A parking spot</label><br />
                        <label><input type="radio" name="6" value="3" /> A concert package</label><br />
                        <label><input type="radio" name="6" value="4" /> A large office</label><br />
                        <label><input type="radio" name="6" value="5" /> The scenario did not specify</label><br />
                    </div>
                </div>
            )}

            {step === 7 && (
                <div>
                    <p>You are almost done!
                        <br></br>
                        We have 4 last questions regarding your self-assessment and food preferences.
                        Please answer the questions according to your true assessment and actual preferences.
                    </p>

                </div>
            )}

            {step === 8 && (
                <div>
                    <p style={{ color: 'black' }}>
                        Regardless of whether you belong to a particular religion, how religious would you say you are?
                    </p>
                    <br></br>
                    <br></br>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* Slider and labels */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ marginRight: '12px' }}>Not at all</span>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={userSelection4 || ''}
                                onChange={(e) => {
                                    setUserSelection4(e.target.value);
                                    handleSliderChange(e.target.value, 8); // Save slider value
                                }}
                                style={{
                                    width: '350px',  // Width of the slider
                                    margin: '0 5px',
                                    appearance: 'none',
                                    background: '#ddd',
                                }}
                            />
                            <span style={{ marginLeft: '10px' }}>Great extent</span>
                        </div>

                        {/* Numbers below the slider */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(10, 1fr)`, // 7 equally spaced columns
                                width: '370px',  // Same width as the slider
                                marginTop: '5px',

                            }}
                        >
                            {Array.from({ length: 10 }, (_, i) => (
                                <span key={i} style={{ paddingLeft: '0px', marginRight: '10px', fontSize: '11px', textAlign: 'left' }}>{i + 1}</span>
                            ))}
                        </div>
                    </div>



                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <b style={{ color: 'black' }}>Your selection:&nbsp; </b>
                        {userSelection4 !== null ? (
                            userSelection4
                        ) : (
                            <span style={{ color: 'red' }}>None (please select a value)</span>
                        )}
                    </p>
                </div>
            )}
            {step === 9 && (
                <div>
                    <p>Apart from special occasions such as weddings and funerals, about how often do you attend religious services nowadays?</p>
                    <div onChange={handleChange}>
                        <label><input type="radio" name="9" value="1" /> Every day</label><br />
                        <label><input type="radio" name="9" value="2" /> More than once a week</label><br />
                        <label><input type="radio" name="9" value="3" /> Once a week</label><br />
                        <label><input type="radio" name="9" value="4" /> At least once a month</label><br />
                        <label><input type="radio" name="9" value="5" /> Only on special holy days</label><br />
                        <label><input type="radio" name="9" value="6" /> Less often</label><br />
                        <label><input type="radio" name="9" value="7" /> Never</label>
                    </div>
                </div>
            )}
            {step === 10 && (
                <div>
                    <p>Apart from when you are at religious services, how often, if at all, do you pray?</p>
                    <div onChange={handleChange}>
                        <label><input type="radio" name="10" value="1" /> Every day</label><br />
                        <label><input type="radio" name="10" value="2" /> More than once a week</label><br />
                        <label><input type="radio" name="10" value="3" /> Once a week</label><br />
                        <label><input type="radio" name="10" value="4" /> At least once a month</label><br />
                        <label><input type="radio" name="10" value="5" /> Only on special holy days</label><br />
                        <label><input type="radio" name="10" value="6" /> Less often</label><br />
                        <label><input type="radio" name="10" value="7" /> Never</label>
                    </div>
                </div>
            )}
            {step === 11 && (
                <div>
                    <p>Which of the following options best describes your dietary preferences?</p>
                    <div onChange={handleChange}>
                        <label><input type="radio" name="11" value="1" /> Omnivorous (can eat everything)</label><br />
                        <label><input type="radio" name="11" value="2" /> Vegetarian (do not eat meat or seafood)</label><br />
                        <label><input type="radio" name="11" value="3" /> Pescatarian (eat seafood but not meat)</label><br />
                        <label><input type="radio" name="11" value="4" /> Flexitarian (mostly vegetarian but occasionally eat meat or seafood)</label><br />
                        <label><input type="radio" name="11" value="5" /> Vegan (do not eat meat, seafood, or any animal product)</label><br />
                        <label><input type="radio" name="11" value="6" /> Mostly vegan (do not eat meat or seafood, but occasionally eat eggs or milk).</label>
                    </div>
                </div>
            )}

            <button onClick={handleNext} disabled={isNextDisabled()}> {step < 11 ? "Next" : "Submit"}</button>
        </div>
    );
};

export default ResourceAllocation;
