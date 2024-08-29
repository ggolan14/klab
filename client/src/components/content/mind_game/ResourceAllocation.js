import React, { useState, useEffect } from 'react';

const ResourceAllocation = ({ insertLine,sendDataToDB }) => {
    const [step, setStep] = useState(1);
    const [screenOrder, setScreenOrder] = useState([4, 5]); // Initial screen order
    const [userSelection2, setUserSelection2] = useState(4);
    const [userSelection3, setUserSelection3] = useState(4);
    const [userSelection4, setUserSelection4] = useState(4);
    const [answers, setAnswers] = useState({
        question6: "",
        question7: "",
        question8: "",
        question9: "",
    });
  
    
    useEffect(() => {
        setScreenOrder(screenOrder.sort(() => Math.random() - 0.5));
    }, []);

    const handleNext = () => {
        console.log("-----> step="+step)
        insertGameLine();
        setStep(step + 1);
      };

    const insertGameLine = () => {
       
        const db_row = {
            Step: step,  // total 
            QuestionType:"ResourceAllocation",
            Answer: answers[step],
            TotalYesAnswers: "N/A",
            TotalNoAnswers: "N/A",
            Slider2: userSelection2,
            Slider3: userSelection3,
            Slider4: userSelection4,
            HaveAnAnswerTime:"N/A",
            ConfirmationTime:"N/A",
          };
          insertLine(db_row);
          if(step==10){
            sendDataToDB(db_row)
          }
      };

    const handleChange = (e) => {
        setAnswers({
            ...answers,
            [e.target.name]: e.target.value,
        });
    };

    const isNextDisabled = () => {
        console.log("---> isNextDisabled    step="+step)
        if ([6, 8, 9, 10].includes(step)) {
            return !answers[`question${step}`];
        }
        return false;
    };
console.log("---> "+answers.size)
    return (
        <div  className="trivia-container">
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
                You flipped the coin and it landed on Heads, so you gave Bill the extra package. Both employees know that your decision was made by a coin flip.

                </p>}
            {step === screenOrder[0] && (
                <div>
                    <p style={{ color: 'lightgray' }}>
                    You have decided to flip a coin. If it lands on Heads, you will give the package to Bill; if it lands on Tails, you will give the package to James.
                    You flipped the coin and it landed on Heads, so you gave Bill the extra package. Both employees know that your decision was made by a coin flip.
                    </p>
                    <p style={{ color: 'black' }}>To what extent do you think that James, the employee who lost the coin flip and did not get the extra package, will attribute his loss to you, the manager? 
                    </p>
                    <div>
                        <input
                            type="range"
                            min="1"
                            max="7"
                            value={userSelection2}
                            onChange={(e) => setUserSelection2(e.target.value)}
                        />
                        <p>Your selection: {userSelection2}</p>
                    </div>
                </div>
            )}
            {step === screenOrder[1] && (
                <div>
                    <p style={{ color: 'lightgray' }}>
                    You have decided to flip a coin. If it lands on Heads, you will give the package to Bill; if it lands on Tails, you will give the package to James.
                    You flipped the coin and it landed on Heads, so you gave Bill the extra package. Both employees know that your decision was made by a coin flip.
                    </p>
                    <p style={{ color: 'black' }}>To what extent do you think that James, the employee who lost the coin flip and did not get the extra package, will attribute his loss to chance? 
                    </p>
                    <div>
                        <input
                            type="range"
                            min="1"
                            max="7"
                            value={userSelection3}
                            onChange={(e) => setUserSelection3(e.target.value)}
                        />
                        <p>Your selection: {userSelection3}</p>
                    </div>
                </div>
            )}
            {step === 6 && (
                <div>
                    <p>According to the scenario, what type of resource was the manager asked to decide upon? </p>
                    <div onChange={handleChange}>
                        <label><input type="radio" name="question6" value="Option 1" /> A new computer </label><br />
                        <label><input type="radio" name="question6" value="Option 2" /> A parking spot</label><br />
                        <label><input type="radio" name="question6" value="Option 3" /> A concert package</label><br />
                        <label><input type="radio" name="question6" value="Option 4" /> A large office</label><br />
                        <label><input type="radio" name="question6" value="Option 5" /> The scenario did not specify</label><br />
                    </div>
                </div>
            )}

            {step === 7 && (
                <div>
                    <p>You are almost done! 
                        We have 4 last questions regarding your self-assessment and food preferences. 
                        Please answer the questions according to your true assessment and actual preferences.
                    </p>
                    <div>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={userSelection4}
                            onChange={(e) => setUserSelection4(e.target.value)}
                        />
                        <p>Your selection: {userSelection4}</p>
                    </div>
                </div>
            )}

            {step === 8 && (
                <div>
                    <p>Apart from special occasions such as weddings and funerals, about how often do you attend religious services nowadays?</p>
                    <div onChange={handleChange}>
                        <label><input type="radio" name="question8" value="Every day" /> Every day</label><br />
                        <label><input type="radio" name="question8" value="More than once a week" /> More than once a week</label><br />
                        <label><input type="radio" name="question8" value="Once a week" /> Once a week</label><br />
                        <label><input type="radio" name="question8" value="At least once a month" /> At least once a month</label><br />
                        <label><input type="radio" name="question8" value="Only on special holy days" /> Only on special holy days</label><br />
                        <label><input type="radio" name="question8" value="Less often" /> Less often</label><br />
                        <label><input type="radio" name="question8" value="Never" /> Never</label>
                    </div>
                </div>
            )}
            {step === 9 && (
                <div>
                    <p>Apart from when you are at religious services, how often, if at all, do you pray?</p>
                    <div onChange={handleChange}>
                    <label><input type="radio" name="question7" value="Every day" /> Every day</label><br />
                        <label><input type="radio" name="question9" value="More than once a week" /> More than once a week</label><br />
                        <label><input type="radio" name="question9" value="Once a week" /> Once a week</label><br />
                        <label><input type="radio" name="question9" value="At least once a month" /> At least once a month</label><br />
                        <label><input type="radio" name="question9" value="Only on special holy days" /> Only on special holy days</label><br />
                        <label><input type="radio" name="question9" value="Less often" /> Less often</label><br />
                        <label><input type="radio" name="question9" value="Never" /> Never</label>
                    </div>
                </div>
            )}
            {step === 10 && (
                <div>
                    <p>Which of the following options best describes your dietary preferences?</p>
                    <div onChange={handleChange}>
                        <label><input type="radio" name="question10" value="Omnivorous" /> Omnivorous (can eat everything)</label><br />
                        <label><input type="radio" name="question10" value="Vegetarian" /> Vegetarian (do not eat meat or seafood)</label><br />
                        <label><input type="radio" name="question10" value="Pescatarian" /> Pescatarian (eat seafood but not meat)</label><br />
                        <label><input type="radio" name="question10" value="Flexitarian" /> Flexitarian (mostly vegetarian but occasionally eat meat or seafood)</label><br />
                        <label><input type="radio" name="question10" value="Vegan" /> Vegan (do not eat meat, seafood, or any animal product)</label><br />
                        <label><input type="radio" name="question10" value="Mostly vegan" /> Mostly vegan (do not eat meat or seafood, but occasionally eat eggs or milk).</label>
                    </div>
                </div>
            )}

            <button onClick={handleNext} disabled={isNextDisabled()}> {step < 10 ? "Next" : "Submit"}</button>
        </div>
    );
};

export default ResourceAllocation;
