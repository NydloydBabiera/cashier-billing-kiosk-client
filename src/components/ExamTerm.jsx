import React from 'react'

const ExamTerm = () => {
    const terms = ['PRE-MIDTER', 'MIDTERM', 'PRE-FINAL', 'FINAL']
    return (
        <div className="container mx-auto p-4">
            {terms.map((t) => {
                <button>{t}</button>
            })}
        </div>
    )
}

export default ExamTerm