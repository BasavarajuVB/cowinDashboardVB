// Write your code here
import {PieChart, Cell, Pie, Legend} from 'recharts'
import './index.css'

const VaccinationByGender = props => {
  const {data} = props
  return (
    <PieChart width={1000} height={300}>
      <Pie
        cx="50%"
        cy="50%"
        data={data}
        startAngle={180}
        endAngle={0}
        innerRadius="40%"
        outerRadius="70%"
        dataKey="count"
      >
        <Cell name="Male" fill="#f54394" />
        <Cell name="Female" fill=" #5a8dee" />
        <Cell name="Others" fill=" #2cc6c6" />
      </Pie>
      <Legend iconType="circle" layout="horizontal" />
    </PieChart>
  )
}

export default VaccinationByGender
