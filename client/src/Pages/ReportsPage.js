import {useState, useEffect} from "react";
import API from "../utils/API";

function ReportsPage(props) {
    const [AllReports, setAllReports] = useState([])

    useEffect(() => {
        getAllReports()
    }, [])

    async function getAllReports() {
        try {
            const result = await API.get('/Questions/Get/Reports/All')
            console.log(result.data)
            setAllReports(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function ResolveReport(ReportID) {
        try {
            await API.post('/Questions/Reports/Resolve/' + ReportID)

            //Remove the Resolved Report from the currently displayed Reports
            setAllReports(current => 
                current.filter(Report => Report.reportid !== ReportID)
            )
        } catch(err) {
            console.log(err)
        }
    }
    return (
        <div>
            {AllReports.map(Report =>
                <div key={Report.reportid}>
                    Reporter: {Report.firstname + ' ' + Report.lastname} <br />
                    Report Details: {Report.reporttext} <br />
                    <button onClick={() => props.OpenQuestion(Report.questionid)}>Open Question</button> <br />
                    <button onClick={() => ResolveReport(Report.reportid)}>Resolve Report</button>
                    <br /> <br />
                </div>
            )}
        </div>
    )
}

export default ReportsPage;