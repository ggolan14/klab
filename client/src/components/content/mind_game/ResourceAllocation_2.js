import React, { useState } from 'react';


const ResourceAllocation_2 = () => {

    const [showExtra, setShowExtra] = useState(false);
    const [showyouHaveDecided, setShowyouHaveDecided] = useState(false);

    function handleNext(){
        if(!showExtra){
            setShowExtra(true)
        }
        else{

        }
    }
    function handleNext(){
        if(!showExtra){
            setShowExtra(true)
        }
        else{
            setShowyouHaveDecided(true)
        }
    }
    return (
        <div className="trivia-container" >
         <span style={{ color: showExtra ? 'lightgray' : 'black' }}>
         ResourceAllocation_2
        </span>
    {showExtra ? (
        <><span style={{ color: 'black', display: 'block', marginTop: '1em' }}>
                    Bill and James have each been given one concert package. You have been asked to decide what to do with the third concert package.
                </span>
                <br></br>
                <button onClick={handleNext}> Next</button></>
        
    ) : null}
        <button onClick={handleNext}> Next</button>
    </div>
          ) 
  
};
export default ResourceAllocation_2;