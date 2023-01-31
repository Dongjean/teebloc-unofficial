import {useState, useEffect} from 'react';

//component imports
import Question from './Question.js';

function ChurnedQuestions(props) {
    const [Page, setPage] = useState(props.Selection.initialPage)

    const [isLoading, setisLoading] = useState(true)
    
    const [Churned, setChurned] = useState()

    function UpdatePage(NewPage) {
        props.navigator(
            '?Subject=' + props.Selection.Subject + '&' +
            'Topics=' + JSON.stringify(props.Selection.Topics) + '&' +
            'Levels=' + JSON.stringify(props.Selection.Levels) + '&' +
            'Papers=' + JSON.stringify(props.Selection.Papers) + '&' +
            'Assessments=' + JSON.stringify(props.Selection.Assessments) + '&' +
            'Schools=' + JSON.stringify(props.Selection.Schools) + '&' +
            'QNsperPage=' + props.Selection.QNsperPage + '&' +
            'isChurned=' + props.Selection.isChurned + '&' +
            'Page=' + NewPage
        )
    }

    useEffect(() => {
        if (props.Churned) {
            if (!props.Selection.initialPage || props.Selection.initialPage == 'null') {
                setPage(1)
                UpdatePage(1)
            } else {
                setPage(parseInt(props.Selection.initialPage))
            }
            setisLoading(false)
            setChurned(props.Churned)
        }
    }, [props.Churned])

    return (
        <div>
            {props.Selection.isChurned ?
                isLoading ?
                    null
                :
                    <div>
                        {Churned.Questions.slice(props.Selection.QNsperPage * (Page-1), props.Selection.QNsperPage * (Page-1) + props.Selection.QNsperPage).map(question =>
                            <div key={question.questionid}>
                                <button onClick={() => props.OpenQuestion(question.questionid)}>
                                    <Question Question={question} FirstQuestionIMG={Churned.QuestionImages.filter(QuestionImage => QuestionImage.QuestionID == question.questionid)[0]} LoginData={props.LoginData} />
                                    <br />
                                </button>
                                <br />
                            </div>
                        )}

                        {/* Page Buttons */}
                        <button onClick={() => {setPage(Page - 1); UpdatePage(Page -1)}}>Previous Page</button>
                        <button onClick={() => {setPage(Page + 1); UpdatePage(Page + 1)}}>Next Page</button>
                    </div>
            :
                console.log(props.Selection.isChurned)
            }
        </div>
    )
}

export default ChurnedQuestions;