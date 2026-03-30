import AcceptRejectTable from '@/components/tables/AcceptRejectTable'
import TableComponent from '@/components/tables/TableComponent'

const ActiveSubmissions = () => {
  const data = [
  { submissionId: 1, location: 'New York', areaClaimed: '100 ha', status: 'Approved' },
  { submissionId: 2, location: 'Los Angeles', areaClaimed: '150 ha', status: 'Pending' },
  { submissionId: 3, location: 'Los Angeles', areaClaimed: '150 ha', status: 'In progress' },
];
  return (
    <div>
        <h1 className='text-3xl font-bold'>Active Submissions</h1> <br />
        <TableComponent rows={data} onClick={()=>{}}/>
    </div>
  )
}

export default ActiveSubmissions