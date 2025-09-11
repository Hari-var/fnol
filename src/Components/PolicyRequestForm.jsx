import React, {useState, useEffect} from 'react';


export default function PolicyRequestForm() {
    
    return(
        <div className='request-form-container'>
            <form>
                <label>Policy Type:</label>
                <select>
                    <option value="auto">Auto</option>
                    <option value="home">Home</option>
                    <option value="health">Health</option>
                </select>
                
            </form>
        </div>
    )
}
