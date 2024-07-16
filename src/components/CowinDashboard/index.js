// // Write your code here
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts'

// const data = [
//   {
//     group_name: 'Group A',
//     boys: 200,
//     girls: 400,
//   },
//   {
//     group_name: 'Group B',
//     boys: 3000,
//     girls: 500,
//   },
//   {
//     group_name: 'Group C',
//     boys: 1000,
//     girls: 1500,
//   },
//   {
//     group_name: 'Group D',
//     boys: 700,
//     girls: 1200,
//   },
// ]

// const App = () => {
//   const DataFormatter = number => {
//     if (number > 1000) {
//       return `${(number / 1000).toString()}k`
//     }
//     return number.toString()
//   }

//   return (
//     <ResponsiveContainer width="100%" height={500}>
//       <BarChart
//         data={data}
//         margin={{
//           top: 5,
//         }}
//       >
//         <XAxis
//           dataKey="group_name"
//           tick={{
//             stroke: 'grey',
//             strokeWidth: 1,
//           }}
//         />
//         <YAxis
//           tickFormatter={DataFormatter}
//           tick={{
//             stroke: 'gray',
//             strokeWidth: 0,
//           }}
//         />
//         <Legend
//           wrapperStyle={{
//             padding: 30,
//           }}
//         />
//         <Bar dataKey="boys" name="Boys" fill="#1f77b4" barSize="20%" />
//         <Bar dataKey="girls" name="Girls" fill="#fd7f0e" barSize="20%" />
//       </BarChart>
//     </ResponsiveContainer>
//   )
// }

// export default App

import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const statusConstants = {
  onInitial: 'INITIAL',
  onSuccess: 'SUCCESS',
  onLoading: 'LOADING',
  onFailure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    covidData: [],
    activeStatus: statusConstants.onInitial,
    lastSevenDaysData: [],
    vaccinationByAgeData: [],
    vaccinationByGenderData: [],
  }

  componentDidMount() {
    this.getApiData()
  }

  getApiData = async () => {
    this.setState({activeStatus: statusConstants.onLoading})
    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'

    try {
      const response = await fetch(covidVaccinationDataApiUrl)

      if (response.ok) {
        console.log("It's Success")
        const fetchedData = await response.json()
        console.log(fetchedData)
        const updatedData = fetchedData.last_7_days_vaccination.map(
          eachDay => ({
            dose1: eachDay.dose_1,
            dose2: eachDay.dose_2,
            vaccineDate: eachDay.vaccine_date,
          }),
        )
        const updatedAgeData = fetchedData.vaccination_by_age.map(eachAge => ({
          age: eachAge.age,
          count: eachAge.count,
        }))
        const updateGenderData = fetchedData.vaccination_by_gender.map(
          eachGender => ({
            count: eachGender.count,
            gender: eachGender.gender,
          }),
        )
        this.setState({
          lastSevenDaysData: updatedData,
          vaccinationByAgeData: updatedAgeData,
          vaccinationByGenderData: updateGenderData,
          activeStatus: statusConstants.onSuccess,
        })
      } else {
        console.log('Fetch Failed')
        this.setState({activeStatus: statusConstants.onFailure})
      }
    } catch (error) {
      console.log('Fetch Failed')
      this.setState({activeStatus: statusConstants.onFailure})
    }
  }

  getVaccinationCoverage = () => {
    const {lastSevenDaysData} = this.state
    return (
      <div className="chart-container">
        <h1 className="description">Vaccination Coverage</h1>
        <VaccinationCoverage data={lastSevenDaysData} />
      </div>
    )
  }

  getVaccinationByage = () => {
    const {vaccinationByAgeData} = this.state
    return (
      <div className="chart-container">
        <h1 className="description">Vaccination by Age</h1>
        <VaccinationByAge data={vaccinationByAgeData} />
      </div>
    )
  }

  getVaccinationByGender = () => {
    const {vaccinationByGenderData} = this.state
    return (
      <div className="chart-container">
        <h1 className="description">Vaccination by gender</h1>
        <VaccinationByGender data={vaccinationByGenderData} />
      </div>
    )
  }

  renderSuccessView = () => {
    const {
      lastSevenDaysData,
      vaccinationByAgeData,
      vaccinationByGenderData,
      activeStatus,
    } = this.state
    console.log(lastSevenDaysData)
    console.log(vaccinationByAgeData)
    console.log(vaccinationByGenderData)
    return (
      <div>
        {this.getVaccinationCoverage()}
        {this.getVaccinationByGender()}
        {this.getVaccinationByage()}
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Something went wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  getFinalRenderView = () => {
    const {activeStatus} = this.state
    switch (activeStatus) {
      case statusConstants.onSuccess:
        return this.renderSuccessView()
      case statusConstants.onFailure:
        return this.renderFailureView()
      case statusConstants.onLoading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="responsive-container">
          <div className="website-logo-name-con">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="website-logo"
            />
            <h1 className="website-name">Co-Win</h1>
          </div>
          <h1 className="description">CoWIN Vaccination in India</h1>

          {this.getFinalRenderView()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
