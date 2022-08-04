import React, { useEffect, useState } from 'react';
import useStyles from './styles';
import { Paper, Table, TableContainer, TableCell, TableHead, TableBody, TableRow } from '@material-ui/core'
import { api } from '../../api/index'




export default function Leaderboard() {
    const classes = useStyles();
    const [leaderboard, setLeaderboard] = useState(null)

    useEffect(() => {
        async function loadLeaderboard() {
            const fetchLeaderboard = await api.get("/user/leaderboard")
            setLeaderboard(fetchLeaderboard.data)
        }
        loadLeaderboard()
    }, [])
    
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Points</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {leaderboard?.map((row) => (
                        <TableRow
                            key={row._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.points}</TableCell>
                        </TableRow>
                    )) ?? "Loading"}
                </TableBody>
            </Table>
        </TableContainer>
    );
}