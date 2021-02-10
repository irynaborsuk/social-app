import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useStatistics } from '../../providers/statistics.provider';

const gridDateFormatter = ({ value }: { value: string }) => {
	const date = new Date(value);
	const day = ('0' + date.getDate().toString()).slice(-2);
	const month = ('0' + (date.getMonth() + 1).toString()).slice(-2);
	const year = date.getFullYear();
	const hours = ('0' + date.getHours().toString()).slice(-2);
	const minutes = ('0' + date.getMinutes().toString()).slice(-2);
	const seconds = ('0' + date.getSeconds().toString()).slice(-2);
	return `${day}-${month}-${year} at ${hours}:${minutes}:${seconds}`;
};

const columnDefs = [
	{
		headerName: 'Participant', sortable: true, filter: true,
		children: [
			{ headerName: 'User Name', field: 'userName', sortable: true, filter: true, checkboxSelection: true},
		]
	},
	{
		headerName: 'Post Statistics', sortable: true, filter: true,
		children: [
			{ headerName: 'Posts Count', field: 'postsCount', sortable: true, filter: true, columnGroupShow: 'closed'},
			{ headerName: 'Comments Count', field: 'commentsCount', sortable: true, filter: true, columnGroupShow: 'open'},
			{ headerName: 'Content Symbols Count', field: 'contentSymbolsCount', sortable: true, filter: true, columnGroupShow: 'open'},
			{ headerName: 'Last Updated', field: 'lastUpdated', sortable: true, filter: true, columnGroupShow: 'open', valueFormatter: gridDateFormatter},
			{ headerName: 'Last Created', field: 'lastCreated', sortable: true, filter: true, columnGroupShow: 'open', valueFormatter: gridDateFormatter},
		]
	},
]

const PostStatistic = () => {
	const statistics = useStatistics();
	const [gridApi, setGridApi] = useState(null);
	const [gridColumnApi, setGridColumnApi] = useState(null);

	const [rowData, setRowData] = useState([]);

	useEffect(() => {
		console.log(statistics)
	}, [statistics])

	return (
		<div>
			<div className="ag-theme-alpine" style={{ height: 400, width: 'auto' }}>
				<AgGridReact
					rowData={statistics}
					columnDefs={columnDefs}
					rowSelection="multiple"
					animateRows>

				</AgGridReact>
			</div>
		</div>
	);
};

export default PostStatistic;
