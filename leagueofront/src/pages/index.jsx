import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Login from './login';


export default function Home() {
   const [activeTab, setActiveTab] = useState('ACCUEIL');

 
  return (
    <>
      <Head>
        <title>League of Cards</title>
        <meta name="description" content="League of Legends" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Login />
    </>
    
  );
}