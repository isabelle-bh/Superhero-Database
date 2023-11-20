
import React, {useEffect, useState} from 'react'
import './App.css'
import Header from './components/Header'
import MiddleSection from './components/MiddleSection';
import CreateListSection from './components/CreateListSection';
import AddToListSection from './components/AddToListSection';
import DeleteListSection from './components/DeleteListSection';

import SideNav from './components/SideNav'

function App() {

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => { 
    fetch('/api/superheroInfo')
      .then(res => res.json())
      .then(data => setBackendData(data))
  }, [])

  return (
    <div>
      <SideNav />
      <Header />
      <MiddleSection />
      <AddToListSection />
      <CreateListSection />
      <DeleteListSection />
    </div>
  )
}

export default App