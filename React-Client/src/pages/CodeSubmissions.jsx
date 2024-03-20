import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
  } from "@tremor/react";
import { format } from "date-fns";
import { Link } from 'react-router-dom';
import { FaArrowAltCircleLeft } from "react-icons/fa";

const CodeSubmissions = () => {
    const [submissions,setSubmissions] = useState(null)
    const fetchSubmissions = async()=>{
        const url = `${import.meta.env.VITE_API}/api/code-snippets`
        try{
            const response = await fetch(url, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (!response.ok) {
                console.log("Failed to fetch orders");
                return [];
              }
              const result = await response.json();
              console.log(result)
              return result.result;
        }catch(error){
            console.log(error);
            return null;
        }
    }

    useEffect(()=>{
        const fetchData = async()=>{
            const data  = await fetchSubmissions();
            if(data)data.reverse()
            setSubmissions(data);
        }
        fetchData()
    },[])
  return (
    <div>
        <div className='ml-10 mt-10'>
            <Link to={'/'} className='text-sm'><FaArrowAltCircleLeft className='inline mr-1 mb-1'/>Go back</Link>
            <h1 className='text-xl font-bold text-gray-800 mt-2'>Submissions</h1>
        </div>
        <div className='w-full max-w-[80rem] mx-auto'>
            <Table className="mt-4 overflow-auto h-[40rem] border border-gray-200 no-scrollbar">
                <TableHead className="bg-gray-200">
                <TableRow>
                    <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">id</TableHeaderCell>
                    <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</TableHeaderCell>
                    <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code Language</TableHeaderCell>
                    <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stdin</TableHeaderCell>
                    <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</TableHeaderCell>
                    <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</TableHeaderCell>
                    <TableHeaderCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Output</TableHeaderCell>
                </TableRow>
                </TableHead>
                <TableBody className="bg-white divide-y divide-gray-200">
                {submissions && submissions.map((submission) => (
                    <TableRow key={submission.id}>
                    <TableCell className="px-6 py-4 whitespace-nowrap">{submission.id}</TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">{submission.username}</TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">{submission.code_language}</TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">{submission.stdin || '--'}</TableCell>
                    <TableCell className="px-6 py-4 whitespace-normal max-w-[20rem]">{submission.source_code.slice(0,100)}</TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">{format(new Date(submission.submittedAt), "MMM dd, yyyy, hh:mm:ss a",{ timeZone: 'Asia/Kolkata' })}</TableCell>
                    <TableCell className="px-6 py-4 whitespace-normal max-w-[20rem]">{submission.code_output ? submission.code_output.slice(0,100) : '--' }</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    </div>
  )
}

export default CodeSubmissions
