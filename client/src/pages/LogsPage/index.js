import React, { useState } from 'react';
import SearchSection from '../../components/SearchSection';
import SearchRequest from '../../api/SearchRequest';


const LogsPage = () => {
    //the date of logs being searched
    const [createdAt, setCreatedAt] = useState('');

    const [logs, setLogs] = useState([{}])

    const HandleCreatedAt = e => {
        setCreatedAt(e.target.value);
      };

    const getLogs = () => {
        SearchRequest('http://localhost:5000/logs/search', {createdAt: createdAt}, setLogs)
    }

    const mappedLogs = logs.map(({id, createdAt, messages}) =>     
    <tr key={id}><th scope="row">{id}</th><td>{createdAt}</td><td>{messages}</td></tr>);

  return (
    <main>
        Audit Logs
        <SearchSection 
        InputName1='date' InputType1='date' InputPh1='Date'
        InputName2='' InputType2='hidden' InputPh2=''
        SearchInput={HandleCreatedAt} SearchRequest={getLogs} mappedTable={mappedLogs}
        thead1='Date' thead2='Messages' thead3=''
        />
    </main>
  );
}


export default LogsPage;
