import React, { useState, useEffect } from 'react';
import { getTimeDate } from "../../../utils/app_utils";

let startTimer = 0;
let endTimer = 0;
let totalTimer = 0;
let timeForStep = 0;

const ResourceAllocation = ({ insertLine, sendDataToDB }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [coinLikelihood, setCoinLikelihood] = useState(null); // No default value
    const [managerLikelihood, setManagerLikelihood] = useState(null); // No default value
    const [explanation, setExplanation] = useState(''); // State to hold the user's explanation
    const [answers, setAnswers] = useState({});
    const [userSelection7, setUserSelection7] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [timeSpent, setTimeSpent] = useState({});
    const [userSelection4_1, setUserSelection4_1] = useState(null);
    const [userSelection4_2, setUserSelection4_2] = useState(null);
    const [nonRobotAnswer, setNonRobotAnswer] = useState(''); // User's written answer for step 12


    const keyValueData = {
        3: 'N/A',
        '4_1': 'How likely is it, in your opinion, that your outcome was determined by a coin?',
        '4_2': 'How likely is it, in your opinion, that your outcome was determined by the manager decision?',
        5: 'Please explain why you think so:',
        6: 'According to the scenario, what type of resource was the manager asked to decide upon?',
        7: 'N/A',
        8: 'Regardless of whether you belong to a particular religion, how religious would you say you are?',
        9: 'Apart from special occasions such as weddings and funerals, about how often do you attend religious services nowadays?',
        10: 'Apart from when you are at religious services, how often, if at all, do you pray?',
        11: 'Which of the following options best describes your dietary preferences?',
        12: 'What is your favorite breakfast food?',
      };

    useEffect(() => {
        // Set the start time when the step changes
        setStartTime(getTimeDate().now);

        // Reset selection when entering any step that uses radio buttons
        if ([9, 10, 11,12].includes(currentStep)) {
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [currentStep]: null  // Reset the answer for the current step
            }));
        }

    }, [currentStep]);

    // Function to handle "Next" button click
    const handleNext = () => {
        const endTime = getTimeDate().now;
        timeForStep = endTime - startTime;
        setTimeSpent(prev => ({ ...prev, [currentStep]: timeForStep }));

        if (![1, 2, 3, 7].includes(currentStep)) {
            insertGameLine();
        }

        setCurrentStep(prevStep => prevStep + 1);
    };

    const getQuestioType = () => {
        switch (currentStep) {
            case 4:
            case 5:
                return "ResourceAllocation";
            case 6:
            case 8:
            case 9:
            case 10:
                return "Religion";
            case 11:
                return "FoodPreference";
            case 12:
                return "NonRobotVerification";
            default:
                return "Unknown";
        }
    };

    const insertGameLine = () => {
        let finalAnswer ;
        if(currentStep === 4){
            finalAnswer=answers["4_1"]
        }else if(currentStep === 5){
            finalAnswer = explanation;
        }else if(currentStep === 12){
            finalAnswer = nonRobotAnswer;
        }else{
            finalAnswer = answers[currentStep];
        }
       
        console.log("@@@@ currentStep=" + currentStep + "   Answer=" + answers[currentStep]);
        const db_row = {
            ResourceQuestion: currentStep === 4 ? "4_A" : currentStep,
            QuestionType: getQuestioType(),
            Answer: finalAnswer,
            TotalYesAnswers: "N/A",
            TotalNoAnswers: "N/A",
            TimeToAnswer: timeForStep,
            Question: keyValueData[currentStep === 4 ? "4_1" : currentStep],
        };
        insertLine(db_row);
        if(currentStep ==4){
            finalAnswer = answers["4_2"] 
        const db_row2 = {
            ResourceQuestion: "4_B",  // total 
            QuestionType: getQuestioType(),
            Answer: finalAnswer,
            TotalYesAnswers: "N/A",
            TotalNoAnswers: "N/A",
            TimeToAnswer: timeForStep,
            Question: keyValueData[currentStep === 4 ? "4_2":currentStep]
            //  Comment: currentStep === 5 ? explanation : "N/A"
        };
        insertLine(db_row2);
    }
        // Send all data to the database upon completion (step 12)
        if (currentStep === 12) {
            sendDataToDB(db_row);
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
        console.log("---> isNextDisabled   step=" + currentStep);
        if (currentStep === 4) {
            return !(userSelection4_1 != null && userSelection4_2 != null);
        }
        if (currentStep === 5) {
            return !explanation;
        }

        if (currentStep === 8) {
            return userSelection7 == null;
        }
        if (currentStep === 12) {
            return nonRobotAnswer == null;
        }
        // Steps 6, 9, 10,11 and 12 require a radio button to be selected
        if ([6, 9, 10, 11].includes(currentStep)) {  // if no answer was selected , disable next button
            return !answers[currentStep];
        }
        return false;
    };

    // Content for each step
    const renderStepContent = () => {
        console.log("----> currentStep=" + currentStep + "    answers[" + currentStep + "]=" + answers[currentStep] + "    answers[" + (currentStep - 1) + "]=" + answers[currentStep - 1]);
        // console.log("----> currentStep="+currentStep +"    answers["+currentStep+"]="+answers[currentStep]+ "    answers["+(currentStep-1)+"]="+answers[currentStep-1])
        if (currentStep === 1) {
            return (
                <>
                    <p>Imagine that you and another employee named Bill are working at a large company. Bill and you both do the same job and make the same salary each year. This year, Bill and you received the same evaluations, which were the highest in the company. The company has decided to reward Bill and you for your exceptionally good work.</p>
                    <p>The company has a total of four concert packages to give Bill and you, each worth $500. These packages include seats, VIP passes, and free food. The packages are valid for the next few weeks, so if no one gets them, they will be wasted.</p>
                </>
            );
        }

        if (currentStep === 2) {
            return (
                <>
                    <p style={{ color: 'lightgray' }}>Imagine that you and another employee named Bill are working at a large company. Bill and you both do the same job and make the same salary each year. This year, Bill and you received the same evaluations, which were the highest in the company. The company has decided to reward Bill and you for your exceptionally good work.</p>
                    <p style={{ color: 'lightgray' }}>The company has a total of four concert packages to give Bill and you, each worth $500. These packages include seats, VIP passes, and free food. The packages are valid for the next few weeks, so if no one gets them, they will be wasted.</p>

                    <p>Bill and you have each been given two concert packages. However, the company then learned that it must tighten its budget and must revoke at least one package. The manager now needs to decide how to revoke the packages.</p>
                    <p>The manager considers the following options:</p>
                    <ol>
                        <li>Revoke a package from both Bill and you.</li>
                        <li>Flip a coin. If it lands on Heads, the manager would revoke a package from Bill; if it lands on Tails, the manager would revoke a package from you.</li>
                    </ol>
                </>
            );
        }

        if (currentStep === 3) {
            return (
                <>
                    <p style={{ color: 'lightgray' }}>Imagine that you and another employee named Bill are working at a large company. Bill and you both do the same job and make the same salary each year. This year, Bill and you received the same evaluations, which were the highest in the company. The company has decided to reward Bill and you for your exceptionally good work.</p>
                    <p style={{ color: 'lightgray' }}>The company has a total of four concert packages to give Bill and you, each worth $500. These packages include seats, VIP passes, and free food. The packages are valid for the next few weeks, so if no one gets them, they will be wasted.</p>
                    <p style={{ color: 'lightgray' }}>Bill and you have each been given two concert packages. However, the company then learned that it must tighten its budget and must revoke at least one package. The manager now needs to decide how to revoke the packages.</p>
                    <p style={{ color: 'lightgray' }}>The manager considers the following options:</p>
                    <ol style={{ color: 'lightgray' }}>
                        <li>Revoke a package from both Bill and you.</li>
                        <li>Flip a coin. If it lands on Heads, the manager would revoke a package from Bill; if it lands on Tails, the manager would revoke a package from you.</li>
                    </ol>

                    <p>You recently found out that you had one package revoked.</p>
                    <p>You wonder how the manager reached the decision to revoke your package.</p>
                </>
            );
        }

        if (currentStep === 4) {
            return (
                <>
                    <p style={{ color: 'lightgray' }}>Imagine that you and another employee named Bill are working at a large company. Bill and you both do the same job and make the same salary each year. This year, Bill and you received the same evaluations, which were the highest in the company. The company has decided to reward Bill and you for your exceptionally good work.</p>
                    <p style={{ color: 'lightgray' }}>The company has a total of four concert packages to give Bill and you, each worth $500. These packages include seats, VIP passes, and free food. The packages are valid for the next few weeks, so if no one gets them, they will be wasted.</p>
                    <p style={{ color: 'lightgray' }}>Bill and you have each been given two concert packages. However, the company then learned that it must tighten its budget and must revoke at least one package. The manager now needs to decide how to revoke the packages.</p>
                    <p style={{ color: 'lightgray' }}>The manager considers the following options:</p>
                    <ol style={{ color: 'lightgray' }}>
                        <li>Revoke a package from both Bill and you.</li>
                        <li>Flip a coin. If it lands on Heads, the manager would revoke a package from Bill; if it lands on Tails, the manager would revoke a package from you.</li>
                    </ol>
                    <p style={{ color: 'lightgray' }}>You recently found out that you had one package revoked.  You recently found out that you had one package revoked. You wonder how the manager reached the decision to revoke your package</p>
                    <br></br>
                    <br></br>
                    <p style={{ color: 'black' }}>{keyValueData["4_1"]}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
                    <span style={{ marginRight: '12px' }}>Not at all</span>
                    <input
                        type="range"
                        min="1"
                        max="7"
                        step="1"
                        value={userSelection4_1 || ''}
                        onChange={(e) => {
                            setUserSelection4_1(e.target.value);
                            handleSliderChange(e.target.value, "4_1"); // Save slider value
                        }}
                        style={{
                            width: '355px',  // Width of the slider
                            margin: '0 5px',
                            appearance: 'none',
                            background: '#ddd',
                        }}
                    />
                    <span style={{ marginLeft: '10px' }}>Very likely</span>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(7, 1fr)`, // 7 equally spaced columns
                            width: '390px',  // Same width as the slider
                            marginTop: '5px',
                            marginLeft: '97px', // Adjust to align the numbers under the slider correctly

                        }}
                    >
                        {Array.from({ length: 7 }, (_, i) => (
                            <span key={i} style={{fontSize: '18px', color:'green',  textAlign: 'center', }}> {i + 1}</span>
                        ))}
                    </div>
                    <p style={{ display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
                        <br></br>
                        <b style={{ color: 'black' }}>Your selection:&nbsp; </b>
                        {userSelection4_1 !== null ? (
                            userSelection4_1
                        ) : (
                            <span style={{ color: 'red' }}>None (please select a value)</span>
                        )}
                    </p>
					<br></br>
                    <br></br>
					<p style={{ color: 'black' }}>{keyValueData["4_2"]} 
                    </p>
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
                    <span style={{ marginRight: '12px' }}>Not at all</span>
                    <input
                        type="range"
                        min="1"
                        max="7"
                        step="1"
                        value={userSelection4_2 || ''}
                        onChange={(e) => {
                            setUserSelection4_2(e.target.value);
                            handleSliderChange(e.target.value, "4_2"); // Save slider value
                        }}
                        style={{
                            width: '355px',  // Width of the slider
                            margin: '0 5px',
                            appearance: 'none',
                            background: '#ddd',
                        }}
                    />
                    <span style={{ marginLeft: '10px' }}>Very likely</span>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(7, 1fr)`, // 7 equally spaced columns
                            width: '390px',  // Same width as the slider
                            marginTop: '5px',
                            marginLeft: '97px', // Adjust to align the numbers under the slider correctly

                        }}
                    >
                        {Array.from({ length: 7 }, (_, i) => (
                            <span key={i} style={{fontSize: '18px',textAlign: 'center', }}> {i + 1}</span>
                        ))}
                    </div>
                    <p style={{ display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
                        <b style={{ color: 'black' }}>Your selection:&nbsp; </b>
                        {userSelection4_2 !== null ? (
                            userSelection4_2
                        ) : (
                            <span style={{ color: 'red' }}>None (please select a value)</span>
                        )}
                    </p>

                </>

            );
        }

        if (currentStep === 5) {
            return (
                <>
                    <p>{keyValueData[5]}</p>
                    <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        style={{
                            width: '50%',
                            height: '100px',
                            border: '2px solid lightgray', // Change the border thickness, style, and color here
                            borderRadius: '4px', // Optional: Add rounded corners
                            padding: '10px', // Optional: Add padding for better text placement
                        }}
                        placeholder="Enter your explanation here"
                    />
                    <br></br>
                    <br></br>
                </>
            );
        }
        if (currentStep === 6) {
            return (
                <div>
                    <p>{keyValueData[6]} </p>
                    <div onChange={handleChange}>
                        <label><input type="radio" name="6" value="1" /> A new computer </label><br />
                        <label><input type="radio" name="6" value="2" /> A parking spot</label><br />
                        <label><input type="radio" name="6" value="3" /> A concert package</label><br />
                        <label><input type="radio" name="6" value="4" /> A large office</label><br />
                        <label><input type="radio" name="6" value="5" /> The scenario did not specify</label><br />
                    </div>
                </div>
            );
        }
        if (currentStep === 7) {
            return (

                <div>
                    <p>You are almost done!
                        <br></br>
                        We have 4 last questions regarding your self-assessment and food preferences.
                        Please answer the questions according to your true assessment and actual preferences.
                    </p>

                </div>
            );
        }

        if (currentStep === 8) {
            return (
                <div>
                    <p style={{ color: 'black' }}>{keyValueData[8]}</p>
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
                    <span style={{ marginRight: '12px' }}>Not at all</span>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={userSelection7 || ''}
                        onChange={(e) => {
                            setUserSelection7(e.target.value);
                            handleSliderChange(e.target.value, currentStep); // Save slider value
                        }}
                        style={{
                            width: '365px',  // Width of the slider
                            margin: '0 5px',
                            appearance: 'none',
                            background: '#ddd',
                        }}
                    />
                    <span style={{ marginLeft: '10px' }}>Very religious</span>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(10, 1fr)`, // 10 equally spaced columns
                            width: '375px',  // Same width as the slider
                            marginTop: '5px',
                            marginLeft: '110px', // Adjust to align the numbers under the slider correctly

                        }}
                    >
                        {Array.from({ length: 10 }, (_, i) => (
                            <span key={i} style={{fontSize: '18px', color:'green',textAlign: 'center', }}> {i + 1}</span>
                        ))}
                    </div>
                    <p style={{ display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
                        <b style={{ color: 'black' }}>Your selection:&nbsp; </b>
                        {userSelection7 !== null ? (
                            userSelection7
                        ) : (
                            <span style={{ color: 'red' }}>None (please select a value)</span>
                        )}
                    </p>

                </div>
            );
        }

        if (currentStep === 9) {
            return (
                <div>
                    <p>{keyValueData[9]}</p>
                    <div onChange={handleChange}>
                        <label><input type="radio" name="9" value="1" checked={answers[9] === "1"} /> Every day</label><br />
                        <label><input type="radio" name="9" value="2" checked={answers[9] === "2"} /> More than once a week</label><br />
                        <label><input type="radio" name="9" value="3" checked={answers[9] === "3"} /> Once a week</label><br />
                        <label><input type="radio" name="9" value="4" checked={answers[9] === "4"} /> At least once a month</label><br />
                        <label><input type="radio" name="9" value="5" checked={answers[9] === "5"} /> Only on special holy days</label><br />
                        <label><input type="radio" name="9" value="6" checked={answers[9] === "6"} /> Less often</label><br />
                        <label><input type="radio" name="9" value="7" checked={answers[9] === "7"} /> Never</label>
                    </div>
                </div>
            );
        }

        if (currentStep === 10) {
            return (
                <div>
                    <p>{keyValueData[10]}</p>
                    <div onChange={handleChange}>
                        <label><input type="radio" name="10" value="1" checked={answers[10] === "1"} /> Every day</label><br />
                        <label><input type="radio" name="10" value="2" checked={answers[10] === "2"} /> More than once a week</label><br />
                        <label><input type="radio" name="10" value="3" checked={answers[10] === "3"} /> Once a week</label><br />
                        <label><input type="radio" name="10" value="4" checked={answers[10] === "4"} /> At least once a month</label><br />
                        <label><input type="radio" name="10" value="5" checked={answers[10] === "5"} /> Only on special holy days</label><br />
                        <label><input type="radio" name="10" value="6" checked={answers[10] === "6"} /> Less often</label><br />
                        <label><input type="radio" name="10" value="7" checked={answers[10] === "7"} /> Never</label>
                    </div>
                </div>
            );
        }

        if (currentStep === 11) {
            return (
                <div>
                    <p>{keyValueData[11]}</p>
                    <div onChange={handleChange}>
                        <label><input type="radio" name="11" value="1" /> Omnivorous (can eat everything)</label><br />
                        <label><input type="radio" name="11" value="2" /> Vegetarian (do not eat meat or seafood)</label><br />
                        <label><input type="radio" name="11" value="3" /> Pescatarian (eat seafood but not meat)</label><br />
                        <label><input type="radio" name="11" value="4" /> Flexitarian (mostly vegetarian but occasionally eat meat or seafood)</label><br />
                        <label><input type="radio" name="11" value="5" /> Vegan (do not eat meat, seafood, or any animal product)</label><br />
                        <label><input type="radio" name="11" value="6" /> Mostly vegan (do not eat meat or seafood, but occasionally eat eggs or milk).</label>
                    </div>
                </div>
            );
        }
        if (currentStep === 12) {
            return (
                <>
                    <p>{keyValueData[12]}</p>
                    <textarea
                        value={nonRobotAnswer}
                        onChange={(e) => setNonRobotAnswer(e.target.value)}
                        style={{
                            width: '50%',
                            height: '100px',
                            border: '2px solid lightgray', // Change the border thickness, style, and color here
                            borderRadius: '4px', // Optional: Add rounded corners
                            padding: '10px', // Optional: Add padding for better text placement
                        }}
                        placeholder="Enter your answer here"
                    />
                    <br></br>
                    <br></br>
                </>
            );
        }

        return null;
    };

    return (
<div style={{ margin: '150px' }}>
    <div style={{ fontSize: '25px' }}> {/* Adjust font size here */}
        {renderStepContent()}
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
            onClick={handleNext}
            disabled={isNextDisabled()}
            style={{ padding: '12px 25px', fontSize: '25px', }} // Button size remains the same
        >
            {currentStep < 12 ? "Next" : "Submit"}
        </button>
    </div>
</div>
    );
};

export default ResourceAllocation;
